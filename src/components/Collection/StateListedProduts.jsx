// components/StateListedProducts.jsx
"use client";
import React, { useState, useMemo } from 'react';
import { Sliders, ArrowUpDown } from 'lucide-react';
import ProductCard from '../ProductCard';
import FilterSidebar from '../FilterSidebar';
import SortMenu from '../SortMenu';

const StateListedProducts = ({ state }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2410]);
  const [activeAccordion, setActiveAccordion] = useState('price');

  const allProducts = [
    {
      id: 5,
      name: "Valentine's Special Square Design Gold Polished Mangalsutra",
      price: 640,
      originalPrice: 999,
      image: "/demo1.jpeg",
      isNew: true,
      state: "odisha", // Make sure state names are lowercase for consistent comparison
    },
    // Add other products here
  ];

  // Filter products based on state
  const filteredProducts = useMemo(() => {
    if (!state) return [];
    // Convert both to lowercase for case-insensitive comparison
    return allProducts.filter(
      (product) => product.state.toLowerCase() === state.toLowerCase()
    );
  }, [state, allProducts]);

  // Early return if no state is provided
  if (!state) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Invalid state selected.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div
        className={`max-w-7xl mx-auto px-[10px] md:px-[30px] py-4 transition-opacity duration-300 ${
          (showFilters || showSort) && "opacity-50 md:opacity-100"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Filter Sidebar */}
          <FilterSidebar
            isMobile={false}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            activeAccordion={activeAccordion}
            setActiveAccordion={setActiveAccordion}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Desktop Sort dropdown */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} products
              </p>
              <select className="px-4 py-2 font-body border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500">
                <option>Sort By: Price, low to high</option>
                <option>Sort By: Price, high to low</option>
                <option>Sort By: Newest first</option>
              </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* No products message */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No products found in {state}.</p>
              </div>
            )}
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
      <SortMenu showSort={showSort} setShowSort={setShowSort} />

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

export default StateListedProducts;