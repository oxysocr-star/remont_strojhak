import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { trackEvent } from '../lib/analytics';
import { Copy, Check, MapPin, Phone, Send } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setScrollProgress((window.scrollY / scrollHeight) * 100);
      } else {
        setScrollProgress(0);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        
        {/* Progress Bar */}
        <div className="absolute left-0 bottom-[-4px] translate-y-full w-full h-2 md:h-3 bg-gray-100 border-b-2 border-black overflow-hidden z-40">
          <div 
            className="h-full bg-[#D5FF00] border-r-2 border-black" 
            style={{ width: `${scrollProgress}%` }}
          />
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

export const ContactsSection = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('+7 (999) 000-00-00').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="py-24 bg-white" id="contacts">
      <div className="container">
         <div className="max-w-2xl mx-auto text-center brutal-border brutal-shadow p-8 lg:p-12 bg-gray-50">
            <h2 className="text-3xl md:text-4xl font-display font-bold uppercase mb-6">
              Готовы начать? <br/> Оставьте заявку
            </h2>
            
            <div className="mb-6">
              <p className="text-sm font-bold uppercase mb-2">Или позвоните нам</p>
              <div 
                className="inline-flex items-center gap-3 bg-white brutal-border p-3 cursor-pointer hover:bg-[#D5FF00]/10 transition-colors group relative"
                onClick={handleCopy}
              >
                <span className="font-display font-bold text-xl md:text-2xl">+7 (999) 000-00-00</span>
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />}
                {copied && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-3 py-1 brutal-border shadow-sm whitespace-nowrap z-10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2">
                    Скопировано!
                  </div>
                )}
              </div>
            </div>

            <p className="font-medium mb-8">Наш менеджер свяжется с вами, чтобы обсудить ваш объект и ответить на вопросы.</p>
            <form className="flex flex-col gap-4" onSubmit={async (e) => { 
              e.preventDefault(); 
              trackEvent('contact_form_submitted', { source: 'footer_contacts' });
              const target = e.target as any;
              setStatus('loading');
              try {
                const res = await fetch('/api/leads', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: target['name'].value, phone: target['phone'].value })
                });
                if (!res.ok) throw new Error();
                setStatus('idle');
                toast.success('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
                target.reset();
              } catch(error) {
                setStatus('idle');
                toast.error('Произошла ошибка, пожалуйста, попробуйте позднее.');
              }
            }}>
              <div className="text-left w-full">
                <label htmlFor="name-input" className="block text-sm font-bold uppercase mb-1">Имя</label>
                <input id="name-input" name="name" type="text" placeholder="Иван" aria-label="Имя" className="w-full p-4 border-2 border-black font-bold focus:bg-[#D5FF00]/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black" required 
                  onChange={() => trackEvent('contact_form_started', { source: 'footer_contacts' })} />
              </div>
              <div className="text-left w-full">
                <label htmlFor="phone-input" className="block text-sm font-bold uppercase mb-1">Телефон</label>
                <input id="phone-input" name="phone" type="tel" placeholder="+7 (999) 000-00-00" aria-label="Телефон" className="w-full p-4 border-2 border-black font-bold focus:bg-[#D5FF00]/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black" required 
                  onChange={() => trackEvent('contact_form_started', { source: 'footer_contacts' })} />
              </div>
              <Button size="lg" type="submit" className="mt-2" disabled={status === 'loading'}>
                {status === 'loading' ? 'ОТПРАВЛЯЕМ...' : 'ОСТАВИТЬ ЗАЯВКУ'}
              </Button>
            </form>
         </div>
      </div>
    </section>
  );
};

export const Footer = () => (
  <footer className="bg-black text-white py-12 border-t-4 border-[#D5FF00] overflow-hidden">
    <div className="container flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
      <div className="flex flex-col gap-6 w-full md:w-auto">
        <div className="text-3xl font-bold font-display uppercase tracking-tighter">
          СТРОЙ<span className="text-[#D5FF00]">ХАК</span>
        </div>
        
        <div className="flex flex-col gap-3 text-sm opacity-80">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#D5FF00]" />
            <span>г. Москва, ул. Примерная, д. 10</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-[#D5FF00]" />
            <div className="flex flex-col font-medium">
              <a href="tel:+79990000000" className="hover:text-[#D5FF00] transition-colors">+7 (999) 000-00-00</a>
              <a href="tel:+78000000000" className="hover:text-[#D5FF00] transition-colors">+7 (800) 000-00-00</a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:items-end gap-6 w-full md:w-auto mt-4 md:mt-0">
        <div className="flex gap-4">
          <a href="#" className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-white/20 hover:bg-[#D5FF00] hover:text-black hover:border-[#D5FF00] transition-all" aria-label="Telegram" title="Telegram">
            <Send className="w-5 h-5 ml-[-2px]" />
          </a>
          <a href="#" className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-white/20 hover:bg-[#D5FF00] hover:text-black hover:border-[#D5FF00] transition-all" aria-label="ВКонтакте" title="ВКонтакте">
            <span className="font-bold text-sm tracking-tighter">VK</span>
          </a>
          <a href="#" className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-white/20 hover:bg-[#D5FF00] hover:text-black hover:border-[#D5FF00] transition-all" aria-label="Макс" title="Макс">
            <span className="font-bold text-lg leading-none">M</span>
          </a>
        </div>
        
        <div className="text-sm font-medium opacity-50 uppercase tracking-widest md:text-right">
          2024 © Все права защищены. <br className="hidden md:block" /> Ремонт квартир под ключ.
        </div>
      </div>
    </div>
  </footer>
);
