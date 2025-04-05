"use client";

import { useAuth } from "@/context/AuthContext";
import { useProduct } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import { CircularProgress } from "@nextui-org/react";
import { Minus, Plus, ShoppingBag, Trash2, ArrowLeft, Heart } from "lucide-react";
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
    <main className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 flex flex-col items-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Shopping Cart</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2 mb-3"></div>
          <p className="text-gray-600">
            {hasItems ? `${data.carts.length} item${data.carts.length > 1 ? 's' : ''} waiting for you` : 'Your cart is looking empty'}
          </p>
        </div>
        
        {!hasItems ? (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-12 flex flex-col items-center justify-center overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            <div className="relative mt-4">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-100 rounded-full opacity-60"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-100 rounded-full opacity-60"></div>
              <img className="h-64 w-auto relative z-10" src="/emptycart.webp" alt="Empty cart illustration" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3">Your cart feels lonely</h2>
            <p className="text-gray-600 text-center mb-8 max-w-sm">Add something beautiful to your cart and make it happy again!</p>
            <Link href="/">
              <button className="group relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-1">
                <span className="relative z-10 flex items-center gap-2">
                  <ArrowLeft size={18} />
                  Discover Products
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
                  <ShoppingBag size={20} />
                </div>
                Your Selected Items
              </h2>
              <div className="grid grid-cols-1 gap-5">
                {data.carts.map((item) => (
                  <ProductItem item={item} key={item?.id} />
                ))}
              </div>
            </div>

            <div className="flex justify-center items-center mt-10">
              <Link href="/checkout?type=cart">
                <button className="group relative overflow-hidden px-10 py-4 rounded-md bg-purple-600 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-1">
                  <span className="relative z-10">Proceed to Checkout</span>
                  <span className="absolute inset-0 bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
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
      <div className="animate-pulse bg-gray-100 rounded-2xl p-4 flex items-center gap-4 h-28"></div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-100 hover:border-indigo-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="p-5 flex flex-row items-start gap-5 relative">
        {/* Left side blur decoration */}
        <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>
        
        {/* Image with hover effect */}
        <Link href={`/product-details/${product?.id}`} className="block h-24 w-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative group-hover:shadow-md transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <img
            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
            src={product?.featureImageURL}
            alt={product?.title}
          />
        </Link>

        {/* Product Details */}
        <div className="flex flex-col flex-grow min-w-0 w-full">
          <div className="flex justify-between">
            <Link href={`/product-details/${product?.id}`}>
              <h3 className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors line-clamp-1 text-lg">
                {product?.title}
              </h3>
            </Link>
            <div className="flex gap-2">
              
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className="text-gray-400 hover:text-red-500 disabled:text-gray-300 transition-colors p-1 rounded-full hover:bg-red-50"
                aria-label="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {product?.shortDescription}
          </p>
          
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                ₹{product?.salePrice}
              </span>
              <span className="line-through text-sm text-gray-400">
                ₹{product?.price}
              </span>
              {discount > 0 && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                  {discount}% off
                </span>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 self-start mt-2 sm:mt-0">
              <button
                onClick={() => handleUpdate(item?.quantity - 1)}
                disabled={isUpdating || item?.quantity <= 1}
                className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-indigo-600 disabled:text-gray-300 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
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
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}