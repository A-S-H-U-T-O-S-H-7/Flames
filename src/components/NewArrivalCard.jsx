import React from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import Link from "next/link";

function NewArrivalCard({ image, title, price, strikePrice }) {
  return (
    <Link href="/product-details">
    <div className="bg-gradient-to-br  from-indigo-50 to-purple-50 shadow-xl rounded-2xl border border-gray-200 overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Wishlist Button */}
      <div className="absolute top-3 right-3 z-10">
        <button
          className="p-2 rounded-full bg-white shadow-md hover:shadow-lg text-purple-500 hover:text-red-500 transition"
          aria-label="Add to Wishlist"
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Image Section */}
      <div className="relative h-48">
        <Image
          src={image}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-2xl"
        />
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>

        {/* Price Section */}
        <div className="flex items-center justify-between">
          <span className="text-purple-700 font-bold text-xl">₹{price}</span>
          <span className="text-gray-500 line-through text-sm">
            ₹{strikePrice}
          </span>
        </div>

      </div>
    </div>
    </Link>
  );
}

export default NewArrivalCard;
