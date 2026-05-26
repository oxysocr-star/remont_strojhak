import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Loader2 } from 'lucide-react';
import { useAiStore, useCalculatorStore } from '../../store';
import { Button } from '../ui/Button';
import { AiMessage as AiMessageComponent } from './AiMessage';
import { AiQuickReplies } from './AiQuickReplies';
import { trackEvent } from '../../lib/analytics';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const AiChatWindow = () => {
  const { setIsOpen, sessionId } = useAiStore();
  const calculatorStore = useCalculatorStore();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'initial',
      role: 'assistant',
      content: 'Помочь рассчитать стоимость ремонта и выбрать тариф?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([
    'Рассчитать стоимость',
    'Выбрать тариф',
    'Узнать про сроки',
    'Что входит в смету?'
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    trackEvent('ai_chat_message_sent', { length: text.length });

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setSuggestedActions([]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          message: text,
          pageContext: 'global',
          leadData: {
            step: calculatorStore.step,
            area: calculatorStore.area,
            propertyType: calculatorStore.propertyType,
            tariff: calculatorStore.tariff
          }
        })
      });

      const data = await response.json();
      
      if (data.isLeadCaptured) {
        trackEvent('ai_chat_lead_captured', { phone: data.leadPhone });
      }

      const aiMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.answer || "Я не смог найти ответ на этот вопрос. Оставьте телефон, и наш инженер свяжется с вами."
      };
      
      setMessages(prev => [...prev, aiMsg]);
      if (data.suggestedActions) {
        setSuggestedActions(data.suggestedActions);
      }
      
    } catch (error: any) {
      console.error("AI_FETCH_ERROR", error);
      let errorMsg = "Извините, произошла ошибка подключения. Попробуйте еще раз.";
      if (error.message?.includes('Failed to fetch')) {
        errorMsg = "Ошибка подключения к серверу. Возможно, сервер еще не запущен или путь API неверный.";
      }
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: errorMsg
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%', scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: '100%', scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed bottom-24 md:bottom-8 right-0 md:right-6 w-full md:w-[400px] h-[600px] max-h-[80vh] bg-black text-white border-t-4 md:border-4 border-[#D5FF00] z-50 flex flex-col shadow-[8px_8px_0_0_#D5FF00]"
    >
      <div className="bg-black border-b-2 border-[#D5FF00] text-white p-4 flex justify-between items-center shrink-0">
        <h3 className="font-display font-bold text-xl uppercase tracking-widest text-[#D5FF00]">
          СТРОЙХАК AI
        </h3>
        <button onClick={() => setIsOpen(false)} className="hover:text-[#D5FF00] transition-colors p-1" aria-label="Закрыть">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black flex flex-col">
        {messages.map((msg) => (
          <AiMessageComponent key={msg.id} message={msg} />
        ))}
        {isTyping && (
          <div className="flex bg-black border-2 border-[#D5FF00] text-white p-3 self-start max-w-[85%] shadow-[4px_4px_0_0_#D5FF00] items-center gap-2">
            <span className="font-bold text-sm">AI печатает</span>
            <Loader2 className="w-4 h-4 animate-spin text-[#D5FF00] rounded-full" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-black border-t-2 border-[#D5FF00] shrink-0 relative">
        <AnimatePresence>
          {suggestedActions.length > 0 && !isTyping && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 10 }}
               className="pb-3 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide -mx-4 px-4"
            >
              <AiQuickReplies replies={suggestedActions} onSelect={sendMessage} />
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Спросите что-нибудь..."
            className="flex-1 border-2 border-[#D5FF00] bg-black text-white p-3 font-medium placeholder-gray-400 focus-visible:outline-none focus:bg-[#D5FF00]/10"
          />
          <Button type="submit" variant="primary" className="px-4" disabled={!input.trim() || isTyping}>
            <Send className="w-5 h-5 flex-shrink-0" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
};
