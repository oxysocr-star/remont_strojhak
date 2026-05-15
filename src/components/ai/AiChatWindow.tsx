import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AiMessage } from './AiMessage';
import { AiQuickReplies } from './AiQuickReplies';
import { AiTypingIndicator } from './AiTypingIndicator';
import { AiLeadForm } from './AiLeadForm';
import { Button } from '../ui/Button';
import { AiChatRequest, AiChatResponse, AiMessage as AiMessageType } from '../../types';
import { trackEvent } from '../../lib/analytics';

interface AiChatWindowProps {
  onClose: () => void;
  sessionId: string;
}

export const AiChatWindow: React.FC<AiChatWindowProps> = ({ onClose, sessionId }) => {
  const [messages, setMessages] = useState<AiMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState<string[]>(['Сколько стоит ремонт?', 'Посмотреть кейсы', 'Этапы работ']);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackEvent('ai_opened', { sessionId });
    if (messages.length === 0) {
      setMessages([{ role: 'model', text: 'Здравствуйте! Я ИИ-ассистент "СтройХак". Помогу сориентироваться по ценам, срокам и этапам ремонта. Какой объект планируете обновлять?' }]);
    }
  }, []);

  useEffect(() => {
    if (isTyping) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'model') {
        const container = containerRef.current;
        if (container) {
          const messageElements = container.querySelectorAll('.ai-message-item');
          const lastMsgElement = messageElements[messageElements.length - 1] as HTMLElement;
          if (lastMsgElement) {
            container.scrollTo({
              top: lastMsgElement.offsetTop - 20, // offset for better visibility
              behavior: 'smooth'
            });
          }
        }
      } else {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    trackEvent('ai_message_sent');
    const userMessage: AiMessageType = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setSuggestedActions([]);

    try {
      const request: AiChatRequest = {
        sessionId,
        message: text,
        history: messages,
        pageContext: window.location.hash.replace('#', '') || 'home'
      };

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      
      let data: AiChatResponse = {} as AiChatResponse;
      try {
        const textResponse = await response.text();
        try {
          data = JSON.parse(textResponse);
        } catch (e) {
          if (response.status === 504) {
             throw new Error('Время ожидания ответа истекло (Vercel Timeout).');
          }
          throw new Error('Сервер вернул неправильный формат ответа: ' + textResponse.substring(0, 50));
        }
      } catch (err: any) {
        setMessages(prev => [...prev, { role: 'model', text: err.message || 'Произошла непредвиденная ошибка связи с сервером.' }]);
        setIsTyping(false);
        return;
      }

      if (!response.ok) {
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: data.error || 'Извините, произошла ошибка. Оставьте заявку, и мы вам перезвоним.' 
        }]);
        if (data.suggestedActions) setSuggestedActions(data.suggestedActions);
        return;
      }
      
      setMessages(prev => [...prev, { role: 'model', text: data.answer }]);
      if (data.suggestedActions) setSuggestedActions(data.suggestedActions);
      
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: 'Извините, произошла ошибка. Оставьте заявку, и мы вам перезвоним.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLeadSubmit = async (leadData: any) => {
    trackEvent('ai_lead_created');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadData,
          source: 'ai_assistant',
          area: 0,
          objectType: 'newBuilding',
          repairType: 'comfort'
        })
      });
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'model', text: 'Спасибо! Ваша заявка принята. Менеджер свяжется с вами в ближайшее время.' }]);
      }
    } catch (e) {
      // Handle error
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className="fixed bottom-16 left-2 right-2 lg:bottom-10 lg:left-auto lg:right-10 w-auto lg:w-full max-w-sm sm:max-w-md bg-white brutal-border brutal-shadow flex flex-col z-[10000] mx-auto lg:mx-0 origin-bottom lg:origin-bottom-right"
      style={{ height: 'min(600px, calc(100vh - 100px))' }}
    >
      <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-[#D5FF00]">
        <div className="font-display font-bold uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D5FF00] animate-pulse"></span>
          AI Ассистент
        </div>
        <button className="font-bold text-xl px-2 hover:text-[#D5FF00]" onClick={onClose}>×</button>
      </div>
      
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50">
        {messages.map((m, i) => (
          <AiMessage key={i} role={m.role} text={m.text} />
        ))}
        {isTyping && <AiTypingIndicator />}
        {suggestedActions.some(a => a === 'Оставить контакты') && (
           <AiLeadForm onSubmit={handleLeadSubmit} />
        )}
        <div ref={bottomRef} />
      </div>
      
      {suggestedActions.length > 0 && !isTyping && (
        <AiQuickReplies replies={suggestedActions.filter(a => a !== 'Оставить контакты')} onSelect={handleSend} />
      )}
      
      <div className="p-4 border-t-4 border-black bg-white flex gap-2">
         <input 
           type="text" 
           aria-label="Задать вопрос"
           value={input}
           onChange={e => setInput(e.target.value)}
           onKeyPress={e => e.key === 'Enter' && handleSend(input)}
           className="flex-1 p-2 border-2 border-black font-semibold focus:bg-[#D5FF00]/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D5FF00]"
           placeholder="Ваш вопрос..."
           disabled={isTyping}
         />
         <Button size="sm" onClick={() => handleSend(input)} aria-label="Отправить" disabled={isTyping}>
           {isTyping ? '...' : '>'}
         </Button>
      </div>
    </motion.div>
  );
};
