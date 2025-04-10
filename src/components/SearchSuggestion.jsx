"use client"

import React from 'react';
import { useRouter } from 'next/navigation';

const SearchSuggestions = ({ suggestions, searchQuery, setSearchQuery, setShowSuggestions }) => {
  const router = useRouter();
  
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };
  
  return (
    <div className="absolute top-full left-0 w-full bg-white border border-purple-200 rounded-md shadow-lg mt-1 z-50">
      {suggestions.map((suggestion, index) => (
        <div 
          key={index} 
          className="px-4 py-2 text-sm hover:bg-purple-50 cursor-pointer text-gray-800"
          onClick={() => handleSuggestionClick(suggestion)}
        >
          {suggestion}
        </div>
      ))}
    </div>
  );
};

export default SearchSuggestions;