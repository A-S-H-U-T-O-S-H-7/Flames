"use client";

import { useAuth } from "@/context/AuthContext";
import {
  createCheckoutAndGetURL,
  createCheckoutCODAndGetId,
} from "@/lib/firestore/checkout/write";
import { Button } from "@nextui-org/react";
import confetti from "canvas-confetti";
import { CheckSquare2Icon, Square, CreditCard, Truck, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Checkout({ productList }) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState("prepaid");
  const [address, setAddress] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  const handleAddress = (key, value) => {
    setAddress({ ...(address ?? {}), [key]: value });
  };

  const totalPrice = productList?.reduce((prev, curr) => {
    return prev + curr?.quantity * curr?.product?.salePrice;
  }, 0);

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      if (totalPrice <= 0) {
        throw new Error("Price should be greater than 0");
      }
      if (!address?.fullName || !address?.mobile || !address?.addressLine1) {
        throw new Error("Please Fill All Address Details");
      }

      if (!productList || productList?.length === 0) {
        throw new Error("Product List Is Empty");
      }

      if (paymentMode === "prepaid") {
        const url = await createCheckoutAndGetURL({
          uid: user?.uid,
          products: productList,
          address: address,
        });
        router.push(url);
      } else {
        const checkoutId = await createCheckoutCODAndGetId({
          uid: user?.uid,
          products: productList,
          address: address,
        });
        router.push(`/checkout-cod?checkout_id=${checkoutId}`);
        toast.success("Successfully Placed!");
        confetti();
      }
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50  px-[10px] md:px-[30px]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl text-purple-700  mb-2">Checkout</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Lock size={16} />
            <span>Secure Checkout</span>
          </div>
        </div>

        <section className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Address Form */}
          <section className="flex-1 flex flex-col border border-purple-300 gap-6 bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b pb-4">
              <Truck className="text-purple-500" size={24} />
              <h2 className="font-heading text-xl text-gray-900">Shipping Address</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={address?.fullName ?? ""}
                onChange={(e) => handleAddress("fullName", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors"
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={address?.mobile ?? ""}
                onChange={(e) => handleAddress("mobile", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors"
              />
              <input
                type="email"
                placeholder="Email"
                value={address?.email ?? ""}
                onChange={(e) => handleAddress("email", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors md:col-span-2"
              />
              <input
                type="text"
                placeholder="Address Line 1"
                value={address?.addressLine1 ?? ""}
                onChange={(e) => handleAddress("addressLine1", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors md:col-span-2"
              />
              <input
                type="text"
                placeholder="Address Line 2"
                value={address?.addressLine2 ?? ""}
                onChange={(e) => handleAddress("addressLine2", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors md:col-span-2"
              />
              <input
                type="number"
                placeholder="Pincode"
                value={address?.pincode ?? ""}
                onChange={(e) => handleAddress("pincode", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors"
              />
              <input
                type="text"
                placeholder="City"
                value={address?.city ?? ""}
                onChange={(e) => handleAddress("city", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors"
              />
              <input
                type="text"
                placeholder="State"
                value={address?.state ?? ""}
                onChange={(e) => handleAddress("state", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors md:col-span-2"
              />
              <textarea
                placeholder="Notes about your order, e.g special notes for delivery"
                value={address?.orderNote ?? ""}
                onChange={(e) => handleAddress("orderNote", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors md:col-span-2 min-h-[100px]"
              />
            </div>
          </section>

          {/* Right Section - Order Summary */}
          <div className="lg:w-[500px] flex flex-col gap-2">
            <section className="bg-white border border-purple-300 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b pb-4 mb-4">
                <CreditCard className="text-purple-500" size={24} />
                <h2 className="font-heading text-xl text-gray-900">Order Summary</h2>
              </div>
              
              <div className="flex flex-col gap-4">
                {productList?.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center py-2 border-b border-gray-100 last:border-0">
                    <img
                      className="w-16 h-16 object-cover rounded-lg"
                      src={item?.product?.featureImageURL}
                      alt=""
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm text-gray-800 font-medium truncate">
                        {item?.product?.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item?.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ₹{item?.product?.salePrice * item?.quantity}
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="font-heading text-lg text-gray-900">Total</span>
                  <span className="font-heading text-lg text-purple-500">₹{totalPrice}</span>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-purple-300 shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <h2 className="font-heading text-lg text-gray-900">Payment Method</h2>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setPaymentMode("prepaid")}
                      className={`flex items-center gap-2 p-3 rounded-lg border ${
                        paymentMode === "prepaid"
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200"
                      } transition-colors`}
                    >
                      {paymentMode === "prepaid" ? (
                        <CheckSquare2Icon className="text-purple-500" size={18} />
                      ) : (
                        <Square size={18} />
                      )}
                      <span className="text-gray-800">Pay Now</span>
                    </button>
                    
                    <button
                      onClick={() => setPaymentMode("cod")}
                      className={`flex items-center gap-2 p-3 rounded-lg border ${
                        paymentMode === "cod"
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200"
                      } transition-colors`}
                    >
                      {paymentMode === "cod" ? (
                        <CheckSquare2Icon className="text-purple-500" size={18} />
                      ) : (
                        <Square size={18} />
                      )}
                      <span className="text-gray-800">Cash on Delivery</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <CheckSquare2Icon className="text-purple-500 flex-shrink-0" size={18} />
                  <p className="text-sm text-gray-600">
                    I agree with the{" "}
                    <button className="text-purple-500 hover:text-purple-600">
                      terms & conditions
                    </button>
                  </p>
                </div>

                <Button
                  isLoading={isLoading}
                  isDisabled={isLoading}
                  onClick={handlePlaceOrder}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg transition-colors"
                >
                  {isLoading ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}