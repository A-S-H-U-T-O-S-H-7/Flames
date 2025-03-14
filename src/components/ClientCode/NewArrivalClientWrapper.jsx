"use client";

import React from "react";
import NewArrivalSection from "@/components/NewArrivalSection";
import { useNewArrivalProducts } from "@/lib/firestore/products/read";
export default function NewArrivalClientWrapper() {
    const { data: newArrivalProducts, isLoading: loadingNewArrivals, error: errorNewArrivals } = useNewArrivalProducts();
  
    if ( loadingNewArrivals) return <div>Loading products...</div>;
    if ( errorNewArrivals) return <div>Error loading products.</div>;
  
    return (
      <>
        <NewArrivalSection newArrivalProducts={newArrivalProducts} />
      </>
    );
  }
  