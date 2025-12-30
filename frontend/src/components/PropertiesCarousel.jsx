import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Camera } from 'lucide-react';
import { loadProperties } from '../utils/dataLoader';

const PropertiesCarousel = () => {
  const scrollRef = useRef(null);
  const [salesProperties, setSalesProperties] = useState([]);
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await loadProperties();
        setSalesProperties(data.slice(0, 10));
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount 
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-20 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#1e88e5] font-semibold text-sm tracking-wider uppercase">For Sale</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mt-2 mb-4">
            Properties for Sale
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our exclusive collection of properties available for sale in prime locations.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-premium-lg rounded-full p-4 hover:bg-gray-50 transition-all hover:scale-110 -ml-6 hidden md:flex items-center justify-center"
            aria-label="Previous"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-premium-lg rounded-full p-4 hover:bg-gray-50 transition-all hover:scale-110 -mr-6 hidden md:flex items-center justify-center"
            aria-label="Next"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>

          {/* Carousel */}
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-4 px-4"
          >
            {salesProperties.map((property, index) => (
              <Link
                key={property.id}
                to={`/property/${property.id}`}
                className={`flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-premium card-premium animate-fade-in-up stagger-${(index % 5) + 1}`}
              >
                <div className="relative h-52 img-zoom">
                  <img 
                    src={property.images?.[0] || '/images/properties/default-plot.jpg'} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {property.featured && (
                      <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-[#1e88e5] text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
                      {property.status}
                    </span>
                  </div>
                  
                  {/* Bottom Info */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-white text-xs glass-dark px-3 py-1.5 rounded-full">
                      <MapPin size={12} />
                      <span className="truncate max-w-[120px]">{property.area}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white text-xs glass-dark px-3 py-1.5 rounded-full">
                      <Camera size={12} />
                      <span>{property.images?.length || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 mb-2 truncate hover:text-[#1e88e5] transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-[#1e88e5] font-bold text-xl mb-2">{property.price}</p>
                  <p className="text-gray-500 text-sm line-clamp-2">{property.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[1, 2, 3, 4, 5].map((dot) => (
            <button
              key={dot}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                dot === 1 ? 'bg-[#1e88e5] w-8' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${dot}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertiesCarousel;
