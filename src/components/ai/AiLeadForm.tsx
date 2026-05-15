import React, { useState } from 'react';

interface AiLeadFormProps {
  onSubmit: (data: { name: string; phone: string }) => void;
  area?: number;
  tariff?: string;
}

export const AiLeadForm: React.FC<AiLeadFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) onSubmit({ name, phone });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-4 border-[#D5FF00] bg-black flex flex-col gap-4 mt-2 mb-2">
      <div className="font-bold uppercase text-lg text-white">Оставить заявку</div>
      <input
        type="text"
        placeholder="Ваше имя"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border-4 border-white p-3 font-bold bg-black text-white focus:bg-[#D5FF00] focus:text-black focus:border-[#D5FF00] outline-none placeholder-gray-400 focus:placeholder-black"
      />
      <input
        type="tel"
        placeholder="Ваш телефон"
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border-4 border-white p-3 font-bold bg-black text-white focus:bg-[#D5FF00] focus:text-black focus:border-[#D5FF00] outline-none placeholder-gray-400 focus:placeholder-black"
      />
      <button 
        type="submit"
        className="bg-[#D5FF00] text-black border-4 border-[#D5FF00] px-4 py-3 font-bold uppercase transition-transform active:translate-y-1 active:translate-x-1 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_0_#fff]"
      >
        Отправить
      </button>
    </form>
  );
};
