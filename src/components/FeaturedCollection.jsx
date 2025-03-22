import React from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";

function FeaturedCollection({ featuredProducts }) {
  // Handle case when featuredProducts is null, undefined, or not an array
  const products = Array.isArray(featuredProducts) ? featuredProducts : [];

  return (
    <div className="bg-gray-100 px-[10px] md:px-[30px] py-10">
      <h2 className="text-2xl font-medium font-heading text-center text-gray-800">
        Featured Products
      </h2>

      {/* Show "View All" button only if there are more than 10 products */}
      {products.length > 10 && (
        <div className="mt-4 text-center">
          <Link href="/featured-collection-page">
            <button className="text-purple-500 font-body px-6 rounded-lg hover:text-purple-600 transition">
              View All
            </button>
          </Link>
        </div>
      )}

      {/* Horizontal scrollable grid with fixed card width */}
      <div className="grid grid-flow-col auto-cols-[160px] md:auto-cols-[240px] gap-1 md:gap-4 overflow-x-auto no-scrollbar py-10 px-1">
        {products.length > 0 ? (
          products.slice(0, 10).map((product, index) => (
            <div key={product.id || index} className="h-full">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No Featured Products available.</p>
        )}
      </div>
    </div>
  );
}

export default FeaturedCollection;