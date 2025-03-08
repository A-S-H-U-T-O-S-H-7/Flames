"use client";

import { useAuth } from "@/context/AuthContext";
import { createCheckoutCODAndGetId, createCheckoutOnlineAndGetId } from "@/lib/firestore/checkout/write";
import { Button, Radio, RadioGroup } from "@nextui-org/react";
import confetti from "canvas-confetti";
import { CheckSquare2Icon, CreditCard, Lock, Banknote, CreditCardIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ShippingAddress from "./ShippingAddress";
import Script from "next/script";

// // Create a new function to handle online payments
// const createCheckoutOnlineAndGetId = async ({ uid, products, address, paymentMode, transactionId = null }) => {
//   // You'll need to implement this function in your firestore/checkout/write.js file
//   // It should be similar to createCheckoutCODAndGetId but with payment details
//   // For now, we'll just return a mock implementation
//   return "online-order-id-123"; // Replace with actual implementation
// };

export default function Checkout({ productList }) {
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const router = useRouter();
  const { user } = useAuth();

  const handleAddress = (key, value) => {
    setAddress({ ...(address ?? {}), [key]: value });
  };

  const totalPrice = productList?.reduce((prev, curr) => {
    return prev + curr?.quantity * curr?.product?.salePrice;
  }, 0);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      
      script.onload = () => {
        resolve(true);
      };
      
      script.onerror = () => {
        resolve(false);
        toast.error("Razorpay SDK failed to load");
      };

      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const res = await initializeRazorpay();

    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
      amount: totalPrice * 100,
      currency: "INR",
      name: "Flames",
      description: "Transaction",
      image: "/flame1.png", 
      handler: function (response) {
        // This function runs when payment is successful
        handleSuccessfulPayment(response.razorpay_payment_id);
      },
      prefill: {
        name: address?.fullName || "",
        email: user?.email || "",
        contact: address?.mobile || "",
      },
      notes: {
        address: address?.addressLine1 + ", " + address?.city,
      },
      theme: {
        color: "#9333ea", // Purple color
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleSuccessfulPayment = async (paymentId) => {
    setIsLoading(true);
    try {
      // Here you would save the order with payment details in your database
      const orderId = await createCheckoutOnlineAndGetId({
        uid: user?.uid,
        products: productList,
        address: address,
        paymentMode: "online",
        transactionId: paymentId,
      });
      
      router.push(`/checkout-success?order_id=${orderId}`);
      toast.success("Payment successful! Order placed.");
      confetti();
    } catch (error) {
      toast.error(error?.message || "Failed to process order");
    }
    setIsLoading(false);
  };

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

      if (paymentMethod === "online") {
        setIsLoading(false);
        // Open Razorpay
        handleRazorpayPayment();
        return;
      }
  
      // Handle COD order
      const orderId = await createCheckoutCODAndGetId({
        uid: user?.uid,
        products: productList,
        address: address,
        paymentMode: "cod",
      });
  
      router.push(`/checkout-cod?order_id=${orderId}`);
      toast.success("Order Placed Successfully!");
      confetti();
    } catch (error) {
      toast.error(error?.message || "An error occurred");
    }
    setIsLoading(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 px-[10px] md:px-[30px]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl text-purple-700 mb-2">Checkout</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Lock size={16} />
            <span>Secure Checkout</span>
          </div>
        </div>

        <section className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Address Form */}
          <ShippingAddress 
            address={address} 
            handleAddress={handleAddress} 
          />

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
                      <p className="text-sm text-gray-500">Qty: {item?.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">₹{item?.product?.salePrice * item?.quantity}</p>
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
                {/* Payment Method Selection */}
                <div className="mb-4">
                  <h3 className="font-heading text-md text-gray-900 mb-3">Payment Method</h3>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    orientation="vertical"
                    color="secondary"
                  >
                    <div className="flex gap-2 border rounded-lg p-3 mb-2 hover:border-purple-400 transition-colors">
                      <Radio value="cod" className="data-[selected=true]:text-purple-500">
                        <div className="flex items-center gap-2">
                          <Banknote size={18} className="text-purple-500" />
                          <span className="font-medium text-gray-800">Cash on Delivery</span>
                        </div>
                      </Radio>
                    </div>
                    <div className="flex gap-2 border rounded-lg p-3 hover:border-purple-400 transition-colors">
                      <Radio value="online" className="data-[selected=true]:text-purple-500">
                        <div className="flex items-center gap-2">
                          <CreditCardIcon size={18} className="text-purple-500" />
                          <span className="font-medium text-gray-800">Pay Online</span>
                          <div className="ml-auto flex gap-1">
                            <img src="https://cdn.razorpay.com/static/assets/razorpay-logo.svg" alt="Razorpay" className="h-5" />
                          </div>
                        </div>
                      </Radio>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex gap-2 items-center">
                  <CheckSquare2Icon className="text-purple-500 flex-shrink-0" size={18} />
                  <p className="text-sm text-gray-600">
                    I agree with the{" "}
                    <button className="text-purple-500 hover:text-purple-600">terms & conditions</button>
                  </p>
                </div>

                <Button
                  isLoading={isLoading}
                  isDisabled={isLoading}
                  onClick={handlePlaceOrder}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg transition-colors"
                >
                  {isLoading ? "Processing..." : `Place Order${paymentMethod === 'online' ? ' & Pay' : ''}`}
                </Button>
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}