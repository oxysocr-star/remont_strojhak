import React, { useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { processSteps, tariffs } from '../data';
import { useCalculatorStore } from '../store';
import { Button } from '../components/ui/Button';
import { trackEvent } from '../lib/analytics';

// Trust Section
export const TrustSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
  <section className="py-12 bg-black text-white border-y-4 border-black">
    <div className="container">
      <h2 className="text-sm font-bold uppercase tracking-widest text-center mb-8 text-gray-400">ЦИФРЫ, КОТОРЫЕ СНИМАЮТ РИСКИ</h2>
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <motion.div variants={itemVariants}>
          <div className="text-4xl md:text-5xl font-display font-bold text-[#D5FF00] mb-2">147+</div>
          <div className="text-xs md:text-sm font-bold uppercase">объектов завершено</div>
        </motion.div>
        <motion.div variants={itemVariants}>
          <div className="text-4xl md:text-5xl font-display font-bold text-[#D5FF00] mb-2">0 ₽</div>
          <div className="text-xs md:text-sm font-bold uppercase">скрытых доплат после договора</div>
        </motion.div>
        <motion.div variants={itemVariants}>
          <div className="text-4xl md:text-5xl font-display font-bold text-[#D5FF00] mb-2">24/7</div>
          <div className="text-xs md:text-sm font-bold uppercase">связь с прорабом</div>
        </motion.div>
        <motion.div variants={itemVariants}>
          <div className="text-4xl md:text-5xl font-display font-bold text-[#D5FF00] mb-2">3 года</div>
          <div className="text-xs md:text-sm font-bold uppercase">гарантия на работы</div>
        </motion.div>
      </motion.div>
    </div>
  </section>
  );
};

// Problems Section
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

export const ProcessSection = () => {
  const prefersReducedMotion = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  });
  
  return (
    <section className="py-24 bg-white overflow-hidden" id="process" ref={ref}>
      <div className="container">
        <h2 className="text-4xl md:text-5xl font-display font-bold uppercase mb-16">
          Как проходит <span className="bg-[#D5FF00] px-2 inline-block">ремонт</span>
        </h2>
        
        <div className="relative max-w-3xl mx-auto">
           {/* Vertical Line */}
           <div className="absolute top-[32px] bottom-[32px] left-[20px] md:left-[24px] w-6 bg-white border-4 border-black overflow-hidden shadow-[4px_4px_0_0_#000] z-0">
             <motion.div 
               className="w-full h-full bg-[#D5FF00] origin-top"
               style={{ scaleY: prefersReducedMotion ? 1 : scaleY }}
             />
           </div>
           
           <div className="flex flex-col gap-8 relative z-10 w-full pl-0">
             {processSteps.map((step, i) => (
                <div key={i} className="flex flex-row items-stretch text-left mt-4 relative group">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white shrink-0 border-4 border-black brutal-shadow flex items-center justify-center font-display font-bold text-2xl md:text-3xl mb-0 z-10 mr-6 md:mr-8 group-hover:bg-[#D5FF00] transition-colors relative">
                    {step.num}
                  </div>
                  
                  <div className="flex-1 w-full bg-white p-5 md:p-6 border-4 border-black brutal-shadow flex flex-col h-full rounded-none group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[6px_6px_0_0_#000] lg:group-hover:shadow-[8px_8px_0_0_#000] transition-all self-center">
                    <h3 className="font-display font-bold text-xl md:text-2xl mb-2 uppercase">{step.title}</h3>
                    <p className="text-sm md:text-base font-medium mb-4 flex-1 text-gray-600">{step.description}</p>
                    <div className="block mt-auto">
                      <div className="text-[12px] md:text-sm font-bold uppercase text-black bg-[#D5FF00] inline-block px-3 py-2 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-center leading-tight">
                        {step.result}
                      </div>
                    </div>
                  </div>
                </div>
             ))}
           </div>
        </div>
      </div>
    </section>
  );
};

const featureDescriptions: Record<string, string> = {
  'Черновые работы': 'Штукатурка стен, разводка электрики и сантехники, стяжка пола и подготовка всех поверхностей.',
  'Чистовая отделка': 'Укладка плитки, ламината, поклейка обоев, покраска стен, установка межкомнатных дверей.',
  'Видеоотчеты': 'Еженедельные видеообзоры хода работ на объекте в закрытом мессенджере.',
  'Подбор материалов': 'Помощь в выборе и закупке чистовых материалов и сантехники с нашими скидками.',
  'Дизайн-сопровождение': 'Консультации дизайнера по ходу реализации проекта, помощь в выборе текстур.',
  'Авторский надзор': 'Контроль соответствия выполняемых работ дизайн-проекту автором проекта.',
  'Сложная инженерия': 'Проектирование и монтаж систем умного дома и приточно-вытяжной вентиляции.',
};

const FeatureItem = ({ label, value }: { label: string, value: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const description = featureDescriptions[label];

  return (
    <div 
      className="relative flex justify-between border-b border-gray-800 pb-2 cursor-help group/feat"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-sm underline decoration-gray-700 decoration-dotted underline-offset-4 group-hover/feat:decoration-[#D5FF00] transition-colors">{label}</span>
      <span className="text-sm font-bold">{value}</span>
      
      <AnimatePresence>
        {isHovered && description && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-3 w-64 p-3 bg-white text-black text-xs font-bold z-[60] border-2 border-black shadow-[4px_4px_0_0_#D5FF00]"
          >
            {description}
            <div className="absolute -bottom-2 left-4 w-3 h-3 bg-white border-b-2 border-r-2 border-black rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const TariffsSection = () => {
  const currentTariff = useCalculatorStore(s => s.tariff);
  const setTariff = useCalculatorStore(s => s.setTariff);
  
  const handleSelect = (id: any) => {
    trackEvent('tariff_select', { tariff_id: id });
    setTariff(id);
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-gray-900 text-white overflow-hidden" id="tariffs">
      <div className="container">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-bold uppercase mb-4 text-center"
        >
          3 УРОВНЯ ОТДЕЛКИ <br className="md:hidden" /> ПОД <span className="text-[#D5FF00]">РАЗНЫЕ ЗАДАЧИ</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center font-medium mb-16 text-gray-400 max-w-2xl mx-auto"
        >
          Базовый — для аренды. Комфорт — для жизни. Премиум — для сложных объектов.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {tariffs.map((t, i) => {
            const isSelected = currentTariff === t.id;
            return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`bg-black p-8 brutal-border transition-transform h-full flex flex-col ${isSelected ? 'border-[#D5FF00] -translate-y-2 shadow-[4px_4px_0px_#D5FF00]' : 'border-white hover:-translate-y-2'}`}
            >
              <div className="mb-6">
                <h3 className="font-display font-bold text-3xl mb-1">{t.title}</h3>
                <p className="text-[#D5FF00] font-bold uppercase text-xs tracking-widest mb-4">{t.subtitle}</p>
                <div className="text-xl font-bold bg-white text-black inline-block px-3 py-1 brutal-border shadow-[2px_2px_0px_#D5FF00]">{t.price}</div>
              </div>
              <p className="text-gray-300 font-medium mb-8 flex-none min-h-[60px]">{t.description}</p>
              
              <div className="space-y-4 flex-1 mb-8">
                <FeatureItem label="Черновые работы" value={<span className="text-[#D5FF00]">✓</span>} />
                <FeatureItem label="Чистовая отделка" value={<span className="text-[#D5FF00]">✓</span>} />
                <FeatureItem label="Видеоотчеты" value={<span className="text-[#D5FF00]">✓</span>} />
                
                <FeatureItem 
                  label="Подбор материалов" 
                  value={
                    <span className={t.features.materials ? "text-[#D5FF00]" : "text-gray-500"}>
                      {t.features.materials === true ? '✓' : (t.features.materials === 'partial' ? 'Частично' : '—')}
                    </span>
                  } 
                />
                
                <FeatureItem 
                  label="Дизайн-сопровождение" 
                  value={
                    <span className={t.features.design ? "text-[#D5FF00]" : "text-gray-500"}>
                      {t.features.design === true ? '✓' : (t.features.design === 'partial' ? 'Частично' : '—')}
                    </span>
                  } 
                />

                <FeatureItem 
                  label="Авторский надзор" 
                  value={
                    <span className={t.features.supervision ? "text-[#D5FF00]" : "text-gray-500"}>
                      {t.features.supervision ? '✓' : '—'}
                    </span>
                  } 
                />

                <FeatureItem 
                  label="Сложная инженерия" 
                  value={
                    <span className={t.features.engineering ? "text-[#D5FF00]" : "text-gray-500"}>
                      {t.features.engineering ? '✓' : '—'}
                    </span>
                  } 
                />
              </div>
              
              <Button variant={isSelected ? "primary" : "outline"} className={`w-full mt-auto ${!isSelected ? '!bg-transparent border-2 border-white !text-white hover:!bg-white hover:!text-black' : ''}`} onClick={() => handleSelect(t.id)}>
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
