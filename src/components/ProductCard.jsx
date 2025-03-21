// ProductCard.jsx
import Link from "next/link";
import ProductCardImage from "./ProductCardImage";

const ProductCard = ({ product }) => {
  return (
    <div 
      className="group w-full bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md"
      style={{
        minWidth: '170px',
        maxWidth: '100%',
        height: '100%',
        boxShadow: '0 1px 2px 0 rgba(124, 58, 237, 0.1)'
      }}
    >
      {/* Interactive Image Component */}
      <div className="aspect-[4/3] w-full relative">
        <ProductCardImage product={product} />
      </div>
      
      {/* Product Info */}
      <Link href={`/product-details/${product?.id}`} passHref>
        <div className="px-3 py-3 space-y-2">
          {/* Title */}
          <h2 className="text-base font-medium text-gray-900 line-clamp-1">
            {product?.title}
          </h2>
          
          {/* Short Description */}
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
            {product?.shortDescription}
          </p>
          
          {/* Price Section */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-base font-bold text-purple-600">₹{product?.salePrice}</span>
            <span className="text-xs text-gray-500 line-through">₹{product?.price}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;