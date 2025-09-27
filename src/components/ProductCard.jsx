import Link from "next/link";
import AddToCartButton from "./AddtoCartButton";
import FavoriteButton from "./FavoriteButton";
import AuthContextProvider from "@/context/AuthContext";
import Image from 'next/image';

const ProductCard = ({ product, isFavoritesPage = false }) => {
  const discount = product ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;


  return (
    <div className="w-full h-full relative">
      <div 
        className="group w-full bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md cursor-pointer h-full"
        style={{
          minWidth: '160px',
          maxWidth: '100%',
          boxShadow: '0 1px 2px 0 rgba(124, 58, 237, 0.1)'
        }}
      >
        {/* Product Image Section */}
        <div className="relative w-full h-[140px] sm:h-[160px] md:h-[200px] lg:h-[220px] overflow-hidden">
  {/* Link for Product Image - redirects to details page */}
  <Link href={`/product-details/${product?.id}`} className="absolute inset-0 w-full h-full">
    <Image
      src={product?.featureImageURL}
      alt={product?.title}
      className="w-full h-full object-cover"
      layout="fill" // Ensures the image fills the container
      priority // Prioritizes this image for quicker loading
      decoding="async" // Async decoding
      sizes="(max-width: 768px) 100vw, 50vw" // Responsive sizes
    />
  </Link>
  
  {/* Favorite Button */}
  <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
    <AuthContextProvider>
      <FavoriteButton productId={product?.id} />
    </AuthContextProvider>
  </div>
</div>
        
        {/* Product Info */}
        <Link href={`/product-details/${product?.id}`} className="block">
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
              <span className="text-sm font-bold text-purple-600">₹{product?.salePrice}</span>
              <span className="text-xs text-gray-500 line-through">₹{product?.price}</span>
              {discount > 0 && (
                <span className="bg-green-100 text-green-700 text-[7px] md:text-xs  px-2 py-1 rounded-full font-medium">
                  {discount}% off
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Add to Cart Button - Only visible on favorites page */}
      {isFavoritesPage && (
        <div 
          className="absolute bottom-3 right-3 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <AuthContextProvider>
            <AddToCartButton 
              productId={product?.id} 
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-md"
            />
          </AuthContextProvider>
        </div>
      )}
    </div>
  );
};

export default ProductCard;