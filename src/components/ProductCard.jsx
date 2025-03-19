// ProductCard.jsx - Server Component
import Link from "next/link";
import ProductCardImage from "./ProductCardImage";

const ProductCard = ({ product }) => {
  return (
    <div 
      className="flex-shrink-0 w-[48%] sm:w-[140px] md:w-[180px] lg:w-[240px] bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-500 cursor-pointer"
      style={{
        boxShadow: '0 1px 2px 0 rgba(124, 58, 237, 0.1)'
      }}
    >
      {/* Interactive Image Component */}
      <ProductCardImage product={product} />
      
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