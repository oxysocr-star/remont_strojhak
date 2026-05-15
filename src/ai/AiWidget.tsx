import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAiStore } from '../store';
import { Button } from '../components/ui/Button';
import { trackEvent } from '../lib/analytics';

export const AiWidget = () => {
  const { isOpen, setIsOpen } = useAiStore();
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Trigger rules (show after 25 seconds globally or 40% scroll)
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 25000);
    
    const handleScroll = () => {
      const scrollDepth = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollDepth > 0.4 && !isVisible && !isOpen) {
        setIsVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible, isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'ai', text: 'Помочь рассчитать стоимость ремонта и выбрать тариф?' }]);
      trackEvent('ai_opened');
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    trackEvent('ai_message_sent', { message: text });
    
    const newMessages = [...messages, { role: 'user' as const, text }];
    setMessages(newMessages);
    setInput('');
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      
      if (!response.ok) throw new Error('API Error');
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.text || 'Произошла ошибка связи с ИИ.' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: 'К сожалению, сервис временно недоступен. Пожалуйста, оставьте заявку.' }]);
    }
  };

  const quickReplies = ['Рассчитать стоимость', 'Выбрать тариф', 'Узнать про сроки', 'Что входит в смету?'];

  return (
    <>
       {/* Small floating button */}
       <AnimatePresence>
         {isVisible && !isOpen && (
           <motion.button
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0 }}
             onClick={() => { setIsOpen(true); setIsVisible(false); }}
             className="fixed bottom-[84px] right-4 lg:bottom-10 lg:right-10 bg-[#D5FF00] text-black w-14 h-14 lg:w-16 lg:h-16 rounded-full brutal-border brutal-shadow z-50 flex items-center justify-center font-bold text-xl lg:text-2xl"
           >
             AI
           </motion.button>
         )}
       </AnimatePresence>

       {/* Chat window */}
       <AnimatePresence>
         {isOpen && (
           <motion.div
             initial={{ opacity: 0, y: 50, scale: 0.9 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: 50, scale: 0.9 }}
             className="fixed bottom-[74px] left-2 right-2 lg:bottom-10 lg:left-auto lg:right-10 w-auto lg:w-full max-w-sm sm:max-w-md bg-white brutal-border brutal-shadow flex flex-col z-50 mx-auto lg:mx-0 origin-bottom lg:origin-bottom-right"
             style={{ height: 'min(600px, calc(100vh - 90px))' }}
           >
             <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-[#D5FF00]">
               <div className="font-display font-bold uppercase flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-[#D5FF00] animate-pulse"></span>
                 AI Ассистент
               </div>
               <button className="font-bold text-xl px-2 hover:text-[#D5FF00]" onClick={() => { setIsOpen(false); setIsVisible(true); }}>×</button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50">
               {messages.map((m, i) => (
                 <div key={i} className={`max-w-[85%] p-4 brutal-border ${m.role === 'user' ? 'bg-[#D5FF00] self-end' : 'bg-white self-start'}`}>
                   <span className="font-medium text-sm">{m.text}</span>
                 </div>
               ))}
               <div ref={bottomRef} />
             </div>
             
             {messages.length === 1 && (
               <div className="p-2 flex flex-wrap gap-2 border-t border-gray-200">
                 {quickReplies.map(qr => (
                   <button 
                     key={qr} 
                     onClick={() => handleSend(qr)}
                     className="bg-gray-100 px-3 py-1 text-xs font-bold uppercase brutal-border hover:bg-black hover:text-[#D5FF00]"
                   >
                     {qr}
                   </button>
                 ))}
               </div>
             )}
             
             <div className="p-4 border-t-4 border-black bg-white flex gap-2">
                <input 
                  type="text" 
                  aria-label="Задать вопрос ИИ-ассистенту"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend(input)}
                  className="flex-1 p-2 border-2 border-black font-semibold focus:bg-[#D5FF00]/10"
                  placeholder="Ваш вопрос..."
                />
                <Button size="sm" onClick={() => handleSend(input)} aria-label="Отправить">&gt;</Button>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
    </>
  );
};
