import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled past the hero section (approx 500px)
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    // Initial check
    toggleVisibility();

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="group fixed bottom-[80px] lg:bottom-8 right-4 lg:right-8 z-50 p-3 bg-[#D5FF00] hover:bg-black text-black hover:text-[#D5FF00] border-2 border-black rounded-full shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] focus:shadow-[2px_2px_0_0_#000] transition-all focus:outline-none focus:ring-4 focus:ring-[#D5FF00]/50"
          aria-label="Scroll to top"
        >
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-[#D5FF00] px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap lg:block hidden">
            Наверх
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></span>
          </span>
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
