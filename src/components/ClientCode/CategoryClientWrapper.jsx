// components/CategoryClientWrapper.jsx
"use client";

import React from 'react'
import CategoryCard from '../web/home/CategoryCard';
import { useCategories } from '@/lib/firestore/categories/read'

export default function CategoryClientWrapper() {
  const { data: categories, isLoading, error } = useCategories({ pageLimit: 10 });
  
  if (isLoading) return  <div className="flex bg-white gap-3 md:gap-6 py-4 overflow-x-auto no-scrollbar">
  {Array(5).fill().map((_, index) => (
    <div key={index} className="flex flex-col items-center">
      <div className="w-[80px] h-[85px] sm:w-[120px] sm:h-[120px] md:w-[130px] md:h-[130px] 
                      rounded-lg bg-gray-200 animate-pulse flex-shrink-0 mb-1 md:mb-3">
      </div>
      <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
    </div>
  ))}
</div>
  if (error) return <div>Error loading categories: {error}</div>;

  return <CategoryCard categories={categories} />;
}