import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { trackEvent } from '../lib/analytics';
import { casesData } from '../data';

const testimonials = casesData.filter(c => c.review).map((c, idx) => ({
  name: c.review!.name,
  quote: c.review!.likedAfter,
  rating: c.review!.rating,
  avatar: [
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
  ][idx % 3]
}));

export const HeroSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden relative">
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.2 }}
              className="font-display font-bold uppercase leading-[1.1] mb-6 text-4xl sm:text-5xl lg:text-6xl group cursor-default"
            >
              <motion.span 
                initial={{ opacity: 0, x: -30, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  y: [10, -5, 0],
                }}
                transition={{ 
                  opacity: { duration: 0.5 },
                  y: { duration: 0.8, times: [0, 0.6, 1], ease: "easeOut" },
                  x: { duration: 0.6 }
                }}
                className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:-rotate-2"
              >РЕМОНТ</motion.span> <br/> 
              <motion.span 
                initial={{ opacity: 0, x: -30, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  y: [10, -5, 0],
                }}
                transition={{ 
                  opacity: { duration: 0.5, delay: 0.15 },
                  y: { duration: 0.8, delay: 0.15, times: [0, 0.6, 1], ease: "easeOut" },
                  x: { duration: 0.6, delay: 0.15 }
                }}
                className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2 group-hover:rotate-2"
              >БЕЗ</motion.span> <br/>
              <motion.span 
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: [0.9, 1.05, 1],
                }}
                transition={{ 
                  opacity: { duration: 0.5, delay: 0.3 },
                  y: { duration: 0.7, delay: 0.3, type: "spring", stiffness: 200 },
                  scale: { duration: 0.7, delay: 0.3, times: [0, 0.7, 1] }
                }}
                className="bg-[#D5FF00] inline-block px-2 mt-1 text-black brutal-border rotate-[-1deg] transition-all duration-300 ease-out group-hover:rotate-[3deg] group-hover:scale-105 group-hover:shadow-[6px_6px_0_0_#000]"
              >
                СРЫВОВ И ДОПЛАТ
              </motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 1, 
                y: [10, 0],
                transition: { duration: 0.8, delay: 0.5 }
              }}
              whileInView={{
                y: [0, -4, 0],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="text-lg md:text-xl font-medium mb-10 max-w-lg text-gray-800"
            >
              Фиксируем смету и сроки в договоре. Показываем ход работ в видеоотчетах. Сдаем объект по понятному графику.
            </motion.p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
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
              <Button variant="outline" size="lg" onClick={async () => {
                trackEvent('share_click');
                try {
                  if (navigator.share) {
                    await navigator.share({
                      title: 'СтройХак - Ремонт без срывов и доплат',
                      text: 'Ремонт вашей квартиры под ключ: с понятной сметой, подбором материалов и отчетами.',
                      url: window.location.href,
                    });
                  } else {
                    await navigator.clipboard.writeText(window.location.href);
                    alert('Ссылка скопирована в буфер обмена!');
                  }
                } catch (error) {
                  console.error('Error sharing', error);
                }
              }} title="Поделиться" className="!px-4">
                <Share2 className="w-6 h-6" />
              </Button>
            </div>

            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              whileHover={{ x: 5 }}
              onClick={() => {
                trackEvent('tertiary_cta_click');
                document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 text-sm font-bold uppercase group cursor-pointer mb-12 text-gray-500 hover:text-black transition-colors"
            >
              <span className="border-b-2 border-transparent group-hover:border-[#D5FF00] transition-all pb-0.5">
                Оставить заявку на консультацию
              </span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
            
            {/* Testimonials Carousel */}
            <div className="relative bg-white brutal-border p-6 mb-12 shadow-[4px_4px_0_0_#000]">
              <div className="absolute -top-3 -left-3 bg-[#D5FF00] p-2 brutal-border">
                <Quote className="w-5 h-5" />
              </div>
              <div className="overflow-hidden relative h-32 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { 
                        opacity: 1,
                        transition: { staggerChildren: 0.15 }
                      },
                      exit: { 
                        opacity: 0,
                        transition: { duration: 0.2 }
                      }
                    }}
                    className="absolute inset-0 flex flex-col justify-center"
                  >
                    <motion.p 
                      variants={{
                        hidden: { opacity: 0, y: 15, filter: 'blur(5px)' },
                        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: "easeOut" } },
                        exit: { opacity: 0, y: -15, filter: 'blur(5px)', transition: { duration: 0.3 } }
                      }}
                      className="text-sm font-medium italic mb-4 leading-snug text-gray-800"
                    >
                      "{testimonials[currentTestimonial].quote}"
                    </motion.p>
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
                        exit: { opacity: 0, transition: { duration: 0.1 } }
                      }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <motion.img 
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          src={testimonials[currentTestimonial].avatar} 
                          alt={testimonials[currentTestimonial].name}
                          className="w-10 h-10 rounded-full border-2 border-black object-cover cursor-pointer"
                        />
                        <span className="font-bold text-sm uppercase">{testimonials[currentTestimonial].name}</span>
                      </div>
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        animate="idle"
                        initial="idle"
                        className="relative flex items-center text-[#D5FF00] drop-shadow-[1px_1px_0px_rgba(0,0,0,1)] text-sm tracking-widest cursor-pointer overflow-hidden py-1 px-2 transition-transform duration-300"
                        onMouseEnter={() => trackEvent('testimonial_rating_hover')}
                      >
                        <motion.div 
                          className="relative z-10 flex"
                          whileHover="shimmer"
                        >
                          {Array(testimonials[currentTestimonial].rating).fill(null).map((_, i) => (
                            <motion.span
                              key={i}
                              className="inline-block"
                              variants={{
                                shimmer: {
                                  scale: [1, 1.4, 1],
                                  color: ["#D5FF00", "#FFFFFF", "#D5FF00"],
                                  transition: {
                                    duration: 0.5,
                                    delay: i * 0.08,
                                    repeat: Infinity,
                                    repeatDelay: 0.6
                                  }
                                },
                                hover: {
                                  scale: 1.5,
                                  rotate: [0, -10, 10, 0],
                                  transition: { duration: 0.3 }
                                }
                              }}
                              whileHover="hover"
                            >
                              ★
                            </motion.span>
                          ))}
                        </motion.div>
                        <motion.div 
                          variants={{
                            shimmer: {
                              left: ['-150%', '250%'],
                              transition: {
                                duration: 1.2,
                                repeat: Infinity,
                                ease: "linear"
                              }
                            }
                          }}
                          className="absolute h-full w-24 bg-white/40 blur-md -skew-x-[25deg] -left-full top-0 pointer-events-none"
                        />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between mt-4 border-t-2 border-black/10 pt-4">
                <div className="flex gap-1.5">
                  {testimonials.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentTestimonial(idx)}
                      className={`w-6 h-1.5 brutal-border transition-colors ${idx === currentTestimonial ? 'bg-black' : 'bg-gray-200'} hover:bg-black`}
                      aria-label={`Слайд ${idx + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={prevTestimonial}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 brutal-border hover:bg-[#D5FF00] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={nextTestimonial}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 brutal-border hover:bg-[#D5FF00] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Trust line */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm font-bold uppercase tracking-tight">
              <div className="flex items-center gap-2"><span className="text-[#D5FF00] text-xl" aria-hidden="true">✓</span> Смета в договоре</div>
              <div className="flex items-center gap-2"><span className="text-[#D5FF00] text-xl" aria-hidden="true">✓</span> Видеоотчеты с объекта</div>
              <div className="flex items-center gap-2"><span className="text-[#D5FF00] text-xl" aria-hidden="true">✓</span> Связь с прорабом 24/7</div>
              <div className="flex items-center gap-2"><span className="text-[#D5FF00] text-xl" aria-hidden="true">✓</span> Гарантия на работы</div>
            </div>
          </div>
          
          <div className="relative group cursor-pointer lg:w-[90%] lg:ml-auto">
             {/* Main Image Container */}
             <div className="brutal-border brutal-shadow p-2 bg-white relative z-10 w-full h-[400px] lg:h-[500px] transition-all duration-500 ease-in-out group-hover:-translate-y-3 group-hover:-translate-x-3 group-hover:shadow-[12px_12px_0_0_#000]">
                <div className="w-full h-full overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=1000&auto=format&fit=crop" 
                    alt="Ремонт квартиры" 
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-cover grayscale opacity-90 transition-all duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100"
                  />
                </div>
                
                {/* 147+ badge */}
                <div className="absolute -bottom-4 -right-4 bg-[#D5FF00] text-black p-4 brutal-border brutal-shadow transition-all duration-500 ease-out rotate-3 group-hover:rotate-12 group-hover:scale-110 z-20">
                  <div className="font-display font-bold text-2xl leading-none">147+</div>
                  <div className="text-xs font-bold uppercase mt-1">объектов</div>
                </div>
             </div>
             
             {/* Decorative Background */}
             <div className="absolute top-4 -right-4 w-full h-full bg-[#D5FF00] brutal-border transition-all duration-500 ease-in-out group-hover:top-8 group-hover:-right-8 -z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
