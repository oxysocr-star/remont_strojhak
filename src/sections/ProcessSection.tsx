import React from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { processSteps } from '../data';

export const ProcessSection = () => {
  const prefersReducedMotion = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  return (
    <section className="py-24 bg-white overflow-hidden" id="process" ref={ref}>
      <div className="container">
        <h2 className="text-4xl md:text-6xl font-display font-bold uppercase mb-20 text-center">
          Как проходит <span className="bg-[#D5FF00] px-3 inline-block brutal-border">ремонт</span>
        </h2>
        
        <div className="relative max-w-4xl mx-auto px-4 md:px-0">
          {/* Vertical Timeline Line */}
          <div className="absolute top-0 left-10 md:left-14 w-1 h-full bg-black -translate-x-1/2" />
          <motion.div 
            className="absolute top-0 left-10 md:left-14 w-1 bg-[#D5FF00] -translate-x-1/2 origin-top z-10"
            style={{ scaleY: prefersReducedMotion ? 1 : scaleY }}
          />
          
          <div className="space-y-16 md:space-y-24 relative z-20">
            {processSteps.map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex gap-8 items-start md:items-center group"
              >
                {/* Step Number */}
                <div className="w-12 h-12 md:w-20 md:h-20 bg-white brutal-border shrink-0 flex items-center justify-center font-display font-bold text-xl md:text-3xl shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all duration-300 group-hover:bg-[#D5FF00] group-hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] group-hover:-translate-x-1 group-hover:-translate-y-1">
                  {step.num}
                </div>
                
                {/* Info Card */}
                <div className="flex-1 bg-white p-6 md:p-8 brutal-border brutal-shadow transition-all duration-300 group-hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h3 className="font-display font-bold uppercase text-2xl md:text-3xl">{step.title}</h3>
                    <div className="text-[10px] md:text-xs font-bold uppercase text-black bg-[#D5FF00] inline-block px-3 py-1 brutal-border shadow-[2px_2px_0px_rgba(0,0,0,1)] self-start md:self-auto">
                      {step.result}
                    </div>
                  </div>
                  <p className="text-sm md:text-lg font-medium text-gray-700 leading-relaxed max-w-2xl">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
