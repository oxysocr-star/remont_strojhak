import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { trackEvent } from '../lib/analytics';

export const ProblemsSection = () => (
  <section className="py-24 bg-gray-50 overflow-hidden" id="problems">
    <div className="container">
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-display font-bold uppercase mb-12 text-center"
      >
        Как мы решаем <span className="bg-[#D5FF00] px-2 inline-block">проблемы</span>
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { str: 'Начали за одну сумму, закончили за другую.', res: 'Фиксируем смету до старта. Дополнительные работы — только после согласования.' },
          { str: 'Рабочие пропадут и сорвут сроки.', res: 'Делаем график этапов и показываем прогресс в отчетах.' },
          { str: 'Нужно самому ездить и контролировать объект.', res: 'Отправляем фото и видеоотчеты. Прораб на связи в Telegram.' }
        ].map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white p-8 brutal-border brutal-shadow flex flex-col justify-between h-full"
          >
            <div>
              <div className="text-xs font-bold text-red-500 mb-2 uppercase">СТРАХ:</div>
              <p className="text-lg font-medium mb-8 leading-tight">{item.str}</p>
            </div>
            <div>
              <div className="text-xs font-bold text-[#9dcc00] mb-2 uppercase">РЕШЕНИЕ:</div>
              <p className="font-bold">{item.res}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-12 text-center"
      >
        <Button 
          size="lg" 
          onClick={() => {
            trackEvent('problems_cta_click');
            document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          РАССЧИТАТЬ СТОИМОСТЬ
        </Button>
      </motion.div>
    </div>
  </section>
);
