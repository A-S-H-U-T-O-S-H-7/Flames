"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Heart } from 'lucide-react';

const Gift = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const giftItems = [
    {
      id: 1,
      name: "Luxury Watch",
      price: "$199.99",
      image: "/api/placeholder/300/300",
      category: "Accessories"
    },
    {
      id: 2,
      name: "Perfume Set",
      price: "$89.99",
      image: "/api/placeholder/300/300",
      category: "Beauty"
    },
    {
      id: 3,
      name: "Premium Headphones",
      price: "$159.99",
      image: "/api/placeholder/300/300",
      category: "Electronics"
    },
    {
      id: 4,
      name: "Leather Wallet",
      price: "$49.99",
      image: "/api/placeholder/300/300",
      category: "Accessories"
    }
  ];

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemAnimation = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Perfect Gifts
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Find the perfect gift for your loved ones
        </p>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search gifts..."
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
          
          <select className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Categories</option>
            <option value="accessories">Accessories</option>
            <option value="beauty">Beauty</option>
            <option value="electronics">Electronics</option>
          </select>
        </div>
      </div>

      {/* Gift Grid */}
      <motion.div 
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerAnimation}
        initial="hidden"
        animate="show"
      >
        {giftItems.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
            variants={itemAnimation}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-64 object-cover"
              />
              {hoveredItem === item.id && (
                <motion.div 
                  className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                    <ShoppingCart size={20} />
                  </button>
                  <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                    <Heart size={20} />
                  </button>
                </motion.div>
              )}
              <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                {item.category}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
              <p className="text-blue-600 font-bold">{item.price}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Gift;