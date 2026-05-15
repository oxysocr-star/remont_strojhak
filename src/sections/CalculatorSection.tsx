import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useCalculatorStore } from '../store';
import { CalculatorStep } from '../components/calculator/CalculatorStep';
import { CalculatorResult } from '../components/calculator/CalculatorResult';
import { trackEvent } from '../lib/analytics';

export const CalculatorSection = () => {
  const { step, reset } = useCalculatorStore();

  useEffect(() => {
    if (step === 1) {
      trackEvent('calculator_started');
    }
  }, [step]);

  return (
    <section id="calculator" className="py-24 bg-[#D5FF00] border-y-4 border-black overflow-hidden">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto bg-white p-8 brutal-border brutal-shadow"
        >
          <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-black">
            <h2 className="text-3xl font-display font-bold uppercase">Калькулятор</h2>
            <div className="text-sm font-bold opacity-50">ШАГ {step} ИЗ 5</div>
          </div>
          
          <div className="min-h-[300px]">
            {step < 5 ? (
              <CalculatorStep />
            ) : (
              <CalculatorResult />
            )}
          </div>
          
          {step === 5 && (
            <button onClick={reset} className="text-xs uppercase font-bold mt-4 underline opacity-50 mx-auto block">Начать заново</button>
          )}
        </motion.div>
      </div>
    </section>
  );
};
