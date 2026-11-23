'use client';

import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 bg-[#1e88e5] text-white p-3 rounded-full shadow-lg hover:bg-[#1565c0] transition-colors z-50"
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  );
};

export default ScrollToTop;
