import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { areas, propertyCategories, heroData } from '../data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [category, setCategory] = useState('');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState('');

  const handleSearch = () => {
    console.log('Searching:', { activeTab, category, area, price });
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
        <div className="glass-white rounded-2xl shadow-premium-lg overflow-hidden max-w-4xl mx-auto animate-fade-in-up stagger-2">
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

          {/* Filters */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 text-left">Categories</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 hover:border-[#1e88e5] transition-colors">
                  <SelectValue placeholder="Property Category" />
                </SelectTrigger>
                <SelectContent>
                  {propertyCategories.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 text-left">Area</label>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 hover:border-[#1e88e5] transition-colors">
                  <SelectValue placeholder="Property Area" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {areas.map((a) => (
                    <SelectItem key={a} value={a.toLowerCase().replace(/\s/g, '-')}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 text-left">Price</label>
              <Select value={price} onValueChange={setPrice}>
                <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 hover:border-[#1e88e5] transition-colors">
                  <SelectValue placeholder={activeTab === 'sales' ? 'Sale Price' : 'Rental Price'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-15">₹ 0 - ₹ 15 lakh</SelectItem>
                  <SelectItem value="15-50">₹ 15 lakh - ₹ 50 lakh</SelectItem>
                  <SelectItem value="50-1cr">₹ 50 lakh - ₹ 1 crore</SelectItem>
                  <SelectItem value="1cr-2cr">₹ 1 crore - ₹ 2 crore</SelectItem>
                  <SelectItem value="2cr+">₹ 2 crore+</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
