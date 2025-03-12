"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@nextui-org/react";
import { useAuth } from "@/context/AuthContext";
import { getOrderById } from "@/lib/firestore/checkout/read";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth() || {};

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId && user) {
        try {
          const orderData = await getOrderById(orderId);
          setOrder(orderData);
        } catch (error) {
          console.error("Error fetching order:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [orderId, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white px-4 md:px-6 py-8">
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-purple-200 overflow-hidden">
      {/* Compact Header Section with Green Icon */}
      <div className="bg-white p-4 md:p-6 border-b border-purple-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <div className="text-left">
            <h1 className="font-heading flex justify-center text-2xl text-gray-900 font-bold">Order Confirmed!</h1>
            <p className="text-gray-600 flex justify-center text-sm">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>
        </div>
      </div>
  
      {/* Order Details Section - More Compact */}
      <div className="p-4 md:p-6">
        <div className="bg-purple-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h2 className="text-xs font-medium text-purple-600 mb-1">Order ID</h2>
              <p className="font-bold text-gray-800 text-sm">{orderId}</p>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h2 className="text-xs font-medium text-purple-600 mb-1">Payment Method</h2>
              <p className="font-bold text-gray-800 text-sm">
                {order?.paymentMode === 'cod' ? 'Cash on Delivery' : 'Prepaid'}
              </p>
            </div>
          </div>
          
          {order?.products && (
            <div>
              <h2 className="font-heading text-base text-gray-900 mb-2 font-bold">Order Summary</h2>
              <div className="space-y-2">
                {order.products.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm">
                    <div className="w-10 h-10 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                      {item.featureImageURL && (
                        <img src={item.featureImageURL} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 truncate">{item.title}</h3>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center bg-purple-100 p-3 rounded-md">
                  <span className="font-heading text-base text-gray-900 font-bold">Total</span>
                  <span className="font-heading text-base text-purple-600 font-bold">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          )}
        </div>
  
        {/* Buttons with MD Rounded Corners */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/myaccount">
            <Button
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 gap-2 px-4 py-2 rounded-md w-full sm:w-auto transition-all duration-200 text-sm font-medium"
              variant="flat"
            >
              <ShoppingBag size={16} />
              View Orders
            </Button>
          </Link>
          <Link href="/">
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white gap-2 px-4 py-2 rounded-md w-full sm:w-auto transition-all duration-200 text-sm font-medium shadow-sm"
            >
              Continue Shopping
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
}