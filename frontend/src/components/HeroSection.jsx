import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { areas, heroData } from '../data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Hero background images for rotation
  const heroImages = [
    '/images/properties/prop-1/image-1.png',
    '/images/properties/prop-2/image-1.jpg',
    '/images/properties/prop-4/image-1.png',
    '/images/properties/prop-1/image-5.png',
  ];
  
  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);
  
  // Sales filters
  const [salesPropertyType, setSalesPropertyType] = useState('');
  const [salesCategory, setSalesCategory] = useState('');
  const [salesArea, setSalesArea] = useState('');
  const [salesPrice, setSalesPrice] = useState('');
  
  // Rental filters
  const [rentalPropertyType, setRentalPropertyType] = useState('');
  const [rentalCategory, setRentalCategory] = useState('');
  const [rentalArea, setRentalArea] = useState('');
  const [rentalBhk, setRentalBhk] = useState('');
  const [rentalPrice, setRentalPrice] = useState('');

  // Sales Property Types
  const salesPropertyTypes = ['Residential', 'Commercial', 'Agriculture'];
  
  // Sales Categories based on property type
  const getSalesCategories = () => {
    if (salesPropertyType === 'residential') {
      return ['Plot', 'Villas', 'House', 'Apartment', 'Duplex'];
    } else if (salesPropertyType === 'commercial') {
      return ['Shop', 'Office', 'Showroom', 'Warehouse', 'Commercial Plot'];
    } else if (salesPropertyType === 'agriculture') {
      return ['Farm Land', 'Agriculture Land', 'Farm House'];
    }
    return ['Plot', 'Villas', 'House', 'Apartment', 'Shop', 'Office'];
  };

  // Rental Property Types
  const rentalPropertyTypes = ['Residential', 'Commercial'];
  
  // Rental Categories
  const rentalCategories = ['House', 'Shops', 'Offices', 'Apartments'];
  
  // BHK options
  const bhkOptions = ['Studio', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];

  // Sales Price options (no upper limit)
  const salesPriceOptions = [
    { value: '0-25lakh', label: 'Up to ₹ 25 Lakh' },
    { value: '25-50lakh', label: '₹ 25 Lakh - ₹ 50 Lakh' },
    { value: '50lakh-1cr', label: '₹ 50 Lakh - ₹ 1 Crore' },
    { value: '1cr-2cr', label: '₹ 1 Crore - ₹ 2 Crore' },
    { value: '2cr-5cr', label: '₹ 2 Crore - ₹ 5 Crore' },
    { value: '5cr-10cr', label: '₹ 5 Crore - ₹ 10 Crore' },
    { value: '10cr+', label: '₹ 10 Crore & Above' },
  ];

  // Rental Price options (no upper limit)
  const rentalPriceOptions = [
    { value: '0-10k', label: 'Up to ₹ 10,000' },
    { value: '10k-20k', label: '₹ 10,000 - ₹ 20,000' },
    { value: '20k-35k', label: '₹ 20,000 - ₹ 35,000' },
    { value: '35k-50k', label: '₹ 35,000 - ₹ 50,000' },
    { value: '50k-1lakh', label: '₹ 50,000 - ₹ 1 Lakh' },
    { value: '1lakh-2lakh', label: '₹ 1 Lakh - ₹ 2 Lakh' },
    { value: '2lakh+', label: '₹ 2 Lakh & Above' },
  ];

  const handleSearch = () => {
    if (activeTab === 'sales') {
      console.log('Sales Search:', { salesPropertyType, salesCategory, salesArea, salesPrice });
    } else {
      console.log('Rental Search:', { rentalPropertyType, rentalCategory, rentalArea, rentalBhk, rentalPrice });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage: `url('${heroData.backgroundImage}')`,
          transform: 'scale(1.05)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
      </div>

      {/* Animated Overlay Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="animate-fade-in-up">
          <span className="inline-block text-white/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 animate-fade-in">
            Welcome to
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 drop-shadow-2xl">
            {heroData.title}
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-white/90 mb-8 font-light tracking-wide">
            {heroData.subtitle}
          </h2>
          <p className="text-white/80 text-base md:text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            {heroData.description}
          </p>
        </div>

        {/* Premium Search Box */}
        <div className="glass-white rounded-2xl shadow-premium-lg overflow-hidden max-w-5xl mx-auto animate-fade-in-up stagger-2">
          {/* Tabs */}
          <div className="flex">
            <button
              className={`flex-1 py-5 px-6 font-semibold text-lg transition-all duration-300 ${
                activeTab === 'sales'
                  ? 'bg-[#1e88e5] text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('sales')}
            >
              Sales
            </button>
            <button
              className={`flex-1 py-5 px-6 font-semibold text-lg transition-all duration-300 ${
                activeTab === 'rentals'
                  ? 'bg-[#1e88e5] text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('rentals')}
            >
              Rentals
            </button>
          </div>

          {/* Sales Filters */}
          {activeTab === 'sales' && (
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Property Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 text-left">Property Type</label>
                  <Select value={salesPropertyType} onValueChange={setSalesPropertyType}>
                    <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 hover:border-[#1e88e5] transition-colors">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {salesPropertyTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 text-left">Category</label>
                  <Select value={salesCategory} onValueChange={setSalesCategory}>
                    <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 hover:border-[#1e88e5] transition-colors">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSalesCategories().map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Area */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 text-left">Area</label>
                  <Select value={salesArea} onValueChange={setSalesArea}>
                    <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 hover:border-[#1e88e5] transition-colors">
                      <SelectValue placeholder="Select Area" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {areas.map((a) => (
                        <SelectItem key={a} value={a.toLowerCase().replace(/\s/g, '-')}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 text-left">Price</label>
                  <Select value={salesPrice} onValueChange={setSalesPrice}>
                    <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 hover:border-[#1e88e5] transition-colors">
                      <SelectValue placeholder="Select Price" />
                    </SelectTrigger>
                    <SelectContent>
                      {salesPriceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <Button 
                    className="w-full h-12 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-semibold btn-premium shadow-lg hover:shadow-xl transition-all"
                    onClick={handleSearch}
                  >
                    <Search className="mr-2" size={20} />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Rental Filters */}
          {activeTab === 'rentals' && (
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Property Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 text-left">Property Type</label>
                  <Select value={rentalPropertyType} onValueChange={setRentalPropertyType}>
                    <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 hover:border-[#1e88e5] transition-colors">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {rentalPropertyTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 text-left">Category</label>
                  <Select value={rentalCategory} onValueChange={setRentalCategory}>
                    <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 hover:border-[#1e88e5] transition-colors">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {rentalCategories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Area */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 text-left">Area</label>
                  <Select value={rentalArea} onValueChange={setRentalArea}>
                    <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 hover:border-[#1e88e5] transition-colors">
                      <SelectValue placeholder="Select Area" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {areas.map((a) => (
                        <SelectItem key={a} value={a.toLowerCase().replace(/\s/g, '-')}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* BHK */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 text-left">BHK</label>
                  <Select value={rentalBhk} onValueChange={setRentalBhk}>
                    <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 hover:border-[#1e88e5] transition-colors">
                      <SelectValue placeholder="Select BHK" />
                    </SelectTrigger>
                    <SelectContent>
                      {bhkOptions.map((bhk) => (
                        <SelectItem key={bhk} value={bhk.toLowerCase().replace(/\s/g, '-')}>{bhk}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 text-left">Rent</label>
                  <Select value={rentalPrice} onValueChange={setRentalPrice}>
                    <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 hover:border-[#1e88e5] transition-colors">
                      <SelectValue placeholder="Select Rent" />
                    </SelectTrigger>
                    <SelectContent>
                      {rentalPriceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <Button 
                    className="w-full h-12 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-semibold btn-premium shadow-lg hover:shadow-xl transition-all"
                    onClick={handleSearch}
                  >
                    <Search className="mr-2" size={20} />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12 mt-12 animate-fade-in-up stagger-3">
          <div className="text-center">
            <p className="text-4xl font-bold text-white">15+</p>
            <p className="text-white/70 text-sm">Years Experience</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">500+</p>
            <p className="text-white/70 text-sm">Properties Sold</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">1000+</p>
            <p className="text-white/70 text-sm">Happy Clients</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full animate-pulse-soft"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
