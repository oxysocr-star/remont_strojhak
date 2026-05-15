import React from 'react';
import { useCalculatorStore } from '../../store';
import { Button } from '../ui/Button';
import { trackEvent } from '../../lib/analytics';

export const CalculatorStep = () => {
  const { step, setStep, propertyType, setPropertyType, area, setArea, tariff, setTariff, objectType, setObjectType } = useCalculatorStore();

  const handleNext = () => {
    trackEvent('calculator_step_completed', { step, propertyType, area, objectType, tariff });
    if (step < 5) setStep(step + 1);
  };

  const handleAutoNext = (fn: () => void) => {
    fn();
    setTimeout(() => handleNext(), 300);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      {step === 1 && (
        <fieldset>
          <legend className="text-xl font-bold mb-6 block">Тип объекта</legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Квартира', 'Дом', 'Коммерция'].map(type => (
              <button 
                key={type} 
                onClick={() => handleAutoNext(() => setPropertyType(type))} 
                className={`p-6 text-center border-2 border-black hover:bg-[#D5FF00] transition-colors font-bold uppercase focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black ${propertyType === type ? 'bg-black text-[#D5FF00]' : ''}`}
                aria-pressed={propertyType === type}
              >
                {type}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <>
          <div className="flex justify-between items-center mb-6">
            <label htmlFor="area-number" className="text-xl font-bold">Площадь (м²)</label>
            <input 
              id="area-number"
              type="number"
              min="20" max="250"
              value={area}
              onChange={e => setArea(Number(e.target.value))}
              className="w-24 p-2 text-right border-2 border-black font-bold focus:bg-[#D5FF00]/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black"
            />
          </div>
          <label htmlFor="area-range" className="sr-only">Выбрать площадь ползунком</label>
          <input 
            id="area-range"
            type="range" min="20" max="250" value={area} 
            onChange={e => setArea(Number(e.target.value))}
            className="w-full accent-black mb-8 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black"
          />
          <Button onClick={handleNext} className="w-full sm:w-auto">Далее</Button>
        </>
      )}

      {step === 3 && (
        <fieldset>
          <legend className="text-xl font-bold mb-6 block">Уровень ремонта</legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'basic', label: 'Базовый' },
              { id: 'comfort', label: 'Комфорт' },
              { id: 'premium', label: 'Премиум' }
            ].map(t => (
              <button 
                key={t.id} 
                onClick={() => handleAutoNext(() => setTariff(t.id as any))} 
                className={`p-6 text-center border-2 border-black hover:bg-[#D5FF00] transition-colors font-bold uppercase focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black ${tariff === t.id ? 'bg-black text-[#D5FF00]' : ''}`}
                aria-pressed={tariff === t.id}
              >
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {step === 4 && (
        <fieldset>
          <legend className="text-xl font-bold mb-6 block">Состояние объекта</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'newBuilding', label: 'Новостройка без отделки' },
              { id: 'secondary', label: 'Вторичка' },
              { id: 'demolition', label: 'Нужен демонтаж' },
              { id: 'afterBadContractor', label: 'После другого подрядчика' }
            ].map(t => (
              <button 
                key={t.id} 
                onClick={() => handleAutoNext(() => setObjectType(t.id as any))} 
                className={`p-6 text-center border-2 border-black hover:bg-[#D5FF00] transition-colors font-bold uppercase focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black ${objectType === t.id ? 'bg-black text-[#D5FF00]' : ''}`}
                aria-pressed={objectType === t.id}
              >
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
};
