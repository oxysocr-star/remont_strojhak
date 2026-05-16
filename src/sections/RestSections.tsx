import React, { useState } from 'react';
import { motion } from 'motion/react';
import { faqData, casesData } from '../data';
import { Button } from '../components/ui/Button';
import { trackEvent } from '../lib/analytics';

export const ReviewsSection = () => {
  const reviews = casesData.filter(c => c.review).map(c => ({
    name: c.review!.name,
    object: `${c.title}, ${c.area} м²`,
    fearBefore: c.review!.fearBefore,
    likedAfter: c.review!.likedAfter,
    rating: c.review!.rating,
    caseId: c.id,
    caseTitle: c.title,
    area: c.area
  }));

  return (
    <section className="py-24 bg-gray-50 border-y-4 border-black overflow-hidden" id="reviews">
      <div className="container">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-bold uppercase mb-16"
        >
          Что говорят <span className="bg-black text-white px-2 inline-block">клиенты</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true, margin: "-50px" }}
               transition={{ duration: 0.5, delay: i * 0.15 }}
               className="bg-white p-8 brutal-border brutal-shadow relative h-full flex flex-col"
             >
                <div className="font-bold font-display text-lg mb-6 leading-tight">
                  {r.name}, {r.caseTitle}, {r.area} м²
                </div>
                
                <div className="mb-6 flex-1 text-sm font-medium space-y-4">
                  <p>{r.fearBefore}</p>
                  <p>{r.likedAfter}</p>
                </div>
                
                <div className="mt-auto pt-4 flex flex-col items-start">
                  <div className="text-[#D5FF00] text-2xl tracking-widest mb-4 drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                    {Array(r.rating).fill('★').join('')}
                  </div>
                  <button 
                    onClick={() => {
                      trackEvent('review_case_click', { caseTitle: r.caseTitle });
                      document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-sm font-bold uppercase underline hover:text-[#D5FF00] transition-colors"
                  >
                    Смотреть кейс
                  </button>
                </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

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
                  className="w-full text-left p-6 font-bold font-display uppercase text-lg flex justify-between items-center"
                  onClick={() => {
                    const newId = openId === faq.id ? '' : faq.id;
                    setOpenId(newId);
                    if (newId) trackEvent('faq_opened', { faq_id: faq.id });
                  }}
                  aria-expanded={openId === faq.id}
                >
                  {faq.question}
                  <span className="text-2xl ml-4" aria-hidden="true">{openId === faq.id ? '−' : '+'}</span>
                </button>
                {openId === faq.id && (
                  <div className="p-6 pt-0 font-medium text-black border-t-2 border-black/20">
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
