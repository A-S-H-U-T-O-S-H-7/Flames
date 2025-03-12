'use client'
import React, { useState, useMemo } from 'react';
import { Sliders, ArrowUpDown } from 'lucide-react';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import SortMenu from './SortMenu';

const CategoryPage = ({ initialProducts, category }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2410]);
  const [activeAccordion, setActiveAccordion] = useState('price');
  const [sortOption, setSortOption] = useState('price-low');

  // Memoized filtered and sorted products
  const displayProducts = useMemo(() => {
    let filtered = initialProducts.filter(product => 
      product.price >= priceRange[0] && 
      product.price <= priceRange[1]
    );

    switch (sortOption) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return filtered;
    }
  }, [initialProducts, priceRange, sortOption]);

  return (
    <div className="w-full  mx-auto">
      <h1 className="text-center font-semibold font-heading text-gray-800 text-4xl mb-8">{category.name}</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block w-64">
          <FilterSidebar
            isMobile={false}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            activeAccordion={activeAccordion}
            setActiveAccordion={setActiveAccordion}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Desktop Sort dropdown */}
          <div className="hidden md:flex justify-end mb-6">
            <select 
              className="px-4 py-2 font-body border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="price-low">Sort By: Price, low to high</option>
              <option value="price-high">Sort By: Price, high to low</option>
              <option value="newest">Sort By: Newest first</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 lg:gap-4">
            {displayProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>


          
        </div>
      </div>

      {/* Mobile Filters */}
      <FilterSidebar
        isMobile={true}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        activeAccordion={activeAccordion}
        setActiveAccordion={setActiveAccordion}
      />

      {/* Mobile Sort Menu */}
      <SortMenu 
        showSort={showSort} 
        setShowSort={setShowSort} 
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* Mobile floating buttons */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 md:hidden z-40">
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg text-purple-600 border border-purple-100 hover:bg-purple-50 transition-all active:scale-95"
        >
          <Sliders size={20} />
          <span>Filter</span>
        </button>
        <button
          onClick={() => setShowSort(true)}
          className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg text-purple-600 border border-purple-100 hover:bg-purple-50 transition-all active:scale-95"
        >
          <ArrowUpDown size={20} />
          <span>Sort</span>
        </button>
      </div>
    </div>
  );
};

export default CategoryPage;