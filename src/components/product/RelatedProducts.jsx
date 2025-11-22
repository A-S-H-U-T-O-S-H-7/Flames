'use client';

import React from 'react';
import { useProductsByCategory } from "@/lib/firestore/products/read";
import ProductCard from './ProductCard';

const RelatedProducts = ({ categoryId }) => {
  const { data: products, isLoading, error } = useProductsByCategory({ categoryId });

  if (error) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-red-500">Error loading related products</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-8 h-8 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="py-10 mx-auto">
      <h2 className="font-heading text-2xl md:text-3xl text-purple-500 font-bold text-center mb-8">
        Related Products
      </h2>
      
      {/* Fixed grid layout instead of flex overflow */}
      <div className="grid grid-flow-col auto-cols-[180px] md:auto-cols-[240px] gap-3 overflow-x-auto no-scrollbar py-10 px-1">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
                ))
              ) : (
                <p className="text-center text-gray-600 col-span-full">No Related products available.</p>
              )}
            </div>
      
    </section>
  );
};

export default RelatedProducts;