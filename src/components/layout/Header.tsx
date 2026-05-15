import React, { useState } from 'react';
import { Button } from '../ui/Button';

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
            <a href="#process" className="hover:text-[#D5FF00] hover:bg-black px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D5FF00]">Как работаем</a>
            <a href="#tariffs" className="hover:text-[#D5FF00] hover:bg-black px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D5FF00]">Тарифы</a>
            <a href="#calculator" className="hover:text-[#D5FF00] hover:bg-black px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D5FF00]">Калькулятор</a>
            <a href="#cases" className="hover:text-[#D5FF00] hover:bg-black px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D5FF00]">Кейсы</a>
            <a href="#faq" className="hover:text-[#D5FF00] hover:bg-black px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D5FF00]">FAQ</a>
            <a href="#contacts" className="hover:text-[#D5FF00] hover:bg-black px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D5FF00]">Контакты</a>
          </nav>

          <Button className="hidden lg:flex" onClick={() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' })}>
            Обсудить объект
          </Button>

          <button 
            className="lg:hidden p-2 bg-black text-white hover:bg-[#D5FF00] hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? 'X' : '☰'}
          </button>
        </div>
      </header>
      
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-[45] pt-20 flex flex-col items-center gap-8 font-bold font-display uppercase text-xl">
           <a href="#process" onClick={() => setIsMenuOpen(false)}>Как работаем</a>
           <a href="#tariffs" onClick={() => setIsMenuOpen(false)}>Тарифы</a>
           <a href="#calculator" onClick={() => setIsMenuOpen(false)}>Калькулятор</a>
           <a href="#cases" onClick={() => setIsMenuOpen(false)}>Кейсы</a>
           <a href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</a>
           <a href="#contacts" onClick={() => setIsMenuOpen(false)}>Контакты</a>
        </div>
      )}
    </>
  );
};
