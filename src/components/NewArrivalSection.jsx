import React from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";

function NewArrivalSection({ newArrivalProducts }) {
  return (
    <div className="bg-gray-100 px-[10px] md:px-[30px] py-10">
      <h2 className="text-2xl font-medium font-heading text-center text-gray-800">
        New Arrivals
      </h2>

      {/* Show "View All" button only if there are more than 10 products */}
      {newArrivalProducts.length > 10 && (
        <div className="mt-4 text-center">
          <Link href="/new-arrival-collection">
            <button className="text-purple-500 font-body px-6 rounded-lg hover:text-purple-600 transition">
              View All
            </button>
          </Link>
        </div>
      )}

      {/* Fixed grid layout instead of flex overflow */}
      <div className="flex overflow-x-auto space-x-2 md:space-x-6 no-scrollbar py-10">
        {newArrivalProducts.length > 0 ? (
          newArrivalProducts.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No new arrivals available.</p>
        )}
      </div>
    </div>
  );
}

export default NewArrivalSection;
