import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { casesData } from '../data';
import { CaseCard } from '../components/cases/CaseCard';

export const CasesSection = () => {
  const [filter, setFilter] = useState('Все');
  const shouldReduceMotion = useReducedMotion();
  
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
    <section className="py-24 bg-white" id="cases" aria-labelledby="cases-title">
      <div className="container">
        <motion.h2 
          id="cases-title"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-bold uppercase mb-8"
        >
          Наши <span className="bg-[#D5FF00] px-2 inline-block">кейсы</span>
        </motion.h2>
        
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-12"
          role="tablist"
          aria-label="Фильтр кейсов"
        >
          {filters.map(f => (
            <button 
              key={f} 
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 font-bold uppercase text-sm brutal-border transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D5FF00] ${filter === f ? 'bg-black text-[#D5FF00]' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {f}
            </button>
          ))}
        </motion.div>
        
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCases.map((c, i) => (
              <CaseCard key={c.id || i} caseData={c} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
