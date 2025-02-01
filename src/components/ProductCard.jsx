// components/ProductCard.js
import React from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import Link from "next/link";

function ProductCard({ product }) {
  const { image, name, price, originalPrice, isNew } = product;

  return (
    <Link href="/product-details">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl rounded-lg border border-gray-200 overflow-hidden  hover:shadow-2xl relative">
        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            className="p-1 md:p-2 rounded-full bg-white shadow-md hover:shadow-lg text-purple-500 hover:text-red-500 transition"
            aria-label="Add to Wishlist"
          >
            <Heart className="w-4 md:w-5 h-4 md:h-5" />
          </button>
        </div>

        {/* New Badge */}
        {isNew && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-purple-600 font-body text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
              New
            </span>
          </div>
        )}

        {/* Image Section */}
        <div className="relative h-48">
          <Image
            src={image}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>

        {/* Content Section */}
        <div className="p-2 md:p-5">
          <h3 className=" text-sm md:text-base font-body  text-gray-800 mb-3 line-clamp-2">
            {name}
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-purple-700 font-body font-medium text-base md:text-xl">₹{price}</span>
            {originalPrice && (
              <span className="text-gray-500 font-body line-through text-base md:text-sm">
                ₹{originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;