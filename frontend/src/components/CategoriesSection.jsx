import React from 'react';
import { categories } from '../data/mockData';

const CategoriesSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
          Properties by Category
        </h2>
        <p className="text-gray-600 text-center mb-12">
          Highlight the best of our properties by category.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <a
              key={category.id}
              href={`/listings/${category.name.toLowerCase()}`}
              className={`relative group overflow-hidden rounded-lg ${
                index < 3 ? 'h-64' : 'h-56'
              }`}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-white/80">{category.listings} listings</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
