import React from 'react';
import { useCalculatorStore } from '../../store';
import { Button } from '../ui/Button';
import { trackEvent } from '../../lib/analytics';

const rates = { basic: 12000, comfort: 25000, premium: 45000 };
const multipliers = { newBuilding: 1, secondary: 1.15, demolition: 1.25, afterBadContractor: 1.35 };

export const CalculatorResult = () => {
  const { propertyType, area, objectType, tariff, timeframe, setTimeframe } = useCalculatorStore();

  const handleTimeframe = (t: string) => {
    setTimeframe(t);
    trackEvent('calculator_completed', { propertyType, area, objectType, tariff, timeframe: t });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent('contact_form_submitted', { source: 'calculator' });
    const target = e.target as any;
    const phone = target[0].value;
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: 'Из калькулятора',
          phone, 
          area, 
          objectType, 
          repairType: tariff || 'comfort',
          source: 'calculator',
          comment: `Тип объекта: ${propertyType}, Сроки: ${timeframe}`
        })
      });
      if (response.ok) {
        alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
        target.reset();
      } else {
        throw new Error('Server error');
      }
    } catch(e) {
      alert('Произошла ошибка, попробуйте позднее.');
    }
  };

  const total = (area * (tariff ? rates[tariff] : rates.comfort) * (objectType ? multipliers[objectType] : 1));
  const estimatedDays = Math.max(65, Math.floor(area * 1.5));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <fieldset>
        <legend className="text-xl font-bold mb-6 block">Старт работ</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            'Как можно быстрее',
            'В течение месяца',
            'Через 2–3 месяца',
            'Пока планирую'
          ].map(t => (
            <button 
              key={t} 
              onClick={() => handleTimeframe(t)} 
              className={`p-6 text-center border-2 border-black hover:bg-[#D5FF00] transition-colors font-bold uppercase focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black ${timeframe === t ? 'bg-black text-[#D5FF00]' : ''}`}
              aria-pressed={timeframe === t}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>
      
      {timeframe && (
        <div className="mt-8 p-6 bg-gray-100 border-2 border-black animate-in fade-in" role="region" aria-label="Результат расчета">
          <h4 className="font-bold uppercase text-sm mb-4 text-gray-500">Результат расчета</h4>
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
            <div>
              <div className="text-sm font-bold uppercase mb-1">Предварительная стоимость</div>
              <div className="text-3xl font-display font-bold">от {total.toLocaleString('ru')} ₽</div>
            </div>
            <div>
              <div className="text-sm font-bold uppercase mb-1">Ориентировочный срок</div>
              <div className="text-xl font-display font-bold">от {estimatedDays} дней</div>
            </div>
          </div>
          <p className="text-sm mb-6 font-medium bg-yellow-200 p-2 border border-black inline-block">Чтобы получить точную смету, нужен замер объекта.</p>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="calc-phone" className="block text-sm font-bold uppercase">Куда прислать расчет?</label>
              <input 
                id="calc-phone"
                type="tel" 
                placeholder="+7 (999) 000-00-00" 
                className="w-full p-4 border-2 border-black font-bold mb-4 bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black" 
                required 
                onChange={() => trackEvent('contact_form_started', { source: 'calculator' })} 
              />
            </div>
            <Button type="submit" variant="primary" className="w-full">
              ПОЛУЧИТЬ ТОЧНУЮ СМЕТУ
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
