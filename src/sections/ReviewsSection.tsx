import React from 'react';
import { motion } from 'motion/react';
import { casesData } from '../data';
import { trackEvent } from '../lib/analytics';

export const ReviewsSection = () => {
  const reviews = casesData.filter(c => c.review).map(c => ({
    name: c.review!.name,
    object: `${c.title}, ${c.area} м²`,
    fearBefore: c.review!.fearBefore,
    likedAfter: c.review!.likedAfter,
    rating: c.review!.rating,
    caseId: c.id,
    caseTitle: c.title,
    area: c.area
  }));

  return (
    <section className="py-24 bg-gray-50 border-y-4 border-black overflow-hidden" id="reviews">
      <div className="container">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-bold uppercase mb-16"
        >
          Что говорят <span className="bg-black text-white px-2 inline-block">клиенты</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true, margin: "-50px" }}
               transition={{ duration: 0.5, delay: i * 0.15 }}
               className="bg-white p-8 brutal-border brutal-shadow relative h-full flex flex-col"
             >
                <div className="font-bold font-display text-lg mb-6 leading-tight">
                  {r.name}, {r.caseTitle}, {r.area} м²
                </div>
                
                <div className="mb-6 flex-1 text-sm font-medium space-y-4">
                  <p>{r.fearBefore}</p>
                  <p>{r.likedAfter}</p>
                </div>
                
                <div className="mt-auto pt-4 flex flex-col items-start">
                  <div className="text-[#D5FF00] text-2xl tracking-widest mb-4 drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                    {Array(r.rating).fill('★').join('')}
                  </div>
                  <button 
                    onClick={() => {
                      trackEvent('review_case_click', { caseTitle: r.caseTitle });
                      document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-sm font-bold uppercase underline hover:text-[#D5FF00] transition-colors"
                  >
                    Смотреть кейс
                  </button>
                </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
