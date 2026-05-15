import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { trackEvent } from '../lib/analytics';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white border-b-4 border-black z-50">
        <div className="container flex justify-between items-center h-16 lg:h-20">
          <div className="text-2xl font-bold font-display uppercase tracking-tighter">
            СТРОЙ<span className="text-[#D5FF00]">ХАК</span>
          </div>
          
          <nav className="hidden lg:flex gap-6 font-bold font-display uppercase text-sm tracking-widest">
            <a href="#process" className="hover:text-[#D5FF00] hover:bg-black px-2 py-1 transition-colors">Как работаем</a>
            <a href="#tariffs" className="hover:text-[#D5FF00] hover:bg-black px-2 py-1 transition-colors">Тарифы</a>
            <a href="#calculator" className="hover:text-[#D5FF00] hover:bg-black px-2 py-1 transition-colors">Калькулятор</a>
            <a href="#cases" className="hover:text-[#D5FF00] hover:bg-black px-2 py-1 transition-colors">Кейсы</a>
            <a href="#faq" className="hover:text-[#D5FF00] hover:bg-black px-2 py-1 transition-colors">FAQ</a>
            <a href="#contacts" className="hover:text-[#D5FF00] hover:bg-black px-2 py-1 transition-colors">Контакты</a>
          </nav>

          <Button className="hidden lg:flex" onClick={() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' })}>
            Обсудить объект
          </Button>

          <button className="lg:hidden p-2 bg-black text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? 'X' : '☰'}
          </button>
        </div>
      </header>
      
      {/* Mobile nav placeholders as per spec, I'll add a simplified mobile bottom nav later if time allows. */}
    </>
  );
};

export const MobileBottomNav = () => {
  const [activeSection, setActiveSection] = useState<string>('#');

  useEffect(() => {
    const handleScroll = () => {
      let current = '#';
      const sections = ['contacts', 'cases', 'calculator', 'tariffs'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            current = id;
            break;
          }
        }
      }
      setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: '#', label: 'Главная', href: '#' },
    { id: 'tariffs', label: 'Тарифы', href: '#tariffs' },
    { id: 'calculator', label: 'Расчет', href: '#calculator' },
    { id: 'cases', label: 'Кейсы', href: '#cases' },
    { id: 'contacts', label: 'Заявка', href: '#contacts' }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t-2 border-black z-50 flex justify-between items-center text-[10px] font-bold uppercase pb-safe">
      {navItems.map((item, i) => {
        const isActive = activeSection === item.id;
        return (
          <a
            key={item.id}
            href={item.href}
            className={`relative flex-1 text-center py-4 transition-colors ${i !== navItems.length - 1 ? 'border-r-2 border-black' : ''} ${!isActive ? 'hover:bg-gray-100' : ''}`}
            onClick={() => setActiveSection(item.id)}
          >
            {isActive && (
              <motion.div
                layoutId="mobileNavIndicator"
                className="absolute inset-0 bg-[#D5FF00]"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ zIndex: -1 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
};

export const ContactsSection = () => (
  <section className="py-24 bg-white" id="contacts">
    <div className="container">
       <div className="max-w-2xl mx-auto text-center brutal-border brutal-shadow p-8 lg:p-12 bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-display font-bold uppercase mb-6">
            Готовы начать? <br/> Оставьте заявку
          </h2>
          <p className="font-medium mb-8">Наш менеджер свяжется с вами, чтобы обсудить ваш объект и ответить на вопросы.</p>
          <form className="flex flex-col gap-4" onSubmit={async (e) => { 
            e.preventDefault(); 
            trackEvent('contact_form_submitted', { source: 'footer_contacts' });
            const target = e.target as any;
            try {
              await fetch('/api/lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: target[0].value, phone: target[1].value })
              });
              alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
              target.reset();
            } catch(error) {
              alert('Произошла ошибка, попробуйте позднее.');
            }
          }}>
            <input type="text" placeholder="Имя" aria-label="Имя" className="p-4 border-2 border-black font-bold focus:bg-[#D5FF00]/10" required 
              onChange={() => trackEvent('contact_form_started', { source: 'footer_contacts' })} />
            <input type="tel" placeholder="Телефон" aria-label="Телефон" className="p-4 border-2 border-black font-bold focus:bg-[#D5FF00]/10" required 
              onChange={() => trackEvent('contact_form_started', { source: 'footer_contacts' })} />
            <Button size="lg" type="submit">ОСТАВИТЬ ЗАЯВКУ</Button>
          </form>
       </div>
    </div>
  </section>
);

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0.8,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
      transition={{ duration: 0.2 }}
      onClick={scrollToTop}
      className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 w-12 h-12 bg-[#D5FF00] border-2 border-black flex items-center justify-center brutal-shadow z-50 hover:bg-black hover:text-[#D5FF00] transition-colors"
      aria-label="Scroll to top"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 15-6-6-6 6"/>
      </svg>
    </motion.button>
  );
};

export const Footer = () => (
  <footer className="bg-black text-white py-12 border-t-4 border-[#D5FF00]">
    <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-2xl font-bold font-display uppercase tracking-tighter">
        СТРОЙ<span className="text-[#D5FF00]">ХАК</span>
      </div>
      <div className="text-sm font-medium opacity-50 uppercase tracking-widest text-center md:text-right">
        2024 © Все права защищены. <br/> Ремонт квартир под ключ.
      </div>
    </div>
  </footer>
);
