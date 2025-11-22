"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useBrands } from "@/lib/firestore/brands/read";
import { useCategories } from "@/lib/firestore/categories/read";
import { db } from "@/lib/firestore/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { usePermissions } from '@/context/PermissionContext';
import { getSellerIdFromAdmin } from '@/lib/permissions/sellerPermissions';

export default function ProductSearchFilter({ onSearch, onFilter }) {
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();
  const { adminData } = usePermissions();
  const [sellers, setSellers] = useState([]);
  const isAdmin = !getSellerIdFromAdmin(adminData);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    featured: "",
    newArrival: "",
    categoryId: "",
    brandId: "",
    color: "",
    occasion: "",
    sellerId: "", // Add seller filter
    priceRange: { min: "", max: "" },
    stock: { min: "", max: "" }
  });
  
  // Fetch sellers list for admin
  useEffect(() => {
    const fetchSellers = async () => {
      if (isAdmin) {
        try {
          const sellersQuery = query(collection(db, 'sellers'), where('status', '==', 'approved'));
          const sellersSnapshot = await getDocs(sellersQuery);
          const sellersData = sellersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setSellers(sellersData);
        } catch (error) {
          console.error('Error fetching sellers:', error);
        }
      }
    };
    fetchSellers();
  }, [isAdmin]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    let newFilters;
    
    if (key.includes('.')) {
      const [mainKey, subKey] = key.split('.');
      newFilters = {
        ...filters,
        [mainKey]: {
          ...filters[mainKey],
          [subKey]: value
        }
      };
    } else {
      newFilters = { ...filters, [key]: value };
    }
    
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      status: "",
      featured: "",
      newArrival: "",
      categoryId: "",
      brandId: "",
      color: "",
      occasion: "",
      sellerId: "",
      priceRange: { min: "", max: "" },
      stock: { min: "", max: "" }
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 bg-white dark:bg-[#0e1726] rounded-xl p-4 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm transition-all duration-200"
    >
      <div className="flex justify-between flex-col sm:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative max-w-[400px] flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search products by name..."
            className="block w-full pl-10 pr-3 py-2 border border-purple-500/50 dark:border-[#22c7d5]/50 rounded-lg bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#22c7d5] focus:ring-1 focus:ring-[#22c7d5] transition-all duration-200"
          />
        </div>
        
        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-[#22c7d5] hover:from-[#22c7d5] hover:to-purple-500 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>
      
      {/* Filters Panel */}
      {showFilters && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Advanced Filters</h3>
            <button 
              onClick={clearFilters}
              className="text-sm text-[#22c7d5] hover:text-purple-500 flex items-center gap-1 transition-colors duration-200"
            >
              <X className="h-4 w-4" /> Clear all
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500 dark:text-gray-400">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="block w-full px-3 py-2 border border-purple-500/50 dark:border-[#22c7d5]/50 rounded-lg bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#22c7d5] transition-all duration-200"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>
            
            {/* Featured Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500 dark:text-gray-400">Featured</label>
              <select
                value={filters.featured}
                onChange={(e) => handleFilterChange("featured", e.target.value)}
                className="block w-full px-3 py-2 border border-purple-500/50 dark:border-[#22c7d5]/50 rounded-lg bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#22c7d5] transition-all duration-200"
              >
                <option value="">All Products</option>
                <option value="featured">Featured Only</option>
                <option value="notFeatured">Non-Featured Only</option>
              </select>
            </div>
            
            {/* New Arrival Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500 dark:text-gray-400">New Arrival</label>
              <select
                value={filters.newArrival}
                onChange={(e) => handleFilterChange("newArrival", e.target.value)}
                className="block w-full px-3 py-2 border border-purple-500/50 dark:border-[#22c7d5]/50 rounded-lg bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#22c7d5] transition-all duration-200"
              >
                <option value="">All Products</option>
                <option value="newArrival">New Arrivals Only</option>
                <option value="notNewArrival">Standard Products Only</option>
              </select>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500 dark:text-gray-400">Category</label>
              <select
                value={filters.categoryId}
                onChange={(e) => handleFilterChange("categoryId", e.target.value)}
                className="block w-full px-3 py-2 border border-purple-500/50 dark:border-[#22c7d5]/50 rounded-lg bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#22c7d5] transition-all duration-200"
              >
                <option value="">All Categories</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Brand Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500 dark:text-gray-400">Brand</label>
              <select
                value={filters.brandId}
                onChange={(e) => handleFilterChange("brandId", e.target.value)}
                className="block w-full px-3 py-2 border border-purple-500/50 dark:border-[#22c7d5]/50 rounded-lg bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#22c7d5] transition-all duration-200"
              >
                <option value="">All Brands</option>
                {brands?.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Seller Filter - Only for Admin */}
            {isAdmin && (
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Users className="h-4 w-4" /> Seller
                </label>
                <select
                  value={filters.sellerId}
                  onChange={(e) => handleFilterChange("sellerId", e.target.value)}
                  className="block w-full px-3 py-2 border border-purple-500/50 dark:border-[#22c7d5]/50 rounded-lg bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#22c7d5] transition-all duration-200"
                >
                  <option value="">All Sellers</option>
                  {sellers?.map((seller) => (
                    <option key={seller.id} value={seller.id}>
                      {seller.businessName || seller.email || `Seller ${seller.id.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Color Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500 dark:text-gray-400">Color</label>
              <select
                value={filters.color}
                onChange={(e) => handleFilterChange("color", e.target.value)}
                className="block w-full px-3 py-2 border border-purple-500/50 dark:border-[#22c7d5]/50 rounded-lg bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#22c7d5] transition-all duration-200"
              >
                <option value="">All Colors</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="rose-gold">Rose Gold</option>
                <option value="white">White</option>
                <option value="pink">Pink</option>
                <option value="purple">Purple</option>
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
                <option value="black">Black</option>
                <option value="multi">Multi-color</option>
              </select>
            </div>
            
            {/* Occasion Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500 dark:text-gray-400">Occasion</label>
              <select
                value={filters.occasion}
                onChange={(e) => handleFilterChange("occasion", e.target.value)}
                className="block w-full px-3 py-2 border border-purple-500/50 dark:border-[#22c7d5]/50 rounded-lg bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#22c7d5] transition-all duration-200"
              >
                <option value="">All Occasions</option>
                <option value="daily-wear">Daily Wear</option>
                <option value="casual-wear">Casual Wear</option>
                <option value="formal-wear">Formal Wear</option>
                <option value="office-wear">Office Wear</option>
                <option value="party-wear">Party Wear</option>
                <option value="wedding">Wedding</option>
                <option value="festive">Festive</option>
                <option value="gift">Gift</option>
              </select>
            </div>
            
            {/* Price Range Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500 dark:text-gray-400">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) => handleFilterChange("priceRange.min", e.target.value)}
                  className="block w-full px-3 py-2 border border-purple-500/50 dark:border-[#22c7d5]/50 rounded-lg bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#22c7d5] transition-all duration-200"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChange={(e) => handleFilterChange("priceRange.max", e.target.value)}
                  className="block w-full px-3 py-2 border border-purple-500/50 dark:border-[#22c7d5]/50 rounded-lg bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#22c7d5] transition-all duration-200"
                />
              </div>
            </div>
            
            {/* Stock Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500 dark:text-gray-400">Stock</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.stock.min}
                  onChange={(e) => handleFilterChange("stock.min", e.target.value)}
                  className="block w-full px-3 py-2 border border-purple-500/50 dark:border-[#22c7d5]/50 rounded-lg bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#22c7d5] transition-all duration-200"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.stock.max}
                  onChange={(e) => handleFilterChange("stock.max", e.target.value)}
                  className="block w-full px-3 py-2 border border-purple-500/50 dark:border-[#22c7d5]/50 rounded-lg bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#22c7d5] transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}