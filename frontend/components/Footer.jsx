import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, MessageCircle, ArrowUp } from 'lucide-react';
import { contactInfo } from '@/data/mockData';
import ScrollToTop from './ScrollToTop';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <img 
                src="/images/logo/logo-white-trimmed.png" 
                alt="Jaipur Elite Homes" 
                className="h-16 md:h-20 w-auto"
              />
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              We have 15+ years of experience in real estate. Your trusted partner for premium properties in Jaipur.
            </p>
            <div className="flex gap-4">
              <a href={contactInfo.social.facebook} className="text-gray-400 hover:text-[#1e88e5] transition-colors">
                <Facebook size={20} />
              </a>
              <a href={contactInfo.social.whatsapp} className="text-gray-400 hover:text-[#1e88e5] transition-colors">
                <MessageCircle size={20} />
              </a>
              <a href={contactInfo.social.youtube} className="text-gray-400 hover:text-[#1e88e5] transition-colors">
                <Youtube size={20} />
              </a>
              <a href={contactInfo.social.instagram} className="text-gray-400 hover:text-[#1e88e5] transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-[#1e88e5] transition-colors">Home</Link></li>
              <li><Link href="/properties" className="text-gray-400 hover:text-[#1e88e5] transition-colors">All Properties</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-[#1e88e5] transition-colors">Contact Us</Link></li>
              <li><Link href="/admin" className="text-gray-400 hover:text-[#1e88e5] transition-colors">Add Listing</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/properties?type=apartments" className="text-gray-400 hover:text-[#1e88e5] transition-colors">Apartments</Link></li>
              <li><Link href="/properties?type=villas" className="text-gray-400 hover:text-[#1e88e5] transition-colors">Villas</Link></li>
              <li><Link href="/properties?type=plot" className="text-gray-400 hover:text-[#1e88e5] transition-colors">Plots</Link></li>
              <li><Link href="/properties?type=houses" className="text-gray-400 hover:text-[#1e88e5] transition-colors">Houses</Link></li>
              <li><Link href="/properties?type=offices" className="text-gray-400 hover:text-[#1e88e5] transition-colors">Offices</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-2 text-gray-400 hover:text-[#1e88e5] transition-colors">
                  <Phone size={16} />
                  {contactInfo.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 text-gray-400 hover:text-[#1e88e5] transition-colors">
                  <Mail size={16} />
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>Shop No. 1 & 2, Nandpuri Ist, Jagatpura, Jaipur, Rajasthan – 302033</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Jaipur Elite Homes. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 text-sm hover:text-[#1e88e5] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-400 text-sm hover:text-[#1e88e5] transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </footer>
  );
};

export default Footer;
