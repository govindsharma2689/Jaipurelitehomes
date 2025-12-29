import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Camera } from 'lucide-react';
import { properties } from '../data/mockData';

const PropertiesCarousel = () => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const salesProperties = properties.slice(0, 10);
  
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
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
          Properties for Sale
        </h2>
        <p className="text-gray-600 text-center mb-10">
          These are the latest properties in the Sales.
        </p>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors -ml-4"
            aria-label="Previous"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors -mr-4"
            aria-label="Next"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>

          {/* Carousel */}
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {salesProperties.map((property) => (
              <a
                key={property.id}
                href={`/property/${property.id}`}
                className="flex-shrink-0 w-80 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
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
                      <span className="truncate max-w-[120px]">{property.area}, {property.city}</span>
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
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3, 4, 5].map((dot) => (
            <button
              key={dot}
              className={`w-3 h-3 rounded-full transition-colors ${
                dot === 1 ? 'bg-[#1e88e5]' : 'bg-gray-300 hover:bg-gray-400'
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
