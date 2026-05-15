import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Case } from '../../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { Button } from '../ui/Button';
import { trackEvent } from '../../lib/analytics';

interface CaseCardProps {
  caseData: Case;
}

export const CaseCard: React.FC<CaseCardProps> = ({ caseData: c }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article 
      layout={!shouldReduceMotion}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-white brutal-border brutal-shadow overflow-hidden flex flex-col"
    >
      <BeforeAfterSlider beforeImage={c.imageBefore} afterImage={c.imageAfter} />
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-display font-bold text-2xl uppercase leading-tight">{c.title} ({c.area} м²)</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-100 p-4 border border-black mb-6 text-sm font-bold uppercase" role="group" aria-label="Характеристики объекта">
           <div><span className="block text-gray-500 text-xs mb-1">Тариф</span>{c.tariff}</div>
           <div><span className="block text-gray-500 text-xs mb-1">Срок</span>{c.durationDays} дн.</div>
           <div className="col-span-2"><span className="block text-gray-500 text-xs mb-1">Бюджет</span>{c.budget.toLocaleString()} ₽</div>
        </div>
        <div className="mb-4">
          <span className="font-bold uppercase text-sm block mb-1">Задача:</span>
          <p className="font-medium text-sm text-gray-700">{c.task}</p>
        </div>
        <div className="mb-4">
          <span className="font-bold uppercase text-sm block mb-1">Что сделали:</span>
          <p className="font-medium text-sm text-gray-700">{c.workDone}</p>
        </div>
        <div className="mb-6 flex-1">
          <span className="font-bold uppercase text-sm block mb-1 text-[#4CAF50]">Результат:</span>
          <p className="font-medium text-sm text-gray-800 font-bold">{c.result}</p>
        </div>
        
        {c.review && (
          <blockquote className="bg-gray-50 p-4 border border-black mb-6 border-l-8 border-l-[#D5FF00]">
            <div className="font-bold text-sm mb-1 uppercase text-gray-500">Отзыв клиента:</div>
            <p className="text-sm italic font-medium">«{c.review.likedAfter}»</p>
            <footer className="text-xs font-bold mt-2 text-gray-900">— {c.review.name}</footer>
          </blockquote>
        )}
        
        <Button className="w-full mt-auto" onClick={() => {
          trackEvent('case_opened', { caseTitle: c.title });
          document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
        }}>
          ХОЧУ ПОХОЖИЙ РЕМОНТ
        </Button>
      </div>
    </motion.article>
  );
};
