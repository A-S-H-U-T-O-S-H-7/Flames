"use client";

import React from "react";
import FeaturedCollection from "@/components/FeaturedCollection";
import { useFeaturedProducts } from "@/lib/firestore/products/read";

export default function FeaturedClientWrapper() {
  const { data: featuredProducts, isLoading: loadingFeatured, error: errorFeatured } = useFeaturedProducts();

  if (loadingFeatured ) return <div>Loading products...</div>;
  if (errorFeatured ) return <div>Error loading products.</div>;

  return (
    <>
      <FeaturedCollection featuredProducts={featuredProducts} />
    </>
  );
}
