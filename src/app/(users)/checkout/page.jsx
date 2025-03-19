"use client";

import { useAuth } from "@/context/AuthContext";
import { useProductsByIds } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { CircularProgress } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import Checkout from "@/components/Checkout";
import { Suspense } from "react";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const productId = searchParams.get("productId");

  const productIdsList =
    type === "buynow" ? [productId] : data?.carts?.map((item) => item?.id);

  const {
    data: products,
    error,
    isLoading,
  } = useProductsByIds({
    idsList: productIdsList ?? [], // Add null check
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
        <div className="text-red-500">Error: {error.toString()}</div>
      </div>
    );
  }

  if (!productIdsList || productIdsList.length === 0) {
    return (
      <div className="p-5">
        <h1 className="text-xl">Products Not Found</h1>
      </div>
    );
  }

  const productList =
    type === "buynow"
      ? [
          {
            id: productId,
            quantity: 1,
            product: products?.[0],
          },
        ]
      : data?.carts?.map((item) => ({
          ...item,
          product: products?.find((e) => e?.id === item?.id),
        }));

  return (
    <Suspense fallback={<CircularProgress />}>
      <main className="py-[20px] min-h-screen flex flex-col bg-gray-50 gap-4">
        <Checkout productList={productList ?? []} />
      </main>
    </Suspense>
  );
}