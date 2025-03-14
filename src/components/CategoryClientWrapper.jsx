// components/CategoryClientWrapper.jsx
"use client";

import React from 'react'
import Category from '@/components/CategoryCard'
import { useCategories } from '@/lib/firestore/categories/read'

export default function CategoryClientWrapper() {
  const { data: categories, isLoading, error } = useCategories({ pageLimit: 10 });
  
  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories: {error}</div>;
  
  return <Category categories={categories} />;
}