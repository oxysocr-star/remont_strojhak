import React, { useState, useRef } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setPosition(percentage);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <div 
      className="relative w-full h-64 border-b-4 border-black overflow-hidden select-none has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#D5FF00] has-[:focus-visible]:ring-offset-2"
      ref={containerRef}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
    >
      <img src={afterImage} alt="После" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute top-4 right-4 bg-[#D5FF00] text-black px-2 py-1 font-bold uppercase text-xs brutal-border pointer-events-none">После</div>
      
      <div 
        className="absolute inset-0 h-full overflow-hidden border-r-4 border-black z-10"
        style={{ width: `${position}%` }}
      >
        <img 
          src={beforeImage} 
          alt="До" 
          loading="lazy" 
          decoding="async" 
          className="absolute inset-0 w-full h-full object-cover max-w-none grayscale" 
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%' }} 
        />
        <div className="absolute top-4 left-4 bg-white text-black px-2 py-1 font-bold uppercase text-xs brutal-border pointer-events-none">До</div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20 outline-none"
        aria-label="Слайдер сравнения до и после ремонта"
      />
      
      <div 
        className="absolute top-1/2 -mt-4 w-8 h-8 bg-black text-white flex items-center justify-center brutal-border z-10 pointer-events-none transform -translate-x-1/2"
        style={{ left: `${position}%` }}
      >
        <span className="text-xs">&lt;&gt;</span>
      </div>
    </div>
  );
};
