'use client'

import { useFeaturedProducts } from '@/lib/firestore/products/read';
import FeaturedCollectionPage from '@/components/FeaturedCollectionPage';
import { Loader2 } from "lucide-react";

export default function Page() {
  const { data: featuredProducts, isLoading, error } = useFeaturedProducts();
  
  if (isLoading) {
    return (
      <div className="flex bg-gray-100 min-h-screen justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-800 text-lg">Loading featured products...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>Error loading products. Please try again later.</p>
      </div>
    );
  }
  
  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p>No featured products found.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-100">
      <FeaturedCollectionPage products={featuredProducts} />
    </div>
  );
}