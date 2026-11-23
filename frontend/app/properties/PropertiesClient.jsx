'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Camera, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { areas, propertyCategories } from '@/data/mockData';
import { generateSlug } from '@/data/properties';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const PropertiesClient = ({ properties, initialFilters = {} }) => {
  const [typeFilter, setTypeFilter] = useState(initialFilters.status || 'all');
  const [categoryFilter, setCategoryFilter] = useState(initialFilters.type || 'all');
  const [areaFilter, setAreaFilter] = useState(initialFilters.area || 'all');
  const [sortBy, setSortBy] = useState('price-high');

  // Helper function to parse price
  const parsePrice = (priceStr) => {
    if (priceStr.includes('crore')) {
      return parseFloat(priceStr.replace(/[^0-9.]/g, '')) * 10000000;
    } else if (priceStr.includes('lakh')) {
      return parseFloat(priceStr.replace(/[^0-9.]/g, '')) * 100000;
    } else if (priceStr.includes('thousand')) {
      return parseFloat(priceStr.replace(/[^0-9.]/g, '')) * 1000;
    }
    return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
  };

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Apply type filter (Sales/Rentals)
    if (typeFilter && typeFilter !== 'all') {
      result = result.filter(p => 
        p.status?.toLowerCase() === typeFilter.toLowerCase()
      );
    }
    // Apply category filter (Plot/Villas/House/etc.)
    if (categoryFilter && categoryFilter !== 'all') {
      result = result.filter(p => 
        p.type?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    if (areaFilter && areaFilter !== 'all') {
      result = result.filter(p => 
        p.area?.toLowerCase().includes(areaFilter.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'price-high') {
      result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    }

    return result;
  }, [properties, categoryFilter, areaFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-premium p-6 mb-8 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal size={20} className="text-[#1e88e5]" />
          <span className="font-semibold text-gray-700">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-12 bg-gray-50">
              <SelectValue placeholder="Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="rentals">Rentals</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-12 bg-gray-50">
              <SelectValue placeholder="Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {propertyCategories.map(cat => (
                <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="h-12 bg-gray-50">
              <SelectValue placeholder="Areas" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectItem value="all">All Areas</SelectItem>
              {areas.map(area => (
                <SelectItem key={area} value={area.toLowerCase()}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-12 bg-gray-50">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-high">Price High to Low</SelectItem>
              <SelectItem value="price-low">Price Low to High</SelectItem>
              <SelectItem value="newest">Newest first</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            className="h-12"
            onClick={() => { setTypeFilter('all'); setCategoryFilter('all'); setAreaFilter('all'); setSortBy('price-high'); }}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-gray-600 mb-6">
        Showing <span className="font-semibold text-gray-800">{filteredProperties.length}</span> properties
      </p>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property, index) => {
          const propertySlug = property.slug || generateSlug(property.title, property.location, property.type, property.id);
          return (
            <Link
              key={property.id}
              href={`/property/${propertySlug}`}
              className={`bg-white rounded-2xl overflow-hidden shadow-premium card-premium animate-fade-in-up stagger-${(index % 6) + 1} ${property.sold ? 'opacity-75' : ''}`}
            >
            <div className="relative h-52 img-zoom">
              <img 
                src={property.images?.[0] || '/images/properties/default-plot.jpg'} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <div className="absolute top-3 left-3 flex gap-2">
                {property.sold && (
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                    SOLD
                  </span>
                )}
                {property.featured && !property.sold && (
                  <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                    Featured
                  </span>
                )}
              </div>
              <div className="absolute top-3 right-3">
                {!property.sold && (
                  <span className="bg-[#1e88e5] text-white text-xs px-3 py-1.5 rounded-full font-medium">
                    {property.status}
                  </span>
                )}
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-white text-xs glass-dark px-3 py-1.5 rounded-full">
                  <MapPin size={12} />
                  <span className="truncate max-w-[150px]">{property.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-white text-xs glass-dark px-3 py-1.5 rounded-full">
                  <Camera size={12} />
                  <span>{property.images?.length || 0}</span>
                </div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-gray-800 mb-2 truncate text-lg">
                {property.title}
              </h3>
              <p className={`font-bold text-xl mb-3 ${property.sold ? 'text-gray-500 line-through' : 'text-[#1e88e5]'}`}>{property.price}</p>
              <p className="text-gray-500 text-sm line-clamp-2">{property.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">{property.type}</span>
                <span className="text-[#1e88e5] text-sm font-medium flex items-center gap-1">
                  View Details <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
          )
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-12">
        {[1, 2, 3].map(page => (
          <button
            key={page}
            className={`w-12 h-12 rounded-xl font-medium transition-all ${
              page === 1 
                ? 'bg-[#1e88e5] text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-premium'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PropertiesClient;
