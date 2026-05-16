import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AiMessage } from './AiMessage';
import { AiTypingIndicator } from './AiTypingIndicator';
import { AiQuickReplies } from './AiQuickReplies';
import { AiLeadForm } from './AiLeadForm';
import { useAiStore, useCalculatorStore, useUiStore } from '../../store';

export const AiChatWindow: React.FC = () => {
  const { isOpen, setIsOpen, sessionId } = useAiStore();
  const { area, tariff, objectType } = useCalculatorStore();
  const { activeSection } = useUiStore();
  
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'ai', text: 'Помочь рассчитать стоимость ремонта и выбрать тариф?' }]);
      setQuickReplies(['Рассчитать стоимость', 'Выбрать тариф', 'Узнать про сроки', 'Что входит в смету?']);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, showLeadForm]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const newMessages: { role: 'user' | 'ai', text: string }[] = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInput('');
    setQuickReplies([]);
    setIsLoading(true);
    
    // Check if user is asking to send to manager / leave request
    if (text.toLowerCase().includes('менеджер') || text.toLowerCase().includes('заявк') || text.toLowerCase().includes('расчет')) {
       // Just heuristic to show form, not strictly req but nice
    }

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: text,
          pageContext: activeSection,
          history: messages,
          leadData: { area, repairType: tariff?.id, objectType }
        })
      });
      
      if (!response.ok) throw new Error('API Error');
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.answer || 'Произошла ошибка связи с ИИ.' }]);
      if (data.suggestedActions) {
        setQuickReplies(data.suggestedActions);
      }
      
      // If AI asks to pass data to manager or asks for name
      if (data.answer && (data.answer.toLowerCase().includes('вас зовут') || data.answer.toLowerCase().includes('номер') || data.answer.toLowerCase().includes('менеджер'))) {
        setShowLeadForm(true);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: 'К сожалению, сервис временно недоступен.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSubmit = async (data: { name: string; phone: string }) => {
    setShowLeadForm(false);
    setMessages(prev => [...prev, { role: 'user', text: `Меня зовут ${data.name}, телефон ${data.phone}` }]);
    setIsLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'ai_assistant',
          name: data.name,
          phone: data.phone,
          area,
          objectType,
          repairType: tariff?.id
        })
      });
      setMessages(prev => [...prev, { role: 'ai', text: 'Спасибо. Передал данные менеджеру. Он свяжется с вами для точной сметы.' }]);
      setQuickReplies([]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Произошла ошибка при отправке заявки.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-[80px] right-2 left-2 md:left-auto md:right-10 md:w-[450px] bg-black text-white border-4 border-white brutal-shadow z-50 flex flex-col origin-bottom-right rounded-sm"
          style={{ height: 'min(650px, calc(100vh - 100px))' }}
        >
          {/* Header */}
          <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-white">
            <div className="font-bold uppercase tracking-widest flex items-center gap-3">
              <span className="w-3 h-3 block bg-[#D5FF00] animate-pulse"></span>
              AI Ассистент
            </div>
            <button 
              className="text-[#D5FF00] font-bold text-2xl hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-black">
            {messages.map((m, i) => (
              <AiMessage key={i} role={m.role} text={m.text} />
            ))}
            
            {isLoading && <AiTypingIndicator />}
            
            {showLeadForm && !isLoading && (
              <AiLeadForm onSubmit={handleLeadSubmit} />
            )}
            
            {!isLoading && quickReplies.length > 0 && !showLeadForm && (
              <div className="mt-2">
                <AiQuickReplies replies={quickReplies} onSelect={handleSend} />
              </div>
            )}
            
            <div ref={bottomRef} />
          </div>
          
          {/* Input field */}
          <div className="p-4 border-t-4 border-white bg-black flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend(input)}
              placeholder="Ваш вопрос..."
              disabled={isLoading || showLeadForm}
              className="flex-1 p-3 border-4 border-white bg-black text-white font-bold outline-none focus:bg-[#D5FF00] focus:text-black focus:border-[#D5FF00] disabled:opacity-50"
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={isLoading || showLeadForm || !input.trim()}
              className="px-4 py-3 bg-[#D5FF00] border-4 border-[#D5FF00] font-bold text-black uppercase transition-transform active:translate-y-1 active:translate-x-1 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_0_#fff] disabled:opacity-50 disabled:transform-none disabled:shadow-none"
            >
              &gt;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
