"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import ListedProducts from '@/components/ListedProducts';

const CategoryPage = () => {
  const params = useParams();
  const category = params.category;

  return (
    <div>
      <h1 className="text-2xl text-center bg-gray-50 font-heading font-medium  text-gray-800 max-w-7xl mx-auto px-[10px] md:px-[30px] py-4">
        {category.charAt(0).toUpperCase() + category.slice(1)} Collection
      </h1>
      <ListedProducts category={category} />
    </div>
  );
};

export default CategoryPage;