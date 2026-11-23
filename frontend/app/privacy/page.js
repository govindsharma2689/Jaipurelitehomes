import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Jaipur Elite Homes - Your trusted real estate partner in Jaipur.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="mb-6">
            Last updated: February 2026
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            At Jaipur Elite Homes, we collect information you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Name and contact information (email, phone number)</li>
            <li>Property preferences and requirements</li>
            <li>Messages and inquiries submitted through our contact forms</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Respond to your inquiries and provide requested services</li>
            <li>Send property listings that match your preferences</li>
            <li>Improve our services and website experience</li>
            <li>Communicate important updates about properties</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Information Sharing</h2>
          <p className="mb-4">
            We do not sell, trade, or otherwise transfer your personal information to outside parties. 
            This does not include trusted third parties who assist us in operating our website or 
            conducting our business, as long as they agree to keep this information confidential.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal information. 
            However, no method of transmission over the Internet is 100% secure.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-none mb-6">
            <li><strong>Email:</strong> info@jaipurelitehomes.com</li>
            <li><strong>Phone:</strong> +91 9928444666</li>
            <li><strong>Address:</strong> Jaipur, Rajasthan, India</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
