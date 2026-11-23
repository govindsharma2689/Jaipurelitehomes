'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { categories } from '@/data/mockData';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';

const CategoriesSection = () => {
  const [propertyCounts, setPropertyCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/properties`);
        if (res.ok) {
          const properties = await res.json();
          const counts = {};
          properties.forEach(p => {
            const type = (p.type || '').toLowerCase();
            counts[type] = (counts[type] || 0) + 1;
          });
          setPropertyCounts(counts);
        }
      } catch (e) {
        console.error('Failed to fetch property counts');
      }
    };
    fetchCounts();
  }, []);

  const getCount = (name) => {
    const key = name.toLowerCase();
    return propertyCounts[key] || 0;
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#1e88e5] font-semibold text-sm tracking-wider uppercase">Explore</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mt-2 mb-4">
            Properties by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the perfect property that matches your lifestyle. From luxurious villas to prime plots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/properties?type=${category.name.toLowerCase()}`}
              className={`relative group overflow-hidden rounded-2xl card-premium shadow-premium ${
                index < 3 ? 'h-72' : 'h-60'
              } animate-fade-in-up stagger-${index + 1}`}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover card-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              <div className="absolute inset-0 bg-[#1e88e5]/0 group-hover:bg-[#1e88e5]/20 transition-all duration-500"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-display font-bold mb-1 group-hover:translate-x-2 transition-transform duration-300">
                  {category.name}
                </h3>
                <p className="text-sm text-white/80 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                  {getCount(category.name)} listings available
                </p>
                <div className="w-0 group-hover:w-12 h-0.5 bg-white mt-3 transition-all duration-300"></div>
              </div>

              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[#1e88e5] text-sm font-semibold">View All</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
