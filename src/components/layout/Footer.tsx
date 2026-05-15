import React from 'react';

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
