import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapPin, Camera, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { areas, propertyCategories } from '../data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { loadProperties } from '../utils/dataLoader';

const PropertiesPage = () => {
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [sortBy, setSortBy] = useState('price-high');
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const data = await loadProperties();
      setAllProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setAllProperties([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

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

  let filteredProperties = [...allProperties];

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
    filteredProperties.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  } else if (sortBy === 'price-low') {
    filteredProperties.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">All Properties</h1>
          <p className="text-white/80 text-lg">Discover your perfect property from our exclusive listings</p>
        </div>
      </div>

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
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="rentals">Rentals</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-12 bg-gray-50">
                <SelectValue placeholder="Categories" />
              </SelectTrigger>
              <SelectContent>
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
                {areas.map(area => (
                  <SelectItem key={area} value={area.toLowerCase()}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value="jaipur">
              <SelectTrigger className="h-12 bg-gray-50">
                <SelectValue placeholder="Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jaipur">Jaipur</SelectItem>
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
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          Showing <span className="font-semibold text-gray-800">{filteredProperties.length}</span> properties
        </p>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-premium animate-pulse">
                <div className="h-52 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property, index) => (
              <Link
                key={property.id}
                to={`/property/${property.id}`}
                className={`bg-white rounded-2xl overflow-hidden shadow-premium card-premium animate-fade-in-up stagger-${(index % 6) + 1}`}
              >
                <div className="relative h-52 img-zoom">
                  <img 
                    src={property.images?.[0] || '/images/properties/default-plot.jpg'} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    {property.featured && (
                      <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-[#1e88e5] text-white text-xs px-3 py-1.5 rounded-full font-medium">
                      {property.status}
                    </span>
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
                  <p className="text-[#1e88e5] font-bold text-xl mb-3">{property.price}</p>
                  <p className="text-gray-500 text-sm line-clamp-2">{property.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{property.type}</span>
                    <span className="text-[#1e88e5] text-sm font-medium flex items-center gap-1">
                      View Details <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

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

      <Footer />
    </div>
  );
};

export default PropertiesPage;
