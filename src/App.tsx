import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { HeroSection } from './sections/HeroSection';
import { TrustSection, ProblemsSection, ProcessSection, TariffsSection } from './sections/index';
import { Calculator } from './calculator/Calculator';
import { CasesSection } from './cases/CasesSection';
import { FaqSection, GuaranteesSection } from './sections/RestSections';
import { Header, Footer, ContactsSection, MobileBottomNav } from './layout/Layout';
import { ScrollToTop } from './components/ui/ScrollToTop';
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
        <GuaranteesSection />
        <FaqSection />
        <ContactsSection />
      </main>
      <Footer />
      <MobileBottomNav />
      <ScrollToTop />
      <AiWidget />
      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
          style: { 
            border: '2px solid black', 
            borderRadius: '0', 
            fontWeight: 'bold',
            background: '#ffffff',
            color: '#000000',
          },
          success: {
            style: {
              background: '#D5FF00',
            }
          },
          error: {
            style: {
              background: '#ffcccc',
            }
          }
        }} 
      />
    </div>
  );
}
