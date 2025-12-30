import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Camera, Home, Grid3X3, ArrowRight } from 'lucide-react';
import { loadProperties } from '../utils/dataLoader';

const PropertyCard = ({ property, index }) => {
  return (
    <Link 
      to={`/property/${property.id}`}
      className={`bg-white rounded-2xl overflow-hidden shadow-premium card-premium animate-fade-in-up stagger-${(index % 6) + 1}`}
    >
      <div className="relative h-56 img-zoom">
        <img 
          src={property.images?.[0] || '/images/properties/default-plot.jpg'} 
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {property.featured && (
            <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
              Featured
            </span>
          )}
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-[#1e88e5] text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
            {property.status}
          </span>
        </div>
        
        {/* Bottom Info */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-white text-xs glass-dark px-3 py-1.5 rounded-full">
            <MapPin size={12} />
            <span className="truncate max-w-[140px]">{property.area}, {property.city}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white text-xs glass-dark px-3 py-1.5 rounded-full">
            <Camera size={12} />
            <span>{property.images?.length || 0}</span>
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-800 mb-2 truncate text-lg group-hover:text-[#1e88e5] transition-colors">
          {property.title}
        </h3>
        <p className="text-[#1e88e5] font-bold text-xl mb-3">{property.price}</p>
        <p className="text-gray-500 text-sm line-clamp-2">{property.description}</p>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">{property.type}</span>
          <span className="text-[#1e88e5] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            View Details <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
};

const LatestPropertiesSection = () => {
  const [activeTab, setActiveTab] = useState('villas');
  const [properties, setProperties] = useState([]);
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await loadProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);
  
  const filteredProperties = properties.filter(p => 
    activeTab === 'villas' ? p.type === 'Villas' : p.type === 'Plot'
  ).slice(0, 6);

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#1e88e5] font-semibold text-sm tracking-wider uppercase">Featured</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mt-2 mb-4">
            Latest Properties
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our newest listings. Premium properties handpicked for discerning buyers.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full shadow-premium p-1.5">
            <button
              onClick={() => setActiveTab('villas')}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'villas'
                  ? 'bg-[#1e88e5] text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Home size={18} />
              Villas
            </button>
            <button
              onClick={() => setActiveTab('plots')}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'plots'
                  ? 'bg-[#1e88e5] text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Grid3X3 size={18} />
              Plots
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Link 
            to="/properties"
            className="inline-flex items-center gap-2 bg-white border-2 border-[#1e88e5] text-[#1e88e5] px-8 py-4 rounded-full font-semibold hover:bg-[#1e88e5] hover:text-white transition-all duration-300 shadow-premium hover:shadow-premium-hover"
          >
            View All Properties
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestPropertiesSection;
