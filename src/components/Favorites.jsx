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
    <main className="flex flex-col bg-gray-100 gap-3 justify-center items-center md:px-[30px] pb-10 ">
      <h1 className="text-2xl py-[20px] text-gray-800 font-heading font-semibold">Favorites</h1>
      {(!data?.favorites || data?.favorites?.length === 0) && (
        <div className="flex flex-col gap-5 justify-center items-center h-full w-full py-20">
          <div className="flex justify-center">
            <img className="h-[200px]" src="/svgs/Empty-pana.svg" alt="" />
          </div>
          <h1 className="text-gray-600 font-semibold">
            Please Add Products To Favorites
          </h1>
        </div>
      )}
      <div className="p-2 w-full gap-2 md:gap-4 grid grid-cols-2 md:grid-cols-3 ">
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