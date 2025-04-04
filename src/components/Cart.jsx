"use client";

import { useAuth } from "@/context/AuthContext";
import { useProduct } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import { CircularProgress } from "@nextui-org/react";
import { Minus, Plus, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Cart() {
  const { user } = useAuth();
  const { data, isLoading } = useUser({ uid: user?.uid });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <CircularProgress color="secondary" size="lg" />
      </div>
    );
  }
  
  const hasItems = data?.carts && data.carts.length > 0;
  
  return (
    <main className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center ">
          <h1 className=" text-xl font-heading text-gray-800 font-bold">Shopping Cart</h1>
          <p className="text-gray-500 mt-1">
            {hasItems ? `${data.carts.length} item${data.carts.length > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
          </p>
        </div>
        
        {!hasItems ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10 flex flex-col items-center justify-center">
            <div className="max-w-xs">
              <img className="h-48 sm:h-64 w-auto" src="/emptycart.webp" alt="Empty cart illustration" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 text-center mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/">
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                <ArrowLeft size={18} />
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className=" rounded-2xl  mb-6">
              <h2 className="text-lg font-base text-gray-800 mb-4 flex items-center gap-2 justify-center sm:justify-start">
                <ShoppingBag size={20} className="text-indigo-600" />
                Cart Items
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.carts.map((item) => (
                  <ProductItem item={item} key={item?.id} />
                ))}
              </div>
            </div>

            <div className="flex justify-center items-center">
              <Link href="/checkout?type=cart">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-lg font-medium transition-colors duration-200">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function ProductItem({ item }) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: product, isLoading } = useProduct({ productId: item?.id });
  
  const discount = product ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

  const handleRemove = async () => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    setIsRemoving(true);
    try {
      const newList = data?.carts?.filter((d) => d?.id != item?.id);
      await updateCarts({ list: newList, uid: user?.uid });
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error?.message || "Failed to remove item");
    }
    setIsRemoving(false);
  };

  const handleUpdate = async (quantity) => {
    if (quantity < 1) return;
    setIsUpdating(true);
    try {
      const newList = data?.carts?.map((d) => {
        if (d?.id === item?.id) {
          return {
            ...d,
            quantity: parseInt(quantity),
          };
        }
        return d;
      });
      await updateCarts({ list: newList, uid: user?.uid });
    } catch (error) {
      toast.error(error?.message || "Failed to update quantity");
    }
    setIsUpdating(false);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-xl p-4 flex items-center gap-4 h-24"></div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 hover:border-indigo-200 rounded-xl shadow-sm hover:shadow transition-all duration-200">
      <div className="p-4 flex flex-row items-start gap-4">
        {/* Image */}
        <Link href={`/product-details/${product?.id}`} className="block h-20 w-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden mx-auto sm:mx-0">
          <img
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            src={product?.featureImageURL}
            alt={product?.title}
          />
        </Link>

        {/* Product Details */}
        <div className="flex flex-col flex-grow min-w-0 w-full">
          <div className="flex justify-between">
            <Link href={`/product-details/${product?.id}`}>
              <h3 className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors line-clamp-1">
                {product?.title}
              </h3>
            </Link>
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="text-gray-400 hover:text-red-500 disabled:text-gray-300 transition-colors p-1"
              aria-label="Remove item"
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {product?.shortDescription}
          </p>
          
          <div className="mt-auto pt-3 flex flex-row sm:items-end justify-between gap-3">
            {/* Price */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 font-medium">
                  ₹{product?.salePrice}
                </span>
                <span className="line-through text-xs text-gray-400">
                  ₹{product?.price}
                </span>
                {discount > 0 && (
                  <span className="bg-green-50 text-green-600 text-xs px-1.5 py-0.5 rounded">
                    {discount}% off
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center rounded-lg border border-gray-200 self-start sm:self-end">
              <button
                onClick={() => handleUpdate(item?.quantity - 1)}
                disabled={isUpdating || item?.quantity <= 1}
                className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-indigo-600 disabled:text-gray-300 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              
              <span className="font-medium text-gray-800 w-8 text-center">
                {item?.quantity}
              </span>
              
              <button
                onClick={() => handleUpdate(item?.quantity + 1)}
                disabled={isUpdating}
                className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-indigo-600 disabled:text-gray-300 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}