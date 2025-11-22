'use client'
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sliders, ArrowUpDown } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import SortMenu from '@/components/SortMenu';

const FeaturedCollectionPage = ({ products }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2410]);
  const [activeAccordion, setActiveAccordion] = useState('price');
  const [sortOption, setSortOption] = useState('price-low');

  const displayProducts = useMemo(() => {
    let filtered = products.filter(product => 
      product.salePrice >= priceRange[0] && 
      product.salePrice <= priceRange[1]
    );

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
  }, [products, priceRange, sortOption]);

  return (
    <motion.div 
      className="w-full bg-gray-100 mx-auto p-0 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-center font-heading text-gray-800 text-2xl md:text-4xl font-bold py-6">Featured Products</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
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
          <div className="hidden md:flex justify-end mb-6">
            <select 
              className="px-4 py-3 font-body border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="price-low">Sort By: Price, low to high</option>
              <option value="price-high">Sort By: Price, high to low</option>
              <option value="newest">Sort By: Newest first</option>
            </select>
          </div>

          <motion.div 
            className="grid px-[10px] md:px-0 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {displayProducts.map(product => (
              <motion.div key={product.id} className="h-full">
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {displayProducts.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <p>No products match your current filters.</p>
            </div>
          )}
        </div>
      </div>

      <FilterSidebar
        isMobile={true}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        activeAccordion={activeAccordion}
        setActiveAccordion={setActiveAccordion}
      />

      <SortMenu 
        showSort={showSort} 
        setShowSort={setShowSort} 
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 md:hidden z-40">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg text-purple-600 border border-purple-100 hover:bg-purple-50 transition"
        >
          <Sliders size={20} />
          <span>Filter</span>
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

export default FeaturedCollectionPage;