'use client'

import { useNewArrivalProducts } from "@/lib/firestore/products/read";
import NewArrivalCollectionPage from '@/components/NewArrivalCollectionPage';
import { Loader2 } from "lucide-react";

export default function page() {
  const { data: newArrivalProducts, isLoading: loadingNewArrivals, error: errorNewArrivals } = useNewArrivalProducts();
  
  if (loadingNewArrivals) {
    return (
      <div className="flex bg-gray-100 min-h-screen justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-800 text-lg">Loading new arrivals...</span>
      </div>
    );
  }
  
  if (errorNewArrivals) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>Error loading products. Please try again later.</p>
      </div>
    );
  }
  
  if (!newArrivalProducts || newArrivalProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p>No new arrivals found.</p>
      </div>
    );
  }

  return <div className="bg-gray-100"> <NewArrivalCollectionPage products={newArrivalProducts} /></div>;
}