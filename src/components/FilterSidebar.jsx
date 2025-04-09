"use client"
import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterSidebar = ({ 
  isMobile, 
  showFilters, 
  setShowFilters, 
  priceRange, 
  setPriceRange, 
  activeAccordion, 
  setActiveAccordion 
}) => {
  const [minPrice, setMinPrice] = useState(priceRange[0]);
  const [maxPrice, setMaxPrice] = useState(priceRange[1]);
  
  // Check if filters are applied
  const isFiltered = priceRange[0] > 0 || priceRange[1] < 2410;

  useEffect(() => {
    // Update local state when the parent state changes
    setMinPrice(priceRange[0]);
    setMaxPrice(priceRange[1]);
  }, [priceRange]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowFilters(false);
    }
  };

  const handleApplyPriceRange = () => {
    setPriceRange([parseInt(minPrice), parseInt(maxPrice)]);
    if (isMobile) {
      // Close the accordion after applying on mobile
      setActiveAccordion('');
    }
  };

  const handleResetFilters = () => {
    setMinPrice(0);
    setMaxPrice(2410);
    setPriceRange([0, 2410]); // Make sure we update the parent state
  };

  // Helper function to determine input color based on content
  const getInputTextColor = (value) => {
    return value > 0 ? "text-gray-800" : "text-gray-400";
  };

  const mobileFilterContent = (
    <AnimatePresence>
      {showFilters && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleOverlayClick}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 w-[85%] sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex justify-between items-center p-4 border-b border-purple-100 bg-white">
              <h2 className="text-xl font-semibold font-body text-purple-900">
                Filters 
                {isFiltered && (
                  <span className="inline-block ml-2 w-3 h-3 bg-purple-600 rounded-full"></span>
                )}
              </h2>
              <button 
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-purple-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-purple-700" />
              </button>
            </div>
            <div className="p-4 space-y-6 overflow-y-auto flex-1">
              {renderFilterContent()}
            </div>
            <div className="p-4 border-t border-purple-100 bg-white flex gap-3">
              <button 
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  isFiltered 
                    ? "bg-gray-800 text-white hover:bg-gray-900" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                onClick={handleResetFilters}
                disabled={!isFiltered}
              >
                Reset All
              </button>
              <button 
                className="flex-1 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  const desktopFilterContent = (
    <div className="bg-white rounded-lg shadow p-4 space-y-6 h-fit sticky top-20">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold font-body text-gray-800">FILTERS</h2>
        {isFiltered && (
          <span className="inline-block w-3 h-3 bg-purple-600 rounded-full"></span>
        )}
      </div>
      {renderFilterContent()}
      {isFiltered && (
        <button 
          className="w-full py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
          onClick={handleResetFilters}
        >
          Reset Filters
        </button>
      )}
    </div>
  );

  function renderFilterContent() {
    return (
      <>
        {/* Price Range Section */}
        <div className="border rounded-lg overflow-hidden">
          <button 
            onClick={() => setActiveAccordion(activeAccordion === 'price' ? '' : 'price')}
            className="w-full flex justify-between items-center p-4 bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <span className="font-medium text-purple-900">Price Range</span>
            <ChevronDown className={`w-5 h-5 text-purple-700 transition-transform ${activeAccordion === 'price' ? 'rotate-180' : ''}`} />
          </button>
          
          {activeAccordion === 'price' && (
            <div className="p-4 space-y-4 bg-white">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm text-gray-600 block mb-1">Min</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input 
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      min="0"
                      max={maxPrice}
                      className={`w-full pl-6 pr-2 py-2 border rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none ${getInputTextColor(minPrice)}`}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600 block mb-1">Max</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input 
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      min={minPrice}
                      max="2410"
                      className={`w-full pl-6 pr-2 py-2 border rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none ${getInputTextColor(maxPrice)}`}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <input 
                  type="range"
                  min="0"
                  max="2410"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
              
              <button 
                className={`w-full py-2 rounded-md transition-colors ${
                  minPrice > 0 || maxPrice < 2410
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                onClick={handleApplyPriceRange}
                disabled={minPrice === 0 && maxPrice === 2410}
              >
                Apply Price Range
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {isMobile ? mobileFilterContent : desktopFilterContent}
    </>
  );
};

export default FilterSidebar;