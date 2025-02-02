"use client"
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sliders, ArrowUpDown } from 'lucide-react';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import SortMenu from './SortMenu';

const FeaturedCollectionPage = ({ category }) => {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2410]);
  const [activeAccordion, setActiveAccordion] = useState('price');

  // Sample product data
  const allProducts = [
    { id: 1, name: "Valentine's Special Square Design Gold Polished Mangalsutra", price: 640, originalPrice: 999, image: "/demo1.jpeg", isNew: true, category: "necklace", isFeatured: true },
    { id: 2, name: "Valentine's Special Fancy Gold Plated Diamond Necklace", price: 840, originalPrice: 1299, image: "/demo2.jpeg", isNew: true, category: "necklace", isFeatured: false },
    { id: 3, name: "Diamond Studded Gold Ring", price: 540, originalPrice: 799, image: "/demo3.jpeg", isNew: true, category: "ring", isFeatured: true },
    { id: 4, name: "Traditional Gold Band Ring", price: 420, originalPrice: 699, image: "/demo4.jpeg", isNew: false, category: "ring", isFeatured: false },
    { id: 5, name: "Rose Gold Engagement Ring", price: 890, originalPrice: 1499, image: "/api/placeholder/300/300", isNew: true, category: "ring", isFeatured: false },
    { id: 6, name: "Crystal Drop Earrings", price: 340, originalPrice: 599, image: "/api/placeholder/300/300", isNew: false, category: "earring", isFeatured: true },
    { id: 7, name: "Gold Plated Stud Earrings", price: 240, originalPrice: 399, image: "/api/placeholder/300/300", isNew: true, category: "earring", isFeatured: false }
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = allProducts;
    if (category) {
      products = products.filter(product => product.category.toLowerCase() === category.toLowerCase());
    }
    return products.sort((a, b) => b.isFeatured - a.isFeatured);
  }, [category]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className={`max-w-7xl mx-auto px-[10px] md:px-[30px] py-4 transition-opacity duration-300 ${(showFilters || showSort) && 'opacity-50 md:opacity-100'}`}>        
        <div className="flex flex-col md:flex-row gap-6">
          <FilterSidebar 
            isMobile={false}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            activeAccordion={activeAccordion}
            setActiveAccordion={setActiveAccordion}
          />

          <div className="flex-1">
            <div className="hidden md:flex justify-end mb-6">
              <select className="px-4 py-2 font-body border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500">
                <option>Sort By: Price, low to high</option>
                <option>Sort By: Price, high to low</option>
                <option>Sort By: Newest first</option>
              </select>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No products found in this category.</p>
              </div>
            )}
          </div>
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

      <SortMenu showSort={showSort} setShowSort={setShowSort} />
    </div>
  );
};

export default FeaturedCollectionPage;







