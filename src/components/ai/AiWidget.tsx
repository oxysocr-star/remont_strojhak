import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAiStore, useCalculatorStore } from '../../store';
import { AiChatWindow } from './AiChatWindow';
import { trackEvent } from '../../lib/analytics';

export const AiWidget = () => {
  const { isOpen, setIsOpen } = useAiStore();
  const [isVisible, setIsVisible] = useState(false);
  const calculatorStore = useCalculatorStore();
  const hasViewedCalc = useRef(false);

  useEffect(() => {
    // Триггер по времени: 25 секунд
    const timer = setTimeout(() => {
      if (!isVisible) {
        setIsVisible(true);
        trackEvent('ai_widget_auto_trigger', { method: 'timer' });
      }
    }, 25000);

    const handleScroll = () => {
      // Триггер по скроллу: 40%
      const scrollDepth = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollDepth > 0.4 && !isVisible) {
        setIsVisible(true);
        trackEvent('ai_widget_auto_trigger', { method: 'scroll' });
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Триггер по exit intent (если курсор уходит вверх)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isVisible) {
        setIsVisible(true);
        trackEvent('ai_widget_auto_trigger', { method: 'exit_intent' });
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  useEffect(() => {
    // Триггер после калькулятора (когда шаг стал больше 1)
    if (calculatorStore.step > 1 && !hasViewedCalc.current) {
      setIsVisible(true);
      hasViewedCalc.current = true;
      trackEvent('ai_widget_auto_trigger', { method: 'calculator' });
    }
  }, [calculatorStore.step]);

  const hasViewedCases = useRef(false);
  const aiStore = useAiStore();
  useEffect(() => {
    if (aiStore.viewedCasesCount >= 2 && !hasViewedCases.current) {
      setIsVisible(true);
      hasViewedCases.current = true;
      trackEvent('ai_widget_auto_trigger', { method: 'cases' });
    }
  }, [aiStore.viewedCasesCount]);

  const handleManualOpen = () => {
    setIsOpen(true);
    trackEvent('ai_widget_manual_open');
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleManualOpen}
            className="fixed bottom-24 md:bottom-8 right-6 z-50 cursor-pointer bg-black text-[#D5FF00] border-4 border-black p-4 font-bold uppercase tracking-widest shadow-[8px_8px_0_0_#D5FF00] hover:shadow-[12px_12px_0_0_#D5FF00] hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-y-1 active:translate-x-1 active:shadow-[2px_2px_0_0_#D5FF00]"
          >
            AI-Ассистент
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && <AiChatWindow />}
      </AnimatePresence>
    </>
  );
};
