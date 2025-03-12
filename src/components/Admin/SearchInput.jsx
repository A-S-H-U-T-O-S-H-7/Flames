"use client";

import { Search } from "lucide-react";

export default function SearchInput({ 
  value, 
  onChange, 
  placeholder = "Search...",
  className = ""
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#283548] text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#22c7d5] shadow-sm"
      />
      <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={18} />
    </div>
  );
}
