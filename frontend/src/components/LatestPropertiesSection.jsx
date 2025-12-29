import React, { useState } from 'react';
import { MapPin, Camera, Home, Grid3X3 } from 'lucide-react';
import { properties } from '../data/mockData';

const PropertyCard = ({ property }) => {
  return (
    <a 
      href={`/property/${property.id}`}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group"
    >
      <div className="relative">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.featured && (
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded">Featured</span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-[#1e88e5] text-white text-xs px-3 py-1 rounded">{property.status}</span>
        </div>
        {/* Location & Images count */}
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
  );
};

const LatestPropertiesSection = () => {
  const [activeTab, setActiveTab] = useState('villas');
  
  const filteredProperties = properties.filter(p => 
    activeTab === 'villas' ? p.type === 'Villas' : p.type === 'Plot'
  ).slice(0, 6);

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
          Latest Properties
        </h2>
        <p className="text-gray-600 text-center mb-8">
          These are the latest properties in the Sales category.
        </p>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white rounded-lg shadow p-1">
            <button
              onClick={() => setActiveTab('villas')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'villas'
                  ? 'bg-gray-100 text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Home size={18} />
              Villas
            </button>
            <button
              onClick={() => setActiveTab('plots')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'plots'
                  ? 'bg-gray-100 text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Grid3X3 size={18} />
              Plots
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-10">
          <a 
            href="/properties"
            className="inline-block border-2 border-[#1e88e5] text-[#1e88e5] px-8 py-3 rounded-lg font-medium hover:bg-[#1e88e5] hover:text-white transition-colors"
          >
            Load More Listings
          </a>
        </div>
      </div>
    </section>
  );
};

export default LatestPropertiesSection;
