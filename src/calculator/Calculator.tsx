import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useCalculatorStore } from '../store';
import { Button } from '../components/ui/Button';
import { trackEvent } from '../lib/analytics';

const rates = { basic: 12000, comfort: 25000, premium: 45000 };
const multipliers = { newBuilding: 1, secondary: 1.15, demolition: 1.25, afterBadContractor: 1.35 };

export const Calculator = () => {
  const { step, propertyType, area, objectType, tariff, timeframe, setStep, setPropertyType, setArea, setObjectType, setTariff, setTimeframe, reset } = useCalculatorStore();

  useEffect(() => {
    if (step === 1) {
      trackEvent('calculator_started');
    }
  }, [step]);

  const handleNext = () => {
    trackEvent('calculator_step_completed', { step, propertyType, area, objectType, tariff });
    if (step < 5) setStep(step + 1);
  };

  const handleAutoNext = (fn: () => void) => {
    fn();
    setTimeout(() => handleNext(), 300);
  };

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
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, propertyType, area, objectType, tariff, timeframe })
      });
      alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
      target.reset();
    } catch(e) {
      alert('Произошла ошибка, попробуйте позднее.');
    }
  };

  const total = (area * (tariff ? rates[tariff] : rates.comfort) * (objectType ? multipliers[objectType] : 1));
  const estimatedDays = Math.max(65, Math.floor(area * 1.5));

  return (
    <section id="calculator" className="py-24 bg-[#D5FF00] border-y-4 border-black overflow-hidden">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto bg-white p-8 brutal-border brutal-shadow"
        >
          <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-black">
            <h2 className="text-3xl font-display font-bold uppercase">Калькулятор</h2>
            <div className="text-sm font-bold opacity-50">ШАГ {step} ИЗ 5</div>
          </div>
          
          <div className="min-h-[300px]">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-xl font-bold mb-6">Тип объекта</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['Квартира', 'Дом', 'Коммерция'].map(type => (
                    <button key={type} onClick={() => handleAutoNext(() => setPropertyType(type))} className={`p-6 text-center border-2 border-black hover:bg-[#D5FF00] transition-colors font-bold uppercase ${propertyType === type ? 'bg-black text-[#D5FF00]' : ''}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Площадь (м²)</h3>
                  <input 
                    type="number"
                    min="20" max="250"
                    aria-label="Ввести площадь вручную"
                    value={area}
                    onChange={e => setArea(Number(e.target.value))}
                    className="w-24 p-2 text-right border-2 border-black font-bold focus:bg-[#D5FF00]/20"
                  />
                </div>
                <input 
                  type="range" min="20" max="250" value={area} 
                  aria-label="Выбрать площадь ползунком"
                  onChange={e => setArea(Number(e.target.value))}
                  className="w-full accent-black mb-8 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <Button onClick={handleNext} className="w-full sm:w-auto">Далее</Button>
              </div>
            )}
            
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-xl font-bold mb-6">Уровень ремонта</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'basic', label: 'Базовый' },
                    { id: 'comfort', label: 'Комфорт' },
                    { id: 'premium', label: 'Премиум' }
                  ].map(t => (
                    <button key={t.id} onClick={() => handleAutoNext(() => setTariff(t.id as any))} className={`p-6 text-center border-2 border-black hover:bg-[#D5FF00] transition-colors font-bold uppercase ${tariff === t.id ? 'bg-black text-[#D5FF00]' : ''}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-xl font-bold mb-6">Состояние объекта</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'newBuilding', label: 'Новостройка без отделки' },
                    { id: 'secondary', label: 'Вторичка' },
                    { id: 'demolition', label: 'Нужен демонтаж' },
                    { id: 'afterBadContractor', label: 'После другого подрядчика' }
                  ].map(t => (
                    <button key={t.id} onClick={() => handleAutoNext(() => setObjectType(t.id as any))} className={`p-6 text-center border-2 border-black hover:bg-[#D5FF00] transition-colors font-bold uppercase ${objectType === t.id ? 'bg-black text-[#D5FF00]' : ''}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {step === 5 && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-xl font-bold mb-6">Старт работ</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    'Как можно быстрее',
                    'В течение месяца',
                    'Через 2–3 месяца',
                    'Пока планирую'
                  ].map(t => (
                    <button key={t} onClick={() => handleTimeframe(t)} className={`p-6 text-center border-2 border-black hover:bg-[#D5FF00] transition-colors font-bold uppercase ${timeframe === t ? 'bg-black text-[#D5FF00]' : ''}`}>
                      {t}
                    </button>
                  ))}
                </div>
                
                {timeframe && (
                  <div className="mt-8 p-6 bg-gray-100 border-2 border-black animate-in fade-in">
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
                      <label className="block text-sm font-bold uppercase mb-2">Куда прислать расчет?</label>
                      <input type="tel" placeholder="+7 (999) 000-00-00" aria-label="Номер телефона для получения сметы" className="w-full p-4 border-2 border-black font-bold mb-4 bg-white" required 
                             onChange={() => trackEvent('contact_form_started', { source: 'calculator' })} />
                      <Button type="submit" variant="primary" className="w-full">
                        ПОЛУЧИТЬ ТОЧНУЮ СМЕТУ
                      </Button>
                    </form>
                    <button onClick={reset} className="text-xs uppercase font-bold mt-4 underline opacity-50 mx-auto block">Начать заново</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
