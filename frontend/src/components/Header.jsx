import React, { useState } from 'react';
import { Phone, Mail, Facebook, Youtube, Instagram, MessageCircle, User, Menu, X } from 'lucide-react';
import { contactInfo } from '../data/mockData';
import LoginModal from './LoginModal';

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#1e88e5] text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href={contactInfo.social.facebook} className="hover:opacity-80 transition-opacity" aria-label="Facebook">
              <Facebook size={16} />
            </a>
            <a href={contactInfo.social.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="WhatsApp">
              <MessageCircle size={16} />
            </a>
            <a href={contactInfo.social.youtube} className="hover:opacity-80 transition-opacity" aria-label="YouTube">
              <Youtube size={16} />
            </a>
            <a href={contactInfo.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
              <Instagram size={16} />
            </a>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Mail size={14} />
              {contactInfo.email}
            </a>
            <a href={`tel:${contactInfo.rentalPhone}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone size={14} />
              {contactInfo.rentalPhone} (For Rental Enquiry)
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img 
              src="/images/logo/logo-dark-trimmed.png" 
              alt="Jaipur Elite Homes" 
              className="h-14 md:h-16 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-[#1e88e5] font-medium hover:text-[#1565c0] transition-colors">Home</a>
            <a href="/properties" className="text-gray-700 font-medium hover:text-[#1e88e5] transition-colors">All Properties</a>
            <a href="/contact" className="text-gray-700 font-medium hover:text-[#1e88e5] transition-colors">Contact</a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <a href={`tel:${contactInfo.phone}`} className="hidden lg:flex items-center gap-2 text-gray-700 font-medium hover:text-[#1e88e5] transition-colors">
              <Phone size={18} className="text-[#1e88e5]" />
              {contactInfo.phone}
            </a>
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Login"
            >
              <User size={20} className="text-gray-600" />
            </button>
            <a 
              href="/add-listing" 
              className="hidden sm:block bg-[#1e88e5] text-white px-4 py-2 rounded-md font-medium hover:bg-[#1565c0] transition-colors"
            >
              Add Listing
            </a>
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <nav className="flex flex-col p-4 gap-4">
              <a href="/" className="text-[#1e88e5] font-medium">Home</a>
              <a href="/properties" className="text-gray-700 font-medium">All Properties</a>
              <a href="/contact" className="text-gray-700 font-medium">Contact</a>
              <a href="/add-listing" className="bg-[#1e88e5] text-white px-4 py-2 rounded-md font-medium text-center">
                Add Listing
              </a>
            </nav>
          </div>
        )}
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Header;
