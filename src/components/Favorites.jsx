"use client";

import { useProduct } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { CircularProgress } from "@nextui-org/react";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function Favorites() {
  const { user } = useAuth();
  const { data, isLoading } = useUser({ uid: user?.uid });
  
  // Define hasItems variable
  const hasItems = data?.favorites && data.favorites.length > 0;
  
  if (isLoading) {
    return (
      <div className="p-10 flex w-full justify-center">
        <CircularProgress />
      </div>
    );
  }
  
  return (
    <main className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 flex flex-col items-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Your Favorites</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2 mb-3"></div>
          <p className="text-gray-600">
            {hasItems ? `${data.favorites.length} item${data.favorites.length > 1 ? 's' : ''} you love` : 'Your favorites list is empty'}
          </p>
        </div>
        
        {!hasItems ? (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-12 flex flex-col items-center justify-center overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            <div className="relative mt-4">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-100 rounded-full opacity-60"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-100 rounded-full opacity-60"></div>
              <img className="h-64 w-auto relative z-10" src="/emptycart.webp" alt="Empty favorites illustration" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3">Your favorites list is looking empty</h2>
            <p className="text-gray-600 text-center mb-8 max-w-sm">Add items you love to your favorites and find them all here!</p>
            <Link href="/">
              <button className="group relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-1">
                <span className="relative z-10 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                Your Favorite Items
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {data.favorites.map((productId) => (
                  <ProductItem key={productId} productId={productId} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function ProductItem({ productId }) {
  const { data: product } = useProduct({ productId: productId });
  return <ProductCard product={product} />;
}