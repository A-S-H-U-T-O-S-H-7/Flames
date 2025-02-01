"use client";
import React, { useState } from "react";
import { Heart, ShoppingCart, Minus, Plus, Star } from "lucide-react";

const ProductDetails = () => {
  const [selectedImage, setSelectedImage] = useState("/demo3.jpeg");
  const [quantity, setQuantity] = useState(1);

  const images = [
    "/demo3.jpeg",
    "/demo4.jpeg",
    "/demo5.jpeg",
    "/demo6.jpeg",
  ];

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen  bg-gray-50 flex items-center justify-center py-4 px-[10px] md:px-[30px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative group">
              <img
                src={selectedImage}
                alt="Product"
                className="w-full h-[320px] md:h-[400px] object-cover rounded-lg"
              />
              <button className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="flex gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-1 h-24 ${
                    selectedImage === img
                      ? "ring-2 ring-purple-500"
                      : ""
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-xl md:text-2xl font-heading font-semibold text-gray-900 mb-2">
                Fancy Silver Plated Earrings
              </h1>

              {/* Review Section */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${
                        index < 4
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-body text-gray-600">4.0</span>
                  <span className="mx-2 font-body text-gray-400">|</span>
                  <span className="text-gray-600 font-body">128 Reviews</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className=" text-lg md:text-xl font-heading font-bold text-purple-500">
                  ₹ 940
                </span>
                <span className="text-sm font-body text-gray-500 line-through">
                  ₹ 1,200
                </span>
                <span className="text-sm font-body text-pink-500 font-medium">
                  22% OFF
                </span>
              </div>
            </div>

            <div>
              <span className="inline-block font-body px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                12 sold in last 15 hours
              </span>
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 font-body">
                These elegant silver-plated earrings feature a unique design
                that combines traditional craftsmanship with modern
                aesthetics. Perfect for both casual and formal occasions.
              </p>
              <div className="mt-4 grid grid-cols-2 text-center gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-body text-gray-600">
                    • Premium silver plating
                  </p>
                  <p className="text-sm font-body text-gray-600">
                    • Hypoallergenic materials
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-body text-gray-600">
                    • Suitable for sensitive ears
                  </p>
                  <p className="text-sm font-body text-gray-600">
                    • Luxury gift box included
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-body font-medium">Quantity:</span>
              <div className="flex items-center border-2 border-gray-300 rounded-lg bg-white">
                <button
                  onClick={decrementQuantity}
                  className="px-4 py-2 border-r border-gray-300 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="w-16 text-center font-body font-semibold text-lg text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="px-4 py-2 border-l border-gray-300 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="mt-5 w-full flex font-body gap-2 justify-center bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-lg hover:opacity-90 shadow-lg transform hover:-translate-y-1 transition">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="mt-5 w-full font-body bg-gradient-to-r from-pink-500 to-pink-700 text-white py-2 px-4 rounded-lg hover:opacity-90 shadow-lg transform hover:-translate-y-1 transition">
                Buy Now
              </button>
            </div>

            {/* Delivery Info */}
            <div className="space-y-3 py-4 border-t">
              <div className="flex items-center gap-2">
                <span className="w-48 font-body text-sm md:text-base text-gray-500">
                  Estimated Delivery
                </span>
                <span className="font-medium font-body text-sm md:text-base text-gray-900">
                  4 - 5 days
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-48 text-sm md:text-base text-gray-500">Shipping</span>
                <span className="font-medium  font-body text-sm md:text-base text-green-600">
                  Free Shipping
                </span>
              </div>
              <div className="flex text-sm md:text-base items-center gap-2">
                <span className="w-48  font-body text-gray-500">Return Policy</span>
                <span className="font-medium   font-body text-gray-900">
                  7 Days Return
                </span>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ProductDetails;
