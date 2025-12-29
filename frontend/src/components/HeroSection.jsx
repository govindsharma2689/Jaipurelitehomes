import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { areas, propertyCategories } from '../data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [category, setCategory] = useState('');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState('');

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Jaipur Elite Homes
        </h1>
        <h2 className="text-2xl md:text-3xl lg:text-4xl text-white mb-6">
          Where Dreams Meet Luxury
        </h2>
        <p className="text-white/90 text-sm md:text-base mb-10 max-w-2xl mx-auto">
          We have 15+ years of experience in real estate. We are recognized for exceeding client 
          expectations and delivering great results through dedication, ease of process, and 
          extraordinary services to our clients.
        </p>

        {/* Search Box */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex">
            <button
              className={`flex-1 py-4 px-6 font-medium text-lg transition-colors ${
                activeTab === 'sales'
                  ? 'bg-white text-gray-800'
                  : 'bg-[#1e88e5] text-white'
              }`}
              onClick={() => setActiveTab('sales')}
            >
              Sales
            </button>
            <button
              className={`flex-1 py-4 px-6 font-medium text-lg transition-colors ${
                activeTab === 'rentals'
                  ? 'bg-white text-gray-800'
                  : 'bg-[#1e88e5] text-white'
              }`}
              onClick={() => setActiveTab('rentals')}
            >
              Rentals
            </button>
          </div>

          {/* Filters */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2 text-left">Categories</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Property Category" />
                </SelectTrigger>
                <SelectContent>
                  {propertyCategories.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2 text-left">Area</label>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Property Area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((a) => (
                    <SelectItem key={a} value={a.toLowerCase().replace(/\s/g, '-')}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2 text-left">Price</label>
              <Select value={price} onValueChange={setPrice}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={activeTab === 'sales' ? 'Sale Price' : 'Rental Price'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-15">₹ 0 - ₹ 15 lakh</SelectItem>
                  <SelectItem value="15-50">₹ 15 lakh - ₹ 50 lakh</SelectItem>
                  <SelectItem value="50-1cr">₹ 50 lakh - ₹ 1 crore</SelectItem>
                  <SelectItem value="1cr+">₹ 1 crore+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full bg-[#1e88e5] hover:bg-[#1565c0] text-white py-6">
                <Search className="mr-2" size={18} />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
