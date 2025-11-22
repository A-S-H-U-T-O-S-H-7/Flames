import Link from "next/link";
import AddToCartButton from "./AddtoCartButton";
import FavoriteButton from "./FavoriteButton";
import AuthContextProvider from "@/context/AuthContext";
import Image from 'next/image';

const ProductCard = ({ product, isFavoritesPage = false }) => {
  const discount = product ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
  
  // Don't render if product is completely invalid
  if (!product?.id) {
    return null;
  }
  
  // Use placeholder if image is missing
  const hasValidImage = product?.featureImageURL && product.featureImageURL.trim() !== '';
  const imageUrl = hasValidImage ? product.featureImageURL : '/placeholder-product.png';

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
        <div className="relative w-full h-[140px] sm:h-[160px] md:h-[200px] lg:h-[220px] overflow-hidden bg-gray-100">
  {/* Link for Product Image - redirects to details page */}
  <Link href={`/product-details/${product.id}`} className="absolute inset-0 w-full h-full">
    {hasValidImage ? (
      <Image
        src={imageUrl}
        alt={product?.title || 'Product image'}
        className="w-full h-full object-cover"
        layout="fill"
        priority
        decoding="async"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs text-gray-500 mt-2">No Image</p>
        </div>
      </div>
    )}
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