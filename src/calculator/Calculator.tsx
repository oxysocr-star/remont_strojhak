import React, { useEffect } from 'react';
import { motion, animate, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { toast } from 'react-hot-toast';
import { Download, Search } from 'lucide-react';
import { useCalculatorStore } from '../store';
import { Button } from '../components/ui/Button';
import { trackEvent } from '../lib/analytics';

const rates = { basic: 12000, comfort: 25000, premium: 45000 };
const multipliers = { newBuilding: 1, secondary: 1.15, demolition: 1.25, afterBadContractor: 1.35 };

const faqsData = [
  {
    question: "Эта цена окончательная?",
    answer: "Калькулятор дает предварительный расчет. Точная стоимость фиксируется только после выезда инженера и составления подробной сметы."
  },
  {
    question: "Как происходит оплата?",
    answer: "Поэтапно. Вы платите только за фактически выполненные работы после их приемки. Никаких авансов за работы."
  },
  {
    question: "Что делать после получения сметы?",
    answer: "Запишитесь на замер. Наш инженер приедет к вам на объект для точного замера, после чего мы составим детальную смету, которая станет частью договора."
  }
];

function AnimatedCounter({ value }: { value: number }) {
  const count = useMotionValue(value);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString('ru'));
  
  useEffect(() => {
    const controls = animate(count, value, { duration: 0.5, type: 'tween', ease: 'easeOut' });
    return () => controls.stop();
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-2 border-black bg-white cursor-pointer px-3">
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left py-3 font-bold text-sm flex justify-between items-center outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {question}
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }} 
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          ↓
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-sm pb-3 font-medium opacity-80 pt-2 border-t border-gray-200">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const Calculator = () => {
  const { step, propertyType, area, objectType, tariff, timeframe, setStep, setPropertyType, setArea, setObjectType, setTariff, setTimeframe, reset } = useCalculatorStore();

  useEffect(() => {
    if (step === 1) {
      trackEvent('calculator_started');
    }
  }, [step]);

  const handleNext = () => {
    trackEvent('calculator_step_completed', { step, propertyType, area, objectType, tariff });
    if (step < 6) setStep(step + 1);
  };

  const handleAutoNext = (fn: () => void) => {
    fn();
    setTimeout(() => handleNext(), 300);
  };

  const handleTimeframe = (t: string) => {
    setTimeframe(t);
    trackEvent('calculator_completed', { propertyType, area, objectType, tariff, timeframe: t });
    setTimeout(() => setStep(6), 300);
  };

  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const stepContainerRef = React.useRef<HTMLDivElement>(null);
  const resultRef = React.useRef<HTMLDivElement>(null);
  const [pdfPreview, setPdfPreview] = React.useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = React.useState(false);
  const [faqSearchQuery, setFaqSearchQuery] = React.useState('');

  const filteredFaqs = faqsData.filter(faq => 
    faq.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(faqSearchQuery.toLowerCase())
  );

  const handleGeneratePreview = async () => {
    if (!resultRef.current) return;
    setIsGeneratingPreview(true);
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 1.5,
        useCORS: true,
        logging: false
      });
      setPdfPreview(canvas.toDataURL('image/png'));
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('smeta.pdf');
      
      trackEvent('calculator_pdf_downloaded');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  useEffect(() => {
    if (stepContainerRef.current) {
      const firstFocusable = stepContainerRef.current.querySelector('input, button') as HTMLElement;
      if (firstFocusable) {
        firstFocusable.focus({ preventScroll: true });
      }
    }
  }, [step]);

  const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number, total: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % total;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + total) % total;
    }

    if (nextIndex !== index) {
      e.preventDefault();
      const grid = e.currentTarget.parentElement;
      if (grid) {
        const buttons = Array.from(grid.querySelectorAll('button')) as HTMLElement[];
        if (buttons[nextIndex]) {
          buttons[nextIndex].focus();
        }
      }
    }
  };

  const handleStep2KeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent('contact_form_submitted', { source: 'calculator' });
    const target = e.target as any;
    const phone = target[0].value;
    
    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, propertyType, area, objectType, tariff, timeframe })
      });
      if (!res.ok) throw new Error();
      setStatus('idle');
      toast.success('Заявка отправлена! Ожидайте звонка.');
      target.reset();
    } catch(e) {
      setStatus('idle');
      toast.error('Произошла ошибка, попробуйте позднее.');
    }
  };

  const total = React.useMemo(() => (area * (tariff ? rates[tariff] : rates.comfort) * (objectType ? multipliers[objectType] : 1)), [area, tariff, objectType]);
  const estimatedDays = React.useMemo(() => Math.max(65, Math.floor(area * 1.5)), [area]);
  const pieChartData = React.useMemo(() => [
    { name: 'Работа', value: Math.round(total * 0.4) },
    { name: 'Материалы', value: Math.round(total * 0.45) },
    { name: 'Накладные расходы', value: total - Math.round(total * 0.4) - Math.round(total * 0.45) },
  ], [total]);

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
            <div className="text-sm font-bold opacity-50">ШАГ {step} ИЗ 6</div>
          </div>
          
          {step > 1 && step < 6 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              className="mb-8 p-4 bg-[#D5FF00]/30 border-2 border-black flex justify-between items-center"
            >
              <span className="font-bold uppercase text-sm">Предварительно:</span>
              <span className="text-xl font-display font-bold">от <AnimatedCounter value={total} /> ₽</span>
            </motion.div>
          )}

          <div className="min-h-[300px]" ref={stepContainerRef}>
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-xl font-bold mb-6">Тип объекта</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="radiogroup" aria-label="Тип объекта">
                  {['Квартира', 'Дом', 'Коммерция'].map((type, i, arr) => (
                    <button 
                      key={type} 
                      role="radio"
                      aria-checked={propertyType === type}
                      onKeyDown={(e) => handleOptionKeyDown(e, i, arr.length)}
                      onClick={() => handleAutoNext(() => setPropertyType(type))} 
                      className={`p-6 text-center border-2 border-black hover:bg-[#D5FF00] transition-colors font-bold uppercase focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black ${propertyType === type ? 'bg-black text-[#D5FF00]' : ''}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-6">
                  <label htmlFor="area-input" className="text-xl font-bold block">Площадь (м²)</label>
                  <input 
                    id="area-input"
                    type="number"
                    min="20" max="250"
                    aria-label="Ввести площадь вручную"
                    value={area}
                    onChange={e => setArea(Number(e.target.value))}
                    onKeyDown={handleStep2KeyDown}
                    className="w-24 p-2 text-right border-2 border-black font-bold focus:bg-[#D5FF00]/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black"
                  />
                </div>
                <input 
                  id="area-range"
                  type="range" min="20" max="250" value={area} 
                  aria-label="Выбрать площадь ползунком"
                  onChange={e => setArea(Number(e.target.value))}
                  onKeyDown={handleStep2KeyDown}
                  className="w-full accent-black mb-8 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black"
                />
                <Button onClick={handleNext} className="w-full sm:w-auto">Далее</Button>
              </div>
            )}
            
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-xl font-bold mb-6">Уровень ремонта</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="radiogroup" aria-label="Уровень ремонта">
                  {[
                    { id: 'basic', label: 'Базовый' },
                    { id: 'comfort', label: 'Комфорт' },
                    { id: 'premium', label: 'Премиум' }
                  ].map((t, i, arr) => (
                    <button 
                      key={t.id} 
                      role="radio"
                      aria-checked={tariff === t.id}
                      onKeyDown={(e) => handleOptionKeyDown(e, i, arr.length)}
                      onClick={() => handleAutoNext(() => setTariff(t.id as any))} 
                      className={`p-6 text-center border-2 border-black hover:bg-[#D5FF00] transition-colors font-bold uppercase focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black ${tariff === t.id ? 'bg-black text-[#D5FF00]' : ''}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-xl font-bold mb-6">Состояние объекта</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup" aria-label="Состояние объекта">
                  {[
                    { id: 'newBuilding', label: 'Новостройка без отделки' },
                    { id: 'secondary', label: 'Вторичка' },
                    { id: 'demolition', label: 'Нужен демонтаж' },
                    { id: 'afterBadContractor', label: 'После другого подрядчика' }
                  ].map((t, i, arr) => (
                    <button 
                      key={t.id} 
                      role="radio"
                      aria-checked={objectType === t.id}
                      onKeyDown={(e) => handleOptionKeyDown(e, i, arr.length)}
                      onClick={() => handleAutoNext(() => setObjectType(t.id as any))} 
                      className={`p-6 text-center border-2 border-black hover:bg-[#D5FF00] transition-colors font-bold uppercase focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black ${objectType === t.id ? 'bg-black text-[#D5FF00]' : ''}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {step === 5 && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-xl font-bold mb-6">Старт работ</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup" aria-label="Старт работ">
                  {[
                    'Как можно быстрее',
                    'В течение месяца',
                    'Через 2–3 месяца',
                    'Пока планирую'
                  ].map((t, i, arr) => (
                    <button 
                      key={t} 
                      role="radio"
                      aria-checked={timeframe === t}
                      onKeyDown={(e) => handleOptionKeyDown(e, i, arr.length)}
                      onClick={() => handleTimeframe(t)} 
                      className={`p-6 text-center border-2 border-black hover:bg-[#D5FF00] transition-colors font-bold uppercase focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black ${timeframe === t ? 'bg-black text-[#D5FF00]' : ''}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {step === 6 && timeframe && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="p-6 bg-gray-100 border-2 border-black relative overflow-hidden z-0" ref={resultRef}>
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center space-y-12 sm:space-y-24 whitespace-nowrap overflow-hidden translate-x-[-10%] translate-y-[-10%] w-[120%] h-[120%] -rotate-[30deg] opacity-[0.06] select-none text-black font-black text-6xl sm:text-8xl md:text-9xl z-[-1]">
                    <div>СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК</div>
                    <div>СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК</div>
                    <div>СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК</div>
                    <div>СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК</div>
                    <div>СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК</div>
                    <div>СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК</div>
                    <div>СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК СТРОЙХАК</div>
                  </div>
                  <div className="relative z-10 w-full h-full bg-transparent">
                    <h4 className="font-bold uppercase text-sm mb-4 text-gray-500">Результат расчета</h4>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
                    <div>
                      <div className="text-sm font-bold uppercase mb-1">Предварительная стоимость</div>
                      <div className="text-3xl font-display font-bold">от <AnimatedCounter value={total} /> ₽</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold uppercase mb-1">Ориентировочный срок</div>
                      <div className="text-xl font-display font-bold">от <AnimatedCounter value={estimatedDays} /> дней</div>
                    </div>
                  </div>
                  
                  <div className="mb-6 border-t-2 border-black pt-6">
                    <h5 className="font-bold uppercase text-sm mb-4">Структура расходов</h5>
                    <div className="h-64 w-full relative">
                      <ResponsiveContainer width="100%" height="100%" minHeight={256} minWidth={100}>
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="#000"
                            strokeWidth={2}
                            isAnimationActive={false}
                          >
                            {['#000000', '#D5FF00', '#AAAAAA'].map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => `${value.toLocaleString('ru')} ₽`} 
                            contentStyle={{ border: '2px solid black', borderRadius: 0, fontWeight: 'bold' }} 
                            itemStyle={{ color: '#000' }}
                          />
                          <Legend iconType="square" wrapperStyle={{ fontWeight: 'bold', fontSize: '12px' }}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="mb-8 border-t-2 border-black pt-6 print:hidden" data-html2canvas-ignore="true">
                    <h5 className="font-bold uppercase text-sm mb-4">Предпросмотр документа</h5>
                    {!pdfPreview ? (
                      <div className="bg-white border-2 border-black border-dashed flex flex-col items-center justify-center p-8 text-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMCAwbDhfOFpNOCAwTDBfOCIgc3Ryb2tlPSIjZjNmNGY2IiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')]">
                         <span className="text-gray-500 font-bold mb-4">Посмотрите, как будет выглядеть файл перед скачиванием</span>
                         <Button type="button" onClick={handleGeneratePreview} className="bg-[#D5FF00] text-black border-2 border-black hover:bg-black hover:text-[#D5FF00] transition-colors w-full sm:w-auto">
                           {isGeneratingPreview ? 'СОЗДАНИЕ...' : 'СГЕНЕРИРОВАТЬ ПРЕДПРОСМОТР'}
                         </Button>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="p-8 bg-gray-100/50 border-2 border-black flex flex-col items-center"
                      >
                         <div className="bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border-t border-l border-white ring-1 ring-black/5 transform sm:scale-100 scale-90 transition-transform origin-top relative">
                           <div className="absolute inset-0 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.8),inset_-1px_-1px_0px_rgba(0,0,0,0.05)] pointer-events-none"></div>
                           <img src={pdfPreview} className="max-w-[400px] w-full block" alt="Предпросмотр сметы" />
                         </div>
                         <Button type="button" onClick={() => setPdfPreview(null)} className="mt-8 bg-transparent underline font-bold uppercase text-xs opacity-50 hover:opacity-100 transition-opacity text-black">
                           Скрыть предпросмотр
                         </Button>
                      </motion.div>
                    )}
                  </div>

                  <div className="mb-8 border-t-2 border-black pt-6 print:hidden" data-html2canvas-ignore="true">
                    <h5 className="font-bold uppercase text-sm mb-4">Частые вопросы по смете</h5>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Найти ответ..." 
                        value={faqSearchQuery}
                        onChange={(e) => setFaqSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-black font-medium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black"
                      />
                    </div>
                    <div className="space-y-3">
                      {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                          <FaqItem key={index} question={faq.question} answer={faq.answer} />
                        ))
                      ) : (
                        <p className="text-gray-500 font-medium py-4 text-center border-2 border-dashed border-gray-300">
                          Ничего не найдено. Попробуйте другой запрос.
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-sm mb-6 font-medium bg-yellow-200 p-2 border border-black inline-block">Чтобы зафиксировать стоимость, нужен замер объекта.</p>
                  
                  <form onSubmit={handleSubmit} className="print:hidden" data-html2canvas-ignore="true">
                    <label htmlFor="calc-phone-input" className="block text-sm font-bold uppercase mb-2">Куда прислать смету?</label>
                    <input id="calc-phone-input" type="tel" placeholder="+7 (999) 000-00-00" aria-label="Номер телефона для получения сметы" className="w-full p-4 border-2 border-black font-bold mb-4 bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black" required 
                           onChange={() => trackEvent('contact_form_started', { source: 'calculator' })} />
                    <Button type="submit" variant="primary" className="w-full" disabled={status === 'loading'}>
                      {status === 'loading' ? 'ОТПРАВЛЯЕМ...' : 'ПОЛУЧИТЬ ТОЧНУЮ СМЕТУ'}
                    </Button>
                  </form>
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 pt-6 border-t-2 border-black print:hidden" data-html2canvas-ignore="true">
                    <Button type="button" onClick={handleDownloadPdf} className="w-full sm:w-auto bg-white hover:bg-gray-100 text-black border-2 border-black flex items-center justify-center gap-2">
                      <Download size={18} />
                      СОХРАНИТЬ В PDF
                    </Button>
                    <button onClick={reset} className="text-xs uppercase font-bold underline opacity-50 whitespace-nowrap">Начать заново</button>
                  </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
