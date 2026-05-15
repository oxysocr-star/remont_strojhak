import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAiStore } from '../../store';
import { AiChatWindow } from './AiChatWindow';
import { trackEvent } from '../../lib/analytics';

export const AiWidget = () => {
  const { isOpen, setIsOpen } = useAiStore();
  const [isVisible, setIsVisible] = useState(true);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  useEffect(() => {
    if (isOpen) {
      trackEvent('ai_opened', { sessionId });
    }
  }, [isOpen]);

  return (
    <>
       <AnimatePresence>
         {isVisible && !isOpen && (
           <motion.button
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0 }}
             onClick={() => { setIsOpen(true); setIsVisible(false); }}
             className="fixed bottom-20 right-4 lg:bottom-10 lg:right-10 bg-[#D5FF00] text-black w-14 h-14 lg:w-16 lg:h-16 rounded-full brutal-border brutal-shadow z-[9998] flex items-center justify-center font-bold text-xl lg:text-2xl"
           >
             AI
           </motion.button>
         )}
       </AnimatePresence>

       <AnimatePresence>
         {isOpen && (
           <AiChatWindow 
             sessionId={sessionId} 
             onClose={() => { setIsOpen(false); setIsVisible(true); }} 
           />
         )}
       </AnimatePresence>
    </>
  );
};
