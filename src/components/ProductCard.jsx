import { useState } from "react";
import AuthContextProvider from "@/context/AuthContext";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get the main image and a secondary image for hover effect
  const mainImage = product?.featureImageURL;
  const hoverImage = product?.imageList && product?.imageList.length > 1 
    ? product?.imageList[1]  // Use second image in list if available
    : mainImage;             // Fallback to main image
  
  
  
  
  
  return (
    <div 
      className="flex-shrink-0 w-[48%] sm:w-[140px] md:w-[180px] lg:w-[240px] bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-500 cursor-pointer"
      
      style={{
        boxShadow: '0 1px 2px 0 rgba(124, 58, 237, 0.1)'
      }}
    >
      {/* Product Image with Favorite Button */}
      <div 
        className="relative w-full h-[140px] sm:h-[160px] md:h-[200px] lg:h-[220px] overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={mainImage}
          alt={product?.title}
          className={`w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-100'} absolute top-0 left-0`}
        />
        <img
          src={hoverImage}
          alt={`${product?.title} - alternate view`}
          className={`w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0`}
        />
        
        {/* Favorite Button */}
        <div 
          className="absolute top-3 right-3 z-10"
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
      
      {/* Product Info */}
      <Link href={`/product-details/${product?.id}`} passHref>
      <div className="px-4 py-2 space-y-2">
        {/* Title */}
        <h2 className="text-xs sm:text-base md:text-sm font-body font-medium text-gray-800 truncate">
          {product?.title}
        </h2>
        
        {/* Short Description - Show on all screen sizes */}
        <p className="text-[10px] sm:text-xs text-gray-600 font-body line-clamp-2">
          {product?.shortDescription}
        </p>
        
        {/* Price Section */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-base sm:text-lg md:text-xl font-bold text-purple-600">₹{product?.salePrice}</span>
          <span className="text-xs sm:text-sm text-gray-500 line-through">₹{product?.price}</span>
        </div>
      </div>
      </Link>

    </div>
  );
};

export default ProductCard;