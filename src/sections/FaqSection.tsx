import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { faqData } from '../data';
import { Button } from '../components/ui/Button';
import { trackEvent } from '../lib/analytics';

export const FaqSection = () => {
  const [openId, setOpenId] = useState<string>('1');
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 bg-white" id="faq" aria-labelledby="faq-title">
      <div className="container max-w-4xl">
        <motion.h2 
          id="faq-title"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-bold uppercase mb-12 text-center"
        >
          Частые <span className="bg-[#D5FF00] px-2 inline-block">вопросы</span>
        </motion.h2>
        
        <div className="space-y-4" role="list">
          {faqData.map((faq, i) => (
            <React.Fragment key={faq.id}>
              <motion.div 
                role="listitem"
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className={`brutal-border ${openId === faq.id ? 'bg-[#D5FF00]' : 'bg-white hover:bg-gray-50'}`}
              >
                <button 
                  className="w-full text-left p-6 font-bold font-display uppercase text-lg flex justify-between items-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black"
                  onClick={() => {
                    const newId = openId === faq.id ? '' : faq.id;
                    setOpenId(newId);
                    if (newId) trackEvent('faq_opened', { faq_id: faq.id });
                  }}
                  aria-expanded={openId === faq.id}
                  aria-controls={`faq-content-${faq.id}`}
                >
                  {faq.question}
                  <span className="text-2xl ml-4" aria-hidden="true">{openId === faq.id ? '−' : '+'}</span>
                </button>
                {openId === faq.id && (
                  <div 
                    id={`faq-content-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-btn-${faq.id}`}
                    className="p-6 pt-0 font-medium text-black border-t-2 border-black/20"
                  >
                    {faq.answer}
                  </div>
                )}
              </motion.div>
              {i === 4 && (
                <div className="py-8 flex justify-center">
                  <Button variant="secondary" onClick={() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' })}>
                    ОСТАЛИСЬ ВОПРОСЫ? ЗАДАЙТЕ ИХ НАМ
                  </Button>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
