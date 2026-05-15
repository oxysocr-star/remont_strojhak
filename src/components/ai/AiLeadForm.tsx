import React from 'react';
import { Button } from '../ui/Button';

interface AiLeadFormProps {
  onSubmit: (data: any) => void;
}

export const AiLeadForm: React.FC<AiLeadFormProps> = ({ onSubmit }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      name: formData.get('name'),
      phone: formData.get('phone')
    });
  };

  return (
    <div className="bg-white p-4 brutal-border self-start w-full max-w-[280px]">
      <p className="font-bold uppercase text-xs mb-3">Оставить заявку</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input name="name" type="text" placeholder="Имя" required className="p-2 border border-black text-sm" />
        <input name="phone" type="tel" placeholder="Телефон" required className="p-2 border border-black text-sm" />
        <Button size="sm" type="submit">ОТПРАВИТЬ</Button>
      </form>
    </div>
  );
};
