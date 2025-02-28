'use client';

import React from 'react';
import { getProductsByCategory } from "@/lib/firestore/products/read_server";
import ProductCard from "../ProductCard";

const RelatedProducts = ({ categoryId }) => {
  const [products, setProducts] = React.useState(null);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProductsByCategory({ categoryId });
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (!products) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-8 h-8 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="py-10  max-w-[1200px] mx-auto">
      <h2 className="font-heading text-2xl md:text-3xl text-purple-500 font-bold text-center mb-8">
        Related Products
      </h2>
      
      <div className="flex py-5 overflow-x-auto space-x-2 md:space-x-6 no-scrollbar">
      {products.length > 0 ? (
          products.slice(0, 10).map((product) => (
            <div 
              key={product.id} 
              className="flex-none transition-shadow hover:shadow-lg"
            >
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 w-full">No related products available.</p>
        )}
      </div>
      
    </section>
  );
};

export default RelatedProducts;