import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for Jaipur Elite Homes - Your trusted real estate partner in Jaipur.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="mb-6">
            Last updated: February 2026
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using the Jaipur Elite Homes website, you accept and agree to be bound 
            by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Services</h2>
          <p className="mb-4">
            Jaipur Elite Homes provides real estate brokerage and consultation services, including:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Property listings and information</li>
            <li>Property buying and selling assistance</li>
            <li>Real estate consultation services</li>
            <li>Property viewing arrangements</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Property Information</h2>
          <p className="mb-4">
            While we strive to ensure all property information is accurate and up-to-date, 
            we cannot guarantee the accuracy, completeness, or reliability of any property listings. 
            Property details, prices, and availability are subject to change without notice.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. User Responsibilities</h2>
          <p className="mb-4">
            Users agree to:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Provide accurate information when making inquiries</li>
            <li>Use the website for lawful purposes only</li>
            <li>Not misuse or attempt to manipulate our services</li>
            <li>Verify property details independently before making decisions</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Limitation of Liability</h2>
          <p className="mb-4">
            Jaipur Elite Homes shall not be liable for any direct, indirect, incidental, or 
            consequential damages arising from the use of our website or services. All property 
            transactions are subject to independent due diligence by the parties involved.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Intellectual Property</h2>
          <p className="mb-4">
            All content on this website, including text, images, logos, and graphics, is the 
            property of Jaipur Elite Homes and is protected by intellectual property laws.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Contact Information</h2>
          <p className="mb-4">
            For any questions regarding these terms, please contact us:
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
