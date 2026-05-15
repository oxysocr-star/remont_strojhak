import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const MobileBottomNav = () => {
  const [activeSection, setActiveSection] = useState<string>('#');

  useEffect(() => {
    const handleScroll = () => {
      let current = '#';
      const sections = ['contacts', 'faq', 'cases', 'calculator', 'tariffs'];
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
    <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t-2 border-black z-[9999] flex justify-between items-center text-[10px] font-bold uppercase shadow-[0_-4px_20px_rgba(0,0,0,0.3)] h-16">
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
