import React from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import Link from "next/link";

function FeaturedCollectionCard({ image, title, price, strikePrice }) {
  return (
    <Link href="/product-details">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl relative">
        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg text-purple-500 hover:text-red-500 transition flex items-center justify-center"
            aria-label="Add to Wishlist"
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Image Section */}
        <div className="relative h-44">
          <Image
            src={image}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-2xl"
          />
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-base font-heading  text-gray-800 mb-2">{title}</h3>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <span className="text-purple-700 font-body font-medium text-[15px]">₹{price}</span>
            <span className="text-gray-500 font-body line-through text-sm">₹{strikePrice}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default FeaturedCollectionCard;
