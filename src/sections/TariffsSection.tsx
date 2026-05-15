import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { tariffs } from '../data';
import { useCalculatorStore } from '../store';
import { Button } from '../components/ui/Button';
import { trackEvent } from '../lib/analytics';

export const TariffsSection = () => {
  const currentTariff = useCalculatorStore(s => s.tariff);
  const setTariff = useCalculatorStore(s => s.setTariff);
  const shouldReduceMotion = useReducedMotion();
  
  const handleSelect = (id: any) => {
    trackEvent('tariff_select', { tariff_id: id });
    setTariff(id);
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-gray-900 text-white overflow-hidden" id="tariffs" aria-labelledby="tariffs-title">
      <div className="container">
        <motion.h2 
          id="tariffs-title"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-bold uppercase mb-4 text-center"
        >
          3 УРОВНЯ ОТДЕЛКИ <br className="md:hidden" /> ПОД <span className="text-[#D5FF00]">РАЗНЫЕ ЗАДАЧИ</span>
        </motion.h2>
        <motion.p 
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center font-medium mb-16 text-gray-400 max-w-2xl mx-auto"
        >
          Базовый — для аренды. Комфорт — для жизни. Премиум — для сложных объектов.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch" role="list">
          {tariffs.map((t, i) => {
            const isSelected = currentTariff === t.id;
            return (
            <motion.div 
              key={i} 
              role="listitem"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`bg-black p-8 brutal-border transition-transform h-full flex flex-col ${isSelected ? 'border-[#D5FF00] -translate-y-2 shadow-[4px_4px_0px_#D5FF00]' : 'border-white hover:-translate-y-2 focus-within:-translate-y-2'}`}
            >
              <div className="mb-6">
                <h3 className="font-display font-bold text-3xl mb-1">{t.title}</h3>
                <p className="text-[#D5FF00] font-bold uppercase text-xs tracking-widest">{t.subtitle}</p>
              </div>
              <p className="text-gray-300 font-medium mb-8 flex-none min-h-[80px]">{t.description}</p>
              
              <div className="space-y-4 flex-1 mb-8">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-sm">Черновые работы</span>
                  <span className="text-[#D5FF00]" aria-label="Да">✓</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-sm">Чистовая отделка</span>
                  <span className="text-[#D5FF00]" aria-label="Да">✓</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-sm">Видеоотчеты</span>
                  <span className="text-[#D5FF00]" aria-label="Да">✓</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-sm">Подбор материалов</span>
                  <span className={t.features.materials ? "text-[#D5FF00]" : "text-gray-500"} aria-label={t.features.materials ? "Да" : "Нет"}>{t.features.materials === true ? '✓' : (t.features.materials === 'partial' ? 'Частично' : '—')}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-sm">Дизайн-сопровождение</span>
                  <span className={t.features.design ? "text-[#D5FF00]" : "text-gray-500"} aria-label={t.features.design ? "Да" : "Нет"}>{t.features.design === true ? '✓' : (t.features.design === 'partial' ? 'Частично' : '—')}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-sm">Авторский надзор</span>
                  <span className={t.features.supervision ? "text-[#D5FF00]" : "text-gray-500"} aria-label={t.features.supervision ? "Да" : "Нет"}>{t.features.supervision ? '✓' : '—'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-sm">Сложная инженерия</span>
                  <span className={t.features.engineering ? "text-[#D5FF00]" : "text-gray-500"} aria-label={t.features.engineering ? "Да" : "Нет"}>{t.features.engineering ? '✓' : '—'}</span>
                </div>
              </div>
              
              <Button 
                variant={isSelected ? "primary" : "outline"} 
                className="w-full mt-auto" 
                onClick={() => handleSelect(t.id)}
                aria-pressed={isSelected}
              >
                {isSelected ? "Выбран" : "Выбрать тариф"}
              </Button>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
