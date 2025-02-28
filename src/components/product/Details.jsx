import AddToCart from "../AddToCart";
import FavoriteButton from "../FavoriteButton";
import MyRating from "../MyRating";
import AuthContextProvider from "@/context/AuthContext";
import { getBrand } from "@/lib/firestore/brands/read_server";
import { getCategory } from "@/lib/firestore/categories/read_server";
import { getProductReviewCounts } from "@/lib/firestore/products/count/read";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Suspense } from "react";


export default function Details({ product }) {
  return (
    <div className="w-full flex flex-col gap-4 px-[10px] md:px-[30px] mt-[10px] md:mt-[10px] rounded-lg">
      <div className="flex flex-wrap gap-3">
        <Category categoryId={product?.categoryId} />
        <Brand brandId={product?.brandId} />
      </div>

      <h1 className="font-heading text-2xl md:text-4xl text-gray-900 font-bold">
        {product?.title}
      </h1>
      <Suspense fallback={
        <div className="h-6 w-32 bg-gray-200 animate-pulse rounded-md"></div>
      }>
        <RatingReview product={product} />
      </Suspense>

      <p className="text-gray-600 text-base md:text-lg leading-relaxed">
        {product?.shortDescription}
      </p>

      <div className="flex items-baseline gap-3">
        <span className="text-purple-500 font-bold text-2xl">₹ {product?.salePrice}</span>
        <span className="line-through text-gray-400 text-sm">₹ {product?.price}</span>
      </div>

      <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: product?.description ?? "" }}></div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-4">
        <Link href={`/checkout?type=buynow&productId=${product?.id}`}>
          <button className="bg-purple-500 text-white px-8 w-full md:w-auto py-2 font-semibold rounded-lg shadow-md">
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Buy Now
            </span>
          </button>
        </Link>
        <AuthContextProvider>
          <AddToCart type={"cute"} productId={product?.id} />
        </AuthContextProvider>

        <AuthContextProvider>
          <FavoriteButton productId={product?.id} />
        </AuthContextProvider>
        </div>

      {product?.stock <= (product?.orders ?? 0) && (
        <div className="mt-4">
          <h3 className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm font-semibold border border-red-200 shadow-sm">
            Out Of Stock
          </h3>
        </div>
      )}
    </div>
  );
}

async function Category({ categoryId }) {
  const category = await getCategory({ id: categoryId });
  return (
    <Link href={`/category/${categoryId}`}>
      <div className="flex items-center gap-2 border border-gray-200 px-4 py-1.5 rounded-full bg-gray-100">
        <img className="h-5 w-5 object-contain" src={category?.imageURL} alt="" />
        <h4 className="text-sm font-medium text-gray-700">{category?.name}</h4>
      </div>
    </Link>
  );
}

async function Brand({ brandId }) {
  const brand = await getBrand({ id: brandId });
  return (
    <div className="flex items-center gap-2 border border-gray-200 px-4 py-1.5 rounded-full bg-gray-100">
      <img className="h-5 w-5 object-contain" src={brand?.imageURL} alt="" />
      <h4 className="text-sm font-medium text-gray-700">{brand?.name}</h4>
    </div>
  );
}

async function RatingReview({ product }) {
  const counts = await getProductReviewCounts({ productId: product?.id });
  return (
    <div className="flex gap-3 items-center">
      <MyRating value={counts?.averageRating ?? 0} />
      <h1 className="text-sm text-gray-400">
        <span>{counts?.averageRating?.toFixed(1)}</span> ({counts?.totalReviews}
        )
      </h1>
    </div>
  );
}