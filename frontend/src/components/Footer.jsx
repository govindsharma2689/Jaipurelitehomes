import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, MessageCircle, ArrowUp } from 'lucide-react';
import { contactInfo } from '../data/mockData';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div>
            <a href="/" className="inline-block mb-6">
              <img 
                src="/images/logo/logo-white-trimmed.png" 
                alt="Jaipur Elite Homes" 
                className="h-16 md:h-20 w-auto"
              />
            </a>
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
              <li><a href="/" className="text-gray-400 hover:text-[#1e88e5] transition-colors">Home</a></li>
              <li><a href="/properties" className="text-gray-400 hover:text-[#1e88e5] transition-colors">All Properties</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-[#1e88e5] transition-colors">Contact Us</a></li>
              <li><a href="/add-listing" className="text-gray-400 hover:text-[#1e88e5] transition-colors">Add Listing</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="/listings/apartments" className="text-gray-400 hover:text-[#1e88e5] transition-colors">Apartments</a></li>
              <li><a href="/listings/villas" className="text-gray-400 hover:text-[#1e88e5] transition-colors">Villas</a></li>
              <li><a href="/listings/plot" className="text-gray-400 hover:text-[#1e88e5] transition-colors">Plots</a></li>
              <li><a href="/listings/houses" className="text-gray-400 hover:text-[#1e88e5] transition-colors">Houses</a></li>
              <li><a href="/listings/offices" className="text-gray-400 hover:text-[#1e88e5] transition-colors">Offices</a></li>
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
                <a href={`tel:${contactInfo.rentalPhone}`} className="flex items-center gap-2 text-gray-400 hover:text-[#1e88e5] transition-colors">
                  <Phone size={16} />
                  {contactInfo.rentalPhone} (Rentals)
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
                <span>Jaipur, Rajasthan, India</span>
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
            <a href="/privacy" className="text-gray-400 text-sm hover:text-[#1e88e5] transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-gray-400 text-sm hover:text-[#1e88e5] transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-[#1e88e5] text-white p-3 rounded-full shadow-lg hover:bg-[#1565c0] transition-colors z-50"
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
};

export default Footer;
