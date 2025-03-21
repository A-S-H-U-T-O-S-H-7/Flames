"use client"
import React from 'react';
import { X } from 'lucide-react';

const SortMenu = ({ showSort, setShowSort }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSort(false);
    }
  };

  return (
    <>
      {showSort && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleOverlayClick}
        />
      )}
      <div className={`
        fixed inset-y-0 right-0 w-[85%] sm:w-[400px] bg-white shadow-2xl z-50 transition-transform duration-300
        ${showSort ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex justify-between items-center p-4 border-b bg-purple-50">
          <h2 className="text-xl font-semibold font-body text-purple-900">Sort By</h2>
          <button 
            onClick={() => setShowSort(false)}
            className="p-2 hover:bg-purple-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-purple-700" />
          </button>
        </div>
        <div className="p-4">
          {[
            'salePrice: Low to High',
            'salePrice: High to Low',
            'Newest First',
            'Popular'
          ].map((option) => (
            <button
              key={option}
              className="w-full text-left px-4 font-body py-3 hover:bg-purple-300 rounded-lg transition-colors"
              onClick={() => setShowSort(false)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default SortMenu;