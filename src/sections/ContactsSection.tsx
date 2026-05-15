import React from 'react';
import { Button } from '../components/ui/Button';
import { trackEvent } from '../lib/analytics';

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
              const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  name: target[0].value, 
                  phone: target[1].value, 
                  source: 'footer_contacts',
                  area: 0,
                  objectType: 'newBuilding',
                  repairType: 'comfort'
                })
              });
              if (response.ok) {
                alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
                target.reset();
              } else {
                throw new Error('Server error');
              }
            } catch(error) {
              alert('Произошла ошибка, попробуйте позднее.');
            }
          }}>
            <div className="flex flex-col text-left gap-1">
              <label htmlFor="contact-name" className="text-xs font-bold uppercase ml-1">Ваше имя</label>
              <input 
                id="contact-name"
                type="text" 
                placeholder="Имя" 
                className="p-4 border-2 border-black font-bold focus:bg-[#D5FF00]/10 focus:outline-none focus:ring-4 focus:ring-[#D5FF00]/50 transition-all" 
                required 
                onChange={() => trackEvent('contact_form_started', { source: 'footer_contacts' })} 
              />
            </div>
            <div className="flex flex-col text-left gap-1">
              <label htmlFor="contact-phone" className="text-xs font-bold uppercase ml-1">Телефон для связи</label>
              <input 
                id="contact-phone"
                type="tel" 
                placeholder="+7 (___) ___-__-__" 
                className="p-4 border-2 border-black font-bold focus:bg-[#D5FF00]/10 focus:outline-none focus:ring-4 focus:ring-[#D5FF00]/50 transition-all" 
                required 
                onChange={() => trackEvent('contact_form_started', { source: 'footer_contacts' })} 
              />
            </div>
            <Button size="lg" type="submit">ОСТАВИТЬ ЗАЯВКУ</Button>
          </form>
       </div>
    </div>
  </section>
);
