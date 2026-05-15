import React, { useEffect } from 'react';
import { HeroSection } from './sections/HeroSection';
import { TrustSection, ProblemsSection, ProcessSection, TariffsSection } from './sections/index';
import { Calculator } from './calculator/Calculator';
import { CasesSection } from './cases/CasesSection';
import { ReviewsSection, FaqSection, GuaranteesSection } from './sections/RestSections';
import { Header, Footer, ContactsSection, MobileBottomNav } from './layout/Layout';
import { AiWidget } from './components/ai/AiWidget';

export default function App() {
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }, []);

  return (
    <div className="font-sans text-black scroll-smooth bg-gray-50 selection:bg-[#D5FF00] selection:text-black">
      <Header />
      <main className="pb-[72px] lg:pb-0">
        <HeroSection />
        <TrustSection />
        <ProblemsSection />
        <ProcessSection />
        <TariffsSection />
        <Calculator />
        <CasesSection />
        <ReviewsSection />
        <GuaranteesSection />
        <FaqSection />
        <ContactsSection />
      </main>
      <Footer />
      <MobileBottomNav />
      <AiWidget />
    </div>
  );
}
