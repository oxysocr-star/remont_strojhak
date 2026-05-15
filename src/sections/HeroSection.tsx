import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { trackEvent } from '../lib/analytics';

export const HeroSection = () => {
  return (
    <section className="pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden relative">
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display font-bold uppercase leading-[1.1] mb-6 text-4xl sm:text-5xl lg:text-6xl"
            >
              РЕМОНТ <br/> БЕЗ <br/>
              <span className="bg-[#D5FF00] inline-block px-2 text-black brutal-border rotate-[-1deg]">
                СРЫВОВ И ДОПЛАТ
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl font-medium mb-10 max-w-lg text-gray-800"
            >
              Фиксируем смету и сроки в договоре. Показываем ход работ в видеоотчетах. Сдаем объект по понятному графику.
            </motion.p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" onClick={() => {
                trackEvent('hero_cta_click');
                document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                РАССЧИТАТЬ СТОИМОСТЬ
              </Button>
              <Button variant="secondary" size="lg" onClick={() => {
                trackEvent('secondary_cta_click');
                document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                ПОСМОТРЕТЬ КЕЙСЫ
              </Button>
            </div>
            
            {/* Trust line */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm font-bold uppercase tracking-tight">
              <div className="flex items-center gap-2"><span className="text-[#D5FF00] text-xl">✓</span> Смета в договоре</div>
              <div className="flex items-center gap-2"><span className="text-[#D5FF00] text-xl">✓</span> Видеоотчеты с объекта</div>
              <div className="flex items-center gap-2"><span className="text-[#D5FF00] text-xl">✓</span> Связь с прорабом 24/7</div>
              <div className="flex items-center gap-2"><span className="text-[#D5FF00] text-xl">✓</span> Гарантия на работы</div>
            </div>
          </div>
          
          <div className="relative">
             <div className="brutal-border brutal-shadow p-2 bg-white relative z-10 w-full h-[400px] lg:h-[500px]">
                <img 
                  src="https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=1000&auto=format&fit=crop" 
                  alt="Ремонт квартиры" 
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover grayscale opacity-90"
                />
                <div className="absolute bottom-6 right-6 bg-[#D5FF00] text-black p-4 brutal-border brutal-shadow transform rotate-3">
                  <div className="font-display font-bold text-xl leading-none">147+</div>
                  <div className="text-xs font-bold uppercase mt-1">объектов</div>
                </div>
             </div>
             {/* Decorative */}
             <div className="absolute top-4 -right-4 w-full h-full bg-[#D5FF00] brutal-border -z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
