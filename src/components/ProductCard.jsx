import AuthContextProvider from "@/context/AuthContext";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

const ProductCard = ({ product }) => {
  return (
    <div className="flex-shrink-0 w-[178px] sm:w-[180px] md:w-[250px] bg-white shadow-sm hover:shadow-lg hover:shadow-purple-300 shadow-purple-400 rounded-xl overflow-hidden border border-gray-200">
      {/* Product Image with Favorite Button */}
      <div className="relative w-full h-[160px] sm:h-[160px] md:h-[190px]">
        <img
          src={product?.featureImageURL}
          alt={product?.title}
          className="w-full h-full object-cover"
        />
        
        {/* Favorite Button */}
        <div className="absolute top-2 right-2 z-10">
          <AuthContextProvider>
            <FavoriteButton productId={product?.id} />
          </AuthContextProvider>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4 py-2 space-y-2">
        {/* Title */}
        <Link href={`/product-details/${product?.id}`} className="block">
          <h2 className="text-lg font-body font-semibold text-gray-800 truncate">
            {product?.title}
          </h2>
        </Link>

        {/* Short Description */}
        <p className="text-sm text-gray-600 font-body line-clamp-2">
          {product?.shortDescription}
        </p>
        
        {/* <p className="text-sm text-gray-600 font-body line-clamp-2">
          {product?.color}
        </p>
        <p className="text-sm text-gray-600 font-body line-clamp-2">
          {product?.occasion}
        </p> */}

        {/* Price Section */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-green-600">₹{product?.salePrice}</span>
          <span className="text-sm text-gray-500 line-through">₹{product?.price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;