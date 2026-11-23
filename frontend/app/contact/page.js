import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactClient from './ContactClient';
import { contactInfo } from '@/data/mockData';

// Server Component - TRUE SSR
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header - Server Rendered */}
      <div className="bg-[#1e88e5] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-white/90">Get in touch with our real estate experts</p>
        </div>
      </div>

      {/* Client Component for form */}
      <ContactClient contactInfo={contactInfo} />

      <Footer />
    </div>
  );
}

// Metadata for SEO
export const metadata = {
  title: 'Contact Us - Jaipur Elite Homes | Real Estate Experts',
  description: 'Contact Jaipur Elite Homes for premium properties in Jaipur. Call us at 9928444666 or email Info@jaipurelitehomes.com',
  keywords: 'contact Jaipur Elite Homes, real estate contact, property inquiries Jaipur',
};
