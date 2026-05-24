import React, { useState } from 'react';
import { motion } from 'motion/react';
import { faqData } from '../data';
import { Button } from '../components/ui/Button';
import { trackEvent } from '../lib/analytics';

export const FaqSection = () => {
  const [openId, setOpenId] = useState<string>('1');

  return (
    <section className="py-24 bg-white" id="faq">
      <div className="container max-w-4xl">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-bold uppercase mb-12 text-center"
        >
          Частые <span className="bg-[#D5FF00] px-2 inline-block">вопросы</span>
        </motion.h2>
        
        <div className="space-y-4">
          {faqData.map((faq, i) => (
            <React.Fragment key={faq.id}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className={`brutal-border ${openId === faq.id ? 'bg-[#D5FF00]' : 'bg-white hover:bg-gray-50'}`}
              >
                <button 
                  className="w-full text-left px-5 py-4 md:px-8 md:py-6 font-bold font-display uppercase text-base md:text-xl flex justify-between items-center"
                  onClick={() => {
                    const newId = openId === faq.id ? '' : faq.id;
                    setOpenId(newId);
                    if (newId) trackEvent('faq_opened', { faq_id: faq.id });
                  }}
                  aria-expanded={openId === faq.id}
                >
                  <span className="pr-4">{faq.question}</span>
                  <span className="text-2xl md:text-4xl ml-auto flex-shrink-0 leading-none" aria-hidden="true">{openId === faq.id ? '−' : '+'}</span>
                </button>
                {openId === faq.id && (
                  <div className="px-5 pb-5 md:px-8 md:pb-6 font-medium text-sm md:text-base text-black">
                    <div className="border-t-2 border-black/20 pt-4 md:pt-6">
                      {faq.answer}
                    </div>
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

export const GuaranteesSection = () => (
   <section className="py-24 bg-black text-white overflow-hidden" id="guarantees">
      <div className="container">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-display font-bold uppercase mb-12 text-center"
        >
          ФИКСИРУЕМ ОБЯЗАТЕЛЬСТВА В ДОГОВОРЕ
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { g: 'Смета', t: 'Стоимость работ фиксируется до старта' },
            { g: 'Сроки', t: 'Этапы прописываются в графике' },
            { g: 'Оплата', t: 'Платежи разбиваются по этапам' },
            { g: 'Отчеты', t: 'Клиент получает фото и видео' },
            { g: 'Ответственность', t: 'Условия фиксируются письменно' },
            { g: 'Гарантия', t: 'Работы передаются с гарантийными обязательствами' }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border-2 border-white p-6 bg-gray-900 brutal-shadow"
            >
              <div className="text-[#D5FF00] font-bold uppercase text-sm mb-2 opacity-80">{item.g}</div>
              <div className="font-bold text-lg">{item.t}</div>
            </motion.div>
          ))}
        </div>
      </div>
   </section>
);
