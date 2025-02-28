"use client";

import { useAuth } from "@/context/AuthContext";
import { useProduct } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Cart() {
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
    <main className="flex flex-col gap-3 bg-gray-100 justify-center items-center p-5">
      <h1 className="text-2xl font-heading text-gray-800 font-semibold">Cart</h1>
      {(!data?.carts || data?.carts?.length === 0) && (
        <div className="flex flex-col gap-5 justify-center items-center h-full w-full py-20">
          <div className="flex justify-center">
            <img className="h-[200px]" src="/svgs/Empty-pana.svg" alt="" />
          </div>
          <h1 className="text-gray-600 font-semibold">
            Please Add Products To Cart
          </h1>
        </div>
      )}
      <div className="p-5 w-full md:max-w-[900px] gap-4 grid grid-cols-1 md:grid-cols-2">
        {data?.carts?.map((item, key) => {
          return <ProductItem item={item} key={item?.id} />;
        })}
      </div>
      <div>
        <Link href={`/checkout?type=cart`}>
          <button className="bg-purple-500 px-5 py-2 text-sm rounded-lg text-white">
            Checkout
          </button>
        </Link>
      </div>
    </main>
  );
}

function ProductItem({ item }) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });

  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: product } = useProduct({ productId: item?.id });

  const handleRemove = async () => {
    if (!confirm("Are you sure?")) return;
    setIsRemoving(true);
    try {
      const newList = data?.carts?.filter((d) => d?.id != item?.id);
      await updateCarts({ list: newList, uid: user?.uid });
    } catch (error) {
      toast.error(error?.message);
    }
    setIsRemoving(false);
  };

  const handleUpdate = async (quantity) => {
    setIsUpdating(true);
    try {
      const newList = data?.carts?.map((d) => {
        if (d?.id === item?.id) {
          return {
            ...d,
            quantity: parseInt(quantity),
          };
        } else {
          return d;
        }
      });
      await updateCarts({ list: newList, uid: user?.uid });
    } catch (error) {
      toast.error(error?.message);
    }
    setIsUpdating(false);
  };

  return (
    <div className="bg-white hover:bg-gray-50 transition-colors border border-purple-300 duration-200 rounded-xl px-4 py-3">
      <div className="flex items-center gap-4">
        {/* Image */}
        <Link href={`/product-details/${product?.id}`} >
        <div className="h-16 w-16 flex-shrink-0">
          <img
            className="w-full h-full object-cover rounded-lg"
            src={product?.featureImageURL}
            alt={product?.title}
          />
        </div>
        </Link>

        {/* Product Details */}
        <div className="flex flex-col gap-1.5 flex-grow min-w-0">
        <Link href={`/product-details/${product?.id}`} >
          <h1 className="text-sm font-semibold font-body text-gray-800 truncate">
            {product?.title}
          </h1>
          </Link>
          <h1 className="text-sm  font-body text-gray-500 truncate">
            {product?.shortDescription}
          </h1>
          
          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-medium text-sm">
              ₹{product?.salePrice}
            </span>
            <span className="line-through text-xs text-gray-400">
              ₹{product?.price}
            </span>
          </div>

          {/* Quantity Controls - Simplified */}
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={() => handleUpdate(item?.quantity - 1)}
              disabled={isUpdating || item?.quantity <= 1}
              className="text-purple-500 hover:text-purple-700 disabled:text-gray-300 transition-colors"
            >
              <Minus size={16} />
            </button>
            
            <span className="font-medium text-gray-700">
              {item?.quantity}
            </span>
            
            <button
              onClick={() => handleUpdate(item?.quantity + 1)}
              disabled={isUpdating}
              className="text-purple-500 hover:text-purple-700 disabled:text-gray-300 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Remove Button - Simplified */}
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="text-gray-600 hover:text-red-500 disabled:text-gray-300 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  
  );
}