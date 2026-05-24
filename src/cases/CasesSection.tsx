import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { casesData } from '../data';
import { Button } from '../components/ui/Button';
import { BeforeAfterSlider } from '../components/ui/BeforeAfterSlider';
import { trackEvent } from '../lib/analytics';

export const CasesSection = () => {
  const [filter, setFilter] = useState('Все');
  
  const filters = ['Все', 'До 50 м²', '50–90 м²', 'Премиум', 'Под аренду', 'Для жизни'];
  
  const filteredCases = casesData.filter(c => {
    if (filter === 'Все') return true;
    if (filter === 'До 50 м²') return c.area <= 50;
    if (filter === '50–90 м²') return c.area > 50 && c.area <= 90;
    if (filter === 'Премиум') return c.tariff === 'Премиум';
    if (filter === 'Под аренду') return c.objectType === 'rent';
    if (filter === 'Для жизни') return c.objectType === 'life';
    return true;
  });

  return (
    <section className="py-24 bg-white" id="cases">
      <div className="container">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-bold uppercase mb-8"
        >
          Наши <span className="bg-[#D5FF00] px-2 inline-block">кейсы</span>
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {filters.map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-4 py-2 font-bold uppercase text-sm brutal-border transition-colors ${filter === f ? 'bg-black text-[#D5FF00]' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {f}
            </button>
          ))}
        </motion.div>
        
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCases.map((c, i) => (
              <motion.div 
                key={c.id || i}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white brutal-border overflow-hidden flex flex-col transition-all duration-300 shadow-[3px_3px_0_0_#000] md:shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[8px_8px_0_0_#000,0_10px_20px_rgba(0,0,0,0.1)] md:hover:shadow-[12px_12px_0_0_#000,0_15px_30px_rgba(0,0,0,0.15)]"
              >
                <BeforeAfterSlider beforeImage={c.imageBefore} afterImage={c.imageAfter} />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-display font-bold text-2xl uppercase">{c.title} ({c.area} м²)</h3>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-100 p-4 border border-black mb-6 text-sm font-bold uppercase">
                     <div><span className="block text-gray-500 text-xs mb-1">Тариф</span>{c.tariff}</div>
                     <div><span className="block text-gray-500 text-xs mb-1">Срок</span>{c.durationDays} дн.</div>
                     <div className="col-span-2"><span className="block text-gray-500 text-xs mb-1">Бюджет</span>{c.budget.toLocaleString()} ₽</div>
                  </div>
                  <div className="mb-4">
                    <span className="font-bold uppercase text-sm block mb-1">Задача:</span>
                    <p className="font-medium text-sm">{c.task}</p>
                  </div>
                  <div className="mb-4">
                    <span className="font-bold uppercase text-sm block mb-1">Что сделали:</span>
                    <p className="font-medium text-sm">{c.workDone}</p>
                  </div>
                  <div className="mb-6 flex-1">
                    <span className="font-bold uppercase text-sm block mb-1 text-[#9dcc00]">Результат:</span>
                    <p className="font-medium text-sm">{c.result}</p>
                  </div>
                  
                  {c.review && (
                    <div className="bg-gray-50 p-4 border border-black mb-6">
                      <div className="flex items-center gap-1 text-[#D5FF00] drop-shadow-[1px_1px_0px_rgba(0,0,0,1)] text-lg mb-2">
                        {Array(c.review.rating).fill('★').join('')}
                      </div>
                      {c.review.fearBefore && (
                        <p className="text-sm italic font-medium mb-2">
                          <strong className="not-italic">Сомнения до:</strong> {c.review.fearBefore}
                        </p>
                      )}
                      <p className="text-sm italic font-medium">
                        <strong className="not-italic">В итоге:</strong> «{c.review.likedAfter}»
                      </p>
                      <div className="text-xs font-bold mt-3 text-gray-500 uppercase">— {c.review.name}</div>
                    </div>
                  )}
                  
                  <Button className="w-full mt-auto" onClick={() => {
                    trackEvent('case_opened', { caseTitle: c.title });
                    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    ХОЧУ ПОХОЖИЙ РЕМОНТ
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
