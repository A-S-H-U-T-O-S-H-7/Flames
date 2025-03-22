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
      className="relative w-full h-[140px] sm:h-[160px] md:h-[200px] lg:h-[220px] overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <div 
        className="absolute inset-0 w-full h-full transform transition-all duration-1000 ease-in-out"
        style={{
          opacity: isHovered ? 0 : 1,
          transform: isHovered ? "scale(1.05)" : "scale(1)",
        }}
      >
        <img
          src={mainImage}
          alt={product?.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Hover Image with Slower Crossfade and Scale Effect */}
      <div 
        className="absolute inset-0 w-full h-full transform transition-all duration-1000 ease-in-out"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "scale(1)" : "scale(1.1)",
        }}
      >
        <img
          src={hoverImage}
          alt={`${product?.title} - alternate view`}
          className="w-full h-full object-cover"
          loading="eager" // Ensure the hover image is preloaded
        />
      </div>
      
      {/* Subtle Overlay that appears on hover */}
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-1000 ease-in-out pointer-events-none"
        style={{ 
          opacity: isHovered ? 0.05 : 0 
        }}
      />
      
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