import React from 'react';
import { motion } from 'motion/react';

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
