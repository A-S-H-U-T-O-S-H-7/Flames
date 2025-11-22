"use client";

import { useProduct } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { CircularProgress } from "@nextui-org/react";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import {  ArrowLeft} from "lucide-react";


export default function Favorites() {
  const { user } = useAuth();
  const { data, isLoading } = useUser({ uid: user?.uid });
  if (isLoading) {
    return (
      <div className="p-10 min-h-screen flex w-full justify-center">
        <CircularProgress />
      </div>
    );
  }
  return (
    <main className="flex min-h-screen items-center flex-col bg-gray-100  gap-3 px-[10px] md:px-[30px] pb-10 ">
      
      <h1 className="text-3xl pt-4 font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Favorites</h1>
      <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-3"></div>
      
      {(!data?.favorites || data?.favorites?.length === 0) && (
       <div className="bg-white w-full max-w-[1000px] mx-auto rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-8 md:p-12 flex flex-col items-center justify-center overflow-hidden relative">
       <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
       <div className="relative mt-4">
         <div className="absolute -top-6 -right-6 w-16 sm:w-24 h-16 sm:h-24 bg-purple-100 rounded-full opacity-60"></div>
         <div className="absolute -bottom-8 -left-8 w-24 sm:w-32 h-24 sm:h-32 bg-indigo-100 rounded-full opacity-60"></div>
         <img className="h-40 sm:h-52 md:h-64 w-auto relative z-10" src="/emptycart.webp" alt="Empty cart illustration" />
       </div>
       <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-6 sm:mt-8 mb-2 sm:mb-3">Your favorites list is waiting to be filled</h2>
       <p className="text-gray-600 text-center mb-6 sm:mb-8 max-w-sm">Find your perfect pieces and keep them a click away!</p>
       <Link href="/">
         <button className="group relative overflow-hidden px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-1">
           <span className="relative z-10 flex items-center gap-2">
             <ArrowLeft size={16} sm={18} />
             Discover Products
           </span>
           <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
         </button>
       </Link>
     </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
        {data?.favorites?.map((productId) => {
          return <ProductItem productId={productId} key={productId}  />;
        })}
      </div>
    </main>
  );
}

function ProductItem({ productId }) {
  const { data: product } = useProduct({ productId: productId });
  return <ProductCard product={product} isFavoritesPage={true} />;
}