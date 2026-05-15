import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export const TrustSection = () => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { y: shouldReduceMotion ? 0 : 20, opacity: 0 },
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
