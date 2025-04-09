'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    // Detect if price filters are applied to show visual indicator
    if (priceRange[0] > 0 || priceRange[1] < 2410) {
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
    }
  }, [priceRange]);

  const displayProducts = useMemo(() => {
    let filtered = initialProducts;
    
    // Apply price filter
    filtered = filtered.filter(product => 
      product.salePrice >= priceRange[0] && 
      product.salePrice <= priceRange[1]
    );
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        return filtered.sort((a, b) => a.salePrice - b.salePrice);
      case 'price-high':
        return filtered.sort((a, b) => b.salePrice - a.salePrice);
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return filtered;
    }
  }, [initialProducts, priceRange, sortOption]);

  return (
    <motion.div 
      className="w-full py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-center font-heading text-gray-800 text-4xl md:text-5xl font-bold mb-8">{category.name}</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block w-72">
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

        <div className="flex-1">
          {/* Desktop Sort Dropdown */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              {displayProducts.length} products found
            </div>
            <select 
              className="px-4 py-3 font-body border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="price-low">Sort By: Price, low to high</option>
              <option value="price-high">Sort By: Price, high to low</option>
              <option value="newest">Sort By: Newest first</option>
              {/* Removed popular option as requested */}
            </select>
          </div>

          {/* Active Filters - Mobile & Desktop */}
          {isFiltered && (
            <div className="flex flex-wrap gap-2 mb-4 px-4 md:px-0">
              {priceRange[0] > 0 && (
                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
                  <span>Min: ₹{priceRange[0]}</span>
                </div>
              )}
              {priceRange[1] < 2410 && (
                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
                  <span>Max: ₹{priceRange[1]}</span>
                </div>
              )}
              <button 
                onClick={() => {
                  setPriceRange([0, 2410]);
                }}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {displayProducts.length > 0 ? (
              displayProducts.map(product => (
                <motion.div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <p className="text-lg text-gray-500">No products match your filter criteria</p>
                <button 
                  onClick={() => {
                    setPriceRange([0, 2410]);
                  }}
                  className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <FilterSidebar
        isMobile={true}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        activeAccordion={activeAccordion}
        setActiveAccordion={setActiveAccordion}
      />

      {/* Mobile Sort Sheet */}
      <SortMenu 
        showSort={showSort} 
        setShowSort={setShowSort} 
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* Mobile Filter/Sort Buttons */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 md:hidden z-30">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(true)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-lg border transition ${
            isFiltered 
              ? 'bg-purple-600 text-white border-purple-600' 
              : 'bg-white text-purple-600 border-purple-100 hover:bg-purple-50'
          }`}
        >
          <Sliders size={20} />
          <span>Filter{isFiltered ? 'ed' : ''}</span>
          {isFiltered && (
            <span className="inline-block ml-1 w-2 h-2 bg-white rounded-full"></span>
          )}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSort(true)}
          className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg text-purple-600 border border-purple-100 hover:bg-purple-50 transition"
        >
          <ArrowUpDown size={20} />
          <span>Sort</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CategoryPage;