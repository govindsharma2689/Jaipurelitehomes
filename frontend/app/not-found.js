import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center animate-fade-in-up">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Home size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-500 mb-6">The page you are looking for does not exist.</p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-[#1e88e5] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1565c0] transition-all"
          >
            Go Home <ArrowRight size={18} />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
