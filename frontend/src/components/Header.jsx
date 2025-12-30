import React, { useState } from 'react';
import { Phone, Mail, Facebook, Youtube, Instagram, MessageCircle, User, Menu, X } from 'lucide-react';
import { contactInfo } from '../data/mockData';
import LoginModal from './LoginModal';

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Bar - Fixed/Sticky on both mobile and desktop */}
      <div className="bg-[#1e88e5] text-white text-sm fixed top-0 left-0 right-0 z-[60]">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-2 flex justify-between items-center">
          {/* Social Icons */}
          <div className="flex items-center gap-3 md:gap-4">
            <a href={contactInfo.social.facebook} className="hover:opacity-80 transition-opacity" aria-label="Facebook">
              <Facebook size={14} className="md:w-4 md:h-4" />
            </a>
            <a href={contactInfo.social.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="WhatsApp">
              <MessageCircle size={14} className="md:w-4 md:h-4" />
            </a>
            <a href={contactInfo.social.youtube} className="hover:opacity-80 transition-opacity" aria-label="YouTube">
              <Youtube size={14} className="md:w-4 md:h-4" />
            </a>
            <a href={contactInfo.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
              <Instagram size={14} className="md:w-4 md:h-4" />
            </a>
          </div>
          
          {/* Contact Info - Visible on both mobile and desktop */}
          <div className="flex items-center gap-2 md:gap-6 text-xs md:text-sm">
            {/* Email - hidden on mobile, visible from md */}
            <a href={`mailto:${contactInfo.email}`} className="hidden md:flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Mail size={14} />
              {contactInfo.email}
            </a>
            {/* Rental Phone */}
            <a href={`tel:${contactInfo.rentalPhone}`} className="hidden md:flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone size={14} />
              {contactInfo.rentalPhone} (Rental)
            </a>
            {/* Sales Phone with Name - Always visible */}
            <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-1 md:gap-2 hover:opacity-80 transition-opacity">
              <Phone size={12} className="md:w-[14px] md:h-[14px]" />
              <span>{contactInfo.phone}</span>
              <span className="text-white/90">- Hanuman Meena</span>
            </a>
          </div>
        </div>
      </div>

      {/* Spacer for fixed top bar */}
      <div className="h-[36px] md:h-[40px]"></div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-[36px] md:top-[40px] z-50">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-2 md:py-3 flex justify-between items-center">
          {/* Logo - with nowrap to prevent breaking */}
          <a href="/" className="flex items-center flex-shrink-0">
            <img 
              src="/images/logo/logo-dark-trimmed.png" 
              alt="Jaipur Elite Homes" 
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-[#1e88e5] font-medium hover:text-[#1565c0] transition-colors">Home</a>
            <a href="/properties" className="text-gray-700 font-medium hover:text-[#1e88e5] transition-colors">All Properties</a>
            <a href="/contact" className="text-gray-700 font-medium hover:text-[#1e88e5] transition-colors">Contact</a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            <a href={`tel:${contactInfo.phone}`} className="hidden lg:flex items-center gap-2 text-gray-700 font-medium hover:text-[#1e88e5] transition-colors">
              <Phone size={18} className="text-[#1e88e5]" />
              {contactInfo.phone}
            </a>
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Login"
            >
              <User size={18} className="md:w-5 md:h-5 text-gray-600" />
            </button>
            {/* Add Listing button removed from public view - only accessible via /admin */}
            <button 
              className="md:hidden p-1.5"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
              <a href={`tel:${contactInfo.rentalPhone}`} className="flex items-center gap-2 text-gray-700 font-medium">
                <Phone size={16} className="text-[#1e88e5]" />
                {contactInfo.rentalPhone} (Rental Enquiry)
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
