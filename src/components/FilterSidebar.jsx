"use client"
import React from 'react';
import { X, ChevronDown } from 'lucide-react';

const FilterSidebar = ({ 
  isMobile, 
  showFilters, 
  setShowFilters, 
  priceRange, 
  setPriceRange, 
  activeAccordion, 
  setActiveAccordion 
}) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowFilters(false);
    }
  };

  return (
    <>
      {isMobile && showFilters && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={handleOverlayClick}
        />
      )}
      
      <div className={`
        ${isMobile 
          ? 'fixed inset-y-0 left-0 w-[85%] sm:w-[400px] bg-white shadow-2xl z-50 transition-transform duration-300'
          : 'hidden md:block w-64 bg-white rounded-lg shadow-sm h-fit sticky top-20'}
        ${showFilters || !isMobile ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {isMobile && (
          <div className="flex justify-between items-center p-4 border-b bg-purple-50">
            <h2 className="text-xl font-semibold text-purple-900">Filters</h2>
            <button 
              onClick={() => setShowFilters(false)}
              className="p-2 hover:bg-purple-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-purple-700" />
            </button>
          </div>
        )}

        <div className="p-2 space-y-6 bg-purple-300 rounded-lg overflow-y-auto max-h-[calc(100vh-60px)]">
          {!isMobile && <h2 className="text-xl font-body text-center font-semibold mb-6 text-gray-800">FILTERS</h2>}
          
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
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="2410"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <button className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors">
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Occasions Section */}
          <div className="border rounded-lg overflow-hidden">
            <button 
              onClick={() => setActiveAccordion(activeAccordion === 'occasions' ? '' : 'occasions')}
              className="w-full flex justify-between items-center p-4 bg-purple-50 hover:bg-purple-100 transition-colors"
            >
              <span className="font-medium font-body text-purple-900">Occasions</span>
              <ChevronDown className={`w-5 h-5 text-purple-700 transition-transform ${activeAccordion === 'occasions' ? 'rotate-180' : ''}`} />
            </button>
            
            {activeAccordion === 'occasions' && (
              <div className="p-4 space-y-3 bg-white">
                {[
                  ['Casual Wear', '41'],
                  ['Daily Wear', '23'],
                  ['Festival', '36'],
                  ['Office Wear', '40']
                ].map(([label, count]) => (
                  <label key={label} className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 p-2 rounded-md transition-colors">
                    <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500" />
                    <span className="text-gray-700 font-body">{label}</span>
                    <span className="text-purple-400 text-sm font-body ml-auto">({count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;