import React from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";

function FeaturedCollection({ featuredProducts }) {
  return (
    <div className="bg-gray-100 px-[5px] md:px-[30px]">
      <h2 className="text-2xl font-medium font-heading text-center text-gray-800 pt-8 mb-2">
        Featured Products
      </h2>

      {/* Show "View All" button only if there are more than 10 products */}
      {featuredProducts.length > 10 && (
        <Link href="/featured-collection">
          <div className="mt-4 text-center">
            <button className="text-purple-500 font-body px-6 rounded-lg hover:text-purple-600 transition">
              View All
            </button>
          </div>
        </Link>
      )}

      <div className="flex overflow-x-auto space-x-2 md:space-x-6 no-scrollbar py-10">
        {featuredProducts.length > 0 ? (
          featuredProducts.slice(0, 10).map((product) => ( 
              <ProductCard product={product} key={product?.id} />
          ))
        ) : (
          <p className="text-center text-gray-600 w-full">No Featured Products available.</p>
        )}
      </div>
    </div>
  );
}

export default FeaturedCollection;
