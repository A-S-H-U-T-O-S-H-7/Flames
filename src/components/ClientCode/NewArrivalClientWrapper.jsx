"use client";

import React from "react";
import NewArrivalSection from "@/components/NewArrivalSection";
import { useNewArrivalProducts } from "@/lib/firestore/products/read";
export default function NewArrivalClientWrapper() {
    const { data: newArrivalProducts, isLoading: loadingNewArrivals, error: errorNewArrivals } = useNewArrivalProducts();
  
    if ( loadingNewArrivals) return <div className="flex bg-white overflow-x-auto space-x-2 md:space-x-6 no-scrollbar py-10">
    {Array(5).fill().map((_, index) => (
      <div key={index} className="w-[150px] sm:w-[200px] md:w-[250px] h-[300px] bg-gray-200 animate-pulse rounded-lg"></div>
    ))}
  </div>
    if ( errorNewArrivals) return <div>Error loading products.</div>;
  
    return (
      <>
        <NewArrivalSection newArrivalProducts={newArrivalProducts} />
      </>
    );
  }
  