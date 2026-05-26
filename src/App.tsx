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

// Robust Error Boundary (inline for simplicity)
class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("APP_CRASH", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
          <div className="brutal-border brutal-shadow p-8 bg-red-50 max-w-md">
            <h1 className="text-3xl font-black uppercase mb-4 text-red-600">Ошибка запуска</h1>
            <p className="font-bold mb-6 italic opacity-70">Произошел критический сбой интерфейса.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-black text-white px-6 py-3 font-bold uppercase brutal-border hover:bg-gray-800 transition-colors"
            >
              Перезагрузить страницу
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  useEffect(() => {
    console.log('App mounting...');
    const handleAnchorClick = function (this: HTMLAnchorElement, e: MouseEvent) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick as any);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick as any);
      });
    };
  }, []);

  return (
    <AppErrorBoundary>
      <div className="font-sans text-black scroll-smooth bg-gray-50 selection:bg-[#D5FF00] selection:text-black">
        <Header />
        <main className="pb-[72px] lg:pb-0 pt-16 lg:pt-20">
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
              zIndex: 9999,
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
    </AppErrorBoundary>
  );
}

