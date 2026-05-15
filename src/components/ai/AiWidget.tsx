import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAiStore, useCalculatorStore, useUiStore } from '../../store';
import { AiChatWindow } from './AiChatWindow';

export const AiWidget: React.FC = () => {
  const { isOpen, setIsOpen } = useAiStore();
  const { step } = useCalculatorStore();
  const { caseViews } = useUiStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Through 25 seconds
    const timer = setTimeout(() => !isOpen && setIsVisible(true), 25000);
    
    // 2. Scroll 40%
    const handleScroll = () => {
      const scrollDepth = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollDepth > 0.4 && !isVisible && !isOpen) {
        setIsVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    // 3. Exit intent on desktop
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isVisible && !isOpen) {
        setIsVisible(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, isOpen]);

  // 4. After using calculator or viewing 2 cases
  useEffect(() => {
    if ((step > 3 || caseViews >= 2) && !isOpen) {
      setIsVisible(true);
    }
  }, [step, caseViews, isOpen]);

  return (
    <>
      <AnimatePresence>
        {isVisible && !isOpen && (
          <motion.button
            initial={{ opacity: 0, y: 50, scale: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => { setIsOpen(true); setIsVisible(false); }}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-16 h-16 bg-[#D5FF00] border-4 border-black flex items-center justify-center rounded-none z-50 text-black font-bold text-2xl brutal-shadow transition-transform active:translate-y-1 active:translate-x-1 hover:-translate-y-1 hover:-translate-x-1"
          >
            AI
          </motion.button>
        )}
      </AnimatePresence>

      <AiChatWindow />
    </>
  );
};
