import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapPin, Camera, Filter, ChevronDown } from 'lucide-react';
import { properties, areas, propertyCategories } from '../data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const PropertiesPage = () => {
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [sortBy, setSortBy] = useState('price-high');

  let filteredProperties = [...properties];

  // Apply filters
  if (categoryFilter) {
    filteredProperties = filteredProperties.filter(p => 
      p.type.toLowerCase() === categoryFilter.toLowerCase()
    );
  }
  if (areaFilter) {
    filteredProperties = filteredProperties.filter(p => 
      p.area.toLowerCase().includes(areaFilter.toLowerCase())
    );
  }

  // Sort
  if (sortBy === 'price-high') {
    filteredProperties.sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
      const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
      return priceB - priceA;
    });
  } else if (sortBy === 'price-low') {
    filteredProperties.sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
      const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
      return priceA - priceB;
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800">Properties List – All Properties</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="rentals">Rentals</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categories" />
              </SelectTrigger>
              <SelectContent>
                {propertyCategories.map(cat => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Areas" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {areas.map(area => (
                  <SelectItem key={area} value={area.toLowerCase()}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value="jaipur">
              <SelectTrigger>
                <SelectValue placeholder="Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jaipur">Jaipur</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-high">Price High to Low</SelectItem>
                <SelectItem value="price-low">Price Low to High</SelectItem>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <a
              key={property.id}
              href={`/property/${property.id}`}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="relative">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {property.featured && (
                    <span className="bg-green-500 text-white text-xs px-3 py-1 rounded">Featured</span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-[#1e88e5] text-white text-xs px-3 py-1 rounded">{property.status}</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                  <div className="flex items-center gap-1 text-white text-xs bg-black/50 px-2 py-1 rounded">
                    <MapPin size={12} />
                    <span className="truncate max-w-[150px]">{property.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white text-xs bg-black/50 px-2 py-1 rounded">
                    <Camera size={12} />
                    <span>{property.images}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 truncate group-hover:text-[#1e88e5] transition-colors">
                  {property.title}
                </h3>
                <p className="text-[#1e88e5] font-bold text-lg mb-2">{property.price}</p>
                <p className="text-gray-600 text-sm line-clamp-2">{property.description}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-10">
          {[1, 2, 3].map(page => (
            <button
              key={page}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                page === 1 
                  ? 'bg-[#1e88e5] text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertiesPage;
