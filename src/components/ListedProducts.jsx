"use client"
import React, { useState, useMemo } from 'react';
import { Sliders, ArrowUpDown } from 'lucide-react';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import SortMenu from './SortMenu';

const ListedProducts = ({ category }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2410]);
  const [activeAccordion, setActiveAccordion] = useState('price');

  // Sample product data
const allProducts = [
  // Necklaces
  {
    id: 1,
    name: "Valentine's Special Square Design Gold Polished Mangalsutra",
    price: 640,
    originalPrice: 999,
    image: "/demo1.jpeg",
    isNew: true,
    category: "necklace"
  },
  {
    id: 2,
    name: "Valentine's Special Fancy Gold Plated Diamond Necklace",
    price: 840,
    originalPrice: 1299,
    image: "/demo2.jpeg",
    isNew: true,
    category: "necklace"
  },
  {
    id: 3,
    name: "Valentine's Special Fancy Gold Plated Diamond Necklace",
    price: 840,
    originalPrice: 1299,
    image: "/demo2.jpeg",
    isNew: true,
    category: "necklace"
  },{
    id: 4,
    name: "Valentine's Special Fancy Gold Plated Diamond Necklace",
    price: 840,
    originalPrice: 1299,
    image: "/demo2.jpeg",
    isNew: true,
    category: "necklace"
  },{
    id: 5,
    name: "Valentine's Special Fancy Gold Plated Diamond Necklace",
    price: 840,
    originalPrice: 1299,
    image: "/demo2.jpeg",
    isNew: true,
    category: "necklace"
  },{
    id: 6,
    name: "Valentine's Special Fancy Gold Plated Diamond Necklace",
    price: 840,
    originalPrice: 1299,
    image: "/demo2.jpeg",
    isNew: true,
    category: "necklace"
  },{
    id: 7,
    name: "Valentine's Special Fancy Gold Plated Diamond Necklace",
    price: 840,
    originalPrice: 1299,
    image: "/demo2.jpeg",
    isNew: true,
    category: "necklace"
  },
  
  // Rings
  {
    id: 3,
    name: "Diamond Studded Gold Ring",
    price: 540,
    originalPrice: 799,
    image: "/demo3.jpeg",
    isNew: true,
    category: "ring"
  },
  {
    id: 4,
    name: "Traditional Gold Band Ring",
    price: 420,
    originalPrice: 699,
    image: "/demo4.jpeg",
    isNew: false,
    category: "ring"
  },
  {
    id: 5,
    name: "Rose Gold Engagement Ring",
    price: 890,
    originalPrice: 1499,
    image: "/api/placeholder/300/300",
    isNew: true,
    category: "ring"
  },

  // Earrings
  {
    id: 6,
    name: "Crystal Drop Earrings",
    price: 340,
    originalPrice: 599,
    image: "/api/placeholder/300/300",
    isNew: false,
    category: "earring"
  },
  {
    id: 7,
    name: "Gold Plated Stud Earrings",
    price: 240,
    originalPrice: 399,
    image: "/api/placeholder/300/300",
    isNew: true,
    category: "earring"
  },

  // Pendants
  {
    id: 8,
    name: "Heart Shaped Gold Pendant",
    price: 440,
    originalPrice: 699,
    image: "/api/placeholder/300/300",
    isNew: true,
    category: "pendant"
  },
  {
    id: 9,
    name: "Diamond Solitaire Pendant",
    price: 940,
    originalPrice: 1599,
    image: "/api/placeholder/300/300",
    isNew: false,
    category: "pendant"
  },

  // Bracelets
  {
    id: 10,
    name: "Gold Chain Bracelet",
    price: 540,
    originalPrice: 899,
    image: "/api/placeholder/300/300",
    isNew: true,
    category: "bracelet"
  },
  {
    id: 11,
    name: "Silver Charm Bracelet",
    price: 340,
    originalPrice: 599,
    image: "/api/placeholder/300/300",
    isNew: false,
    category: "bracelet"
  },

  // Anklets
  {
    id: 12,
    name: "Traditional Silver Anklet",
    price: 240,
    originalPrice: 399,
    image: "/api/placeholder/300/300",
    isNew: true,
    category: "anklet"
  },
  {
    id: 13,
    name: "Pearl Beaded Anklet",
    price: 180,
    originalPrice: 299,
    image: "/api/placeholder/300/300",
    isNew: false,
    category: "anklet"
  },

  // Brooches
  {
    id: 14,
    name: "Vintage Crystal Brooch",
    price: 280,
    originalPrice: 499,
    image: "/api/placeholder/300/300",
    isNew: false,
    category: "brooch"
  },
  {
    id: 15,
    name: "Pearl Flower Brooch",
    price: 320,
    originalPrice: 549,
    image: "/api/placeholder/300/300",
    isNew: true,
    category: "brooch"
  },

  // Handbags
  {
    id: 16,
    name: "Designer Evening Clutch",
    price: 740,
    originalPrice: 1299,
    image: "/api/placeholder/300/300",
    isNew: true,
    category: "handbag"
  },
  {
    id: 17,
    name: "Classic Leather Handbag",
    price: 940,
    originalPrice: 1599,
    image: "/api/placeholder/300/300",
    isNew: false,
    category: "handbag"
  },

  // gifts
  
  {
    id: 17,
    name: "Designer Evening Design",
    price: 740,
    originalPrice: 1299,
    image: "/api/placeholder/300/300",
    isNew: true,
    category: "gift"
  },
  {
    id: 18,
    name: "Classic Potrait",
    price: 940,
    originalPrice: 1599,
    image: "/api/placeholder/300/300",
    isNew: false,
    category: "gift"
  }
];

  // Filter products based on category
  const filteredProducts = useMemo(() => {
    if (!category) return allProducts;
    return allProducts.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }, [category, allProducts]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className={`max-w-7xl mx-auto px-[10px] md:px-[30px] py-4 transition-opacity duration-300 ${(showFilters || showSort) && 'opacity-50 md:opacity-100'}`}>
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
            <div className="hidden md:flex justify-end mb-6">
              <select className="px-4 py-2 font-body border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500">
                <option>Sort By: Price, low to high</option>
                <option>Sort By: Price, high to low</option>
                <option>Sort By: Newest first</option>
              </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* No products message */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No products found in this category.</p>
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

export default ListedProducts;