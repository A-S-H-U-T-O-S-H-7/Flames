// ProductCardImage.jsx - Client Component
"use client"

import { useState } from "react";
import FavoriteButton from "./FavoriteButton";
import AuthContextProvider from "@/context/AuthContext";

const ProductCardImage = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get the main image and a secondary image for hover effect
  const mainImage = product?.featureImageURL;
  const hoverImage = product?.imageList && product?.imageList.length > 1 
    ? product?.imageList[1]  // Use second image in list if available
    : mainImage;             // Fallback to main image

  return (
    <div 
      className="relative w-full h-[140px] sm:h-[160px] md:h-[200px] lg:h-[220px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`w-full h-full transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-100'} absolute top-0 left-0`}>
        <img
          src={mainImage}
          alt={product?.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className={`w-full h-full transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0`}>
        <img
          src={hoverImage}
          alt={`${product?.title} - alternate view`}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Favorite Button */}
      <div 
        className="absolute top-2 right-1 z-10"
        onClick={(e) => {
          // Stop propagation to prevent card click
          e.stopPropagation();
        }}
      >
        <AuthContextProvider>
          <FavoriteButton productId={product?.id} />
        </AuthContextProvider>
      </div>
    </div>
  );
};

export default ProductCardImage;