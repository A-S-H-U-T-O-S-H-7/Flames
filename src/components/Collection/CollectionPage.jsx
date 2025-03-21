'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { Sliders, ArrowUpDown } from 'lucide-react';
import ProductCard from '../ProductCard';
import FilterSidebar from '../FilterSidebar';
import SortMenu from '../SortMenu';
import { getProduct } from "@/lib/firestore/products/read_server";

// Helper function to serialize Firestore timestamps and other non-serializable data
const serializeData = (data) => {
  if (!data) return null;
  
  // Convert the data to a plain object
  const serialized = { ...data };
  
  // Convert timestamps to ISO strings
  if (serialized.timestampCreate && typeof serialized.timestampCreate.toDate === 'function') {
    serialized.timestampCreate = serialized.timestampCreate.toDate().toISOString();
  }
  
  if (serialized.timestampUpdate && typeof serialized.timestampUpdate.toDate === 'function') {
    serialized.timestampUpdate = serialized.timestampUpdate.toDate().toISOString();
  }
  
  // If there's a createdAt field (used in sorting)
  if (serialized.createdAt && typeof serialized.createdAt.toDate === 'function') {
    serialized.createdAt = serialized.createdAt.toDate().toISOString();
  }
  
  return serialized;
};

const CollectionPage = ({ initialProducts, collection }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2410]);
  const [activeAccordion, setActiveAccordion] = useState('price');
  const [sortOption, setSortOption] = useState('price-low');
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Serialize the collection data to handle any Firestore timestamps
  const serializedCollection = useMemo(() => {
    return serializeData(collection);
  }, [collection]);

  // Load all products data on component mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        if (serializedCollection?.products?.length) {
          const productsPromises = serializedCollection.products.map(async (productId) => {
            const product = await getProduct({ id: productId });
            // Serialize the product data to handle Firestore timestamps
            return serializeData(product);
          });
          
          const productsData = await Promise.all(productsPromises);
          setLoadedProducts(productsData.filter(product => product !== null));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [serializedCollection]);

  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = loadedProducts.filter(product => 
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
  }, [loadedProducts, priceRange, sortOption]);

  return (
    <div className="w-full ">
  <div className="relative  mb-8">
    <div className="w-full h-56 md:h-80 rounded-md overflow-hidden relative">
      {serializedCollection?.imageURL ? (
        <img 
          src={serializedCollection.imageURL} 
          alt={serializedCollection.title || "Collection banner"} 
          className="w-full h-full rounded-md overflow-hidden object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-purple-100 to-purple-200" />
      )}
      
      {/* Overlay with text */}
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-semibold font-heading text-white text-4xl mb-2 drop-shadow-md">
            {serializedCollection?.title}
          </h1>
          {serializedCollection?.subTitle && (
            <p className="font-body text-white text-lg max-w-2xl mx-auto drop-shadow">
              {serializedCollection?.subTitle}
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
  
      
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
          {loading ? (
            <div className="text-center py-10">Loading products...</div>
          ) : (
            <>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-10">No products match your filters</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard product={product} key={product.id} />
                  ))}
                </div>
              )}
            </>
          )}
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

export default CollectionPage;