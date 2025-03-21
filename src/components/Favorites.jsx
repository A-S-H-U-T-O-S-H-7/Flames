"use client";

import { useProduct } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { CircularProgress } from "@nextui-org/react";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/ProductCard";

export default function Favorites() {
  const { user } = useAuth();
  const { data, isLoading } = useUser({ uid: user?.uid });
  if (isLoading) {
    return (
      <div className="p-10 flex w-full justify-center">
        <CircularProgress />
      </div>
    );
  }
  return (
    <main className="flex flex-col bg-gray-100 gap-3 md:px-[30px] pb-10 ">
      
      <h1 className="text-2xl flex items-center justify-center  py-[20px] text-gray-800 font-heading font-semibold">Favorites</h1>
      
      {(!data?.favorites || data?.favorites?.length === 0) && (
        <div className="flex flex-col gap-5 justify-center items-center h-full w-full py-20">
          <div className="flex justify-center">
            <img className="h-[200px]" src="/emptycart.webp" alt="fav" />
          </div>
          <h1 className="text-gray-600 font-semibold">
            Please Add Products To Favorites
          </h1>
        </div>
      )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
          {data?.favorites?.map((productId) => {
          return <ProductItem productId={productId} key={productId} />;
        })}
      </div>
    </main>
  );
}

function ProductItem({ productId }) {
  const { data: product } = useProduct({ productId: productId });
  return <ProductCard product={product} />;
}