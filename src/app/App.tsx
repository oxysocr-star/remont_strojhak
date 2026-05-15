import React, { useEffect } from 'react';
import { 
  HeroSection, 
  TrustSection, 
  ProblemsSection, 
  ProcessSection, 
  TariffsSection, 
  CalculatorSection, 
  CasesSection, 
  ReviewsSection, 
  GuaranteesSection, 
  FaqSection, 
  ContactsSection 
} from '../sections';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { AiWidget } from '../components/ai/AiWidget';

export default function App() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.hash && anchor.origin === window.location.origin) {
        const element = document.querySelector(anchor.hash);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.body.addEventListener('click', handleAnchorClick);
    return () => document.body.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="font-sans text-black scroll-smooth bg-gray-50 selection:bg-[#D5FF00] selection:text-black min-h-screen relative overflow-x-hidden">
      <MobileBottomNav />
      <AiWidget />
      <Header />
      <main className="text-gray-900">
        <HeroSection />
        <TrustSection />
        <ProblemsSection />
        <ProcessSection />
        <TariffsSection />
        <CalculatorSection />
        <CasesSection />
        <ReviewsSection />
        <GuaranteesSection />
        <FaqSection />
        <ContactsSection />
        <Footer />
      </main>
    </div>
  );
}
