"use client"
import React from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SortMenu = ({ showSort, setShowSort, sortOption, setSortOption }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSort(false);
    }
  };

  const defaultSort = 'price-low';
  
  const sortOptions = [
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'newest', label: 'Newest First' }
  ];

  const handleSortChange = (option) => {
    setSortOption(option);
    // Close the menu after a slight delay for better UX
    setTimeout(() => setShowSort(false), 300);
  };

  // Reset sort to default
  const handleResetSort = () => {
    setSortOption(defaultSort);
    setTimeout(() => setShowSort(false), 300);
  };

  // Check if current sort is not the default
  const isSortCustom = sortOption !== defaultSort;

  return (
    <AnimatePresence>
      {showSort && (
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
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-h-[80vh] w-full bg-white rounded-t-2xl shadow-2xl z-50"
          >
            <div className="flex justify-between items-center p-4 border-b border-purple-100">
              <h2 className="text-xl font-semibold font-body text-purple-900">Sort By</h2>
              <button 
                onClick={() => setShowSort(false)}
                className="p-2 hover:bg-purple-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-purple-700" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-60px)]">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  className="w-full flex justify-between items-center py-4 px-3 border-b border-purple-50 last:border-0 hover:bg-purple-50 transition-colors"
                  onClick={() => handleSortChange(option.id)}
                >
                  <span className="text-gray-800 font-body text-lg">{option.label}</span>
                  {sortOption === option.id && (
                    <Check className="w-5 h-5 text-purple-600" />
                  )}
                </button>
              ))}
            </div>
            
            {/* Added Reset/Clear button */}
            {isSortCustom && (
              <div className="p-4 border-t border-purple-50">
                <button 
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  onClick={handleResetSort}
                >
                  Reset to Default Sort
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SortMenu;