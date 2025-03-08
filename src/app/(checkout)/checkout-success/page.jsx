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
    <div className="min-h-screen bg-gray-50 px-[10px] md:px-[30px] py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-purple-200 p-6 md:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="font-heading text-3xl text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 max-w-md">
            Thank you for your purchase. Your order has been successfully placed and will be processed soon.
          </p>
        </div>

        <div className="border-t border-b border-gray-100 py-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <h2 className="text-sm text-gray-500">Order ID</h2>
              <p className="font-medium text-gray-700">{orderId}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <h2 className="text-sm text-gray-500">Payment Method</h2>
              <p className="font-medium text-gray-700">
                {order?.paymentMode === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
              </p>
            </div>
          </div>
          
          {order?.products && (
            <div className="mt-6">
              <h2 className="font-heading text-lg text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {order.products.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.featureImageURL && (
                        <img src={item.featureImageURL} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.title}</h3>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="font-heading text-lg text-gray-900">Total</span>
                  <span className="font-heading text-lg text-purple-500">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/myaccount">
            <Button
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 gap-2 px-6"
              variant="flat"
            >
              <ShoppingBag size={18} />
              View Orders
            </Button>
          </Link>
          <Link href="/">
            <Button
              className="bg-purple-500 hover:bg-purple-600 text-white gap-2 px-6"
            >
              Continue Shopping
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}