"use client";

import { useAuth } from "@/context/AuthContext";
import { createCheckoutCODAndGetId, createCheckoutOnlineAndGetId } from "@/lib/firestore/checkout/write";
import { Radio, RadioGroup } from "@nextui-org/react";
import confetti from "canvas-confetti";
import { CheckSquare2, CreditCard,Tag, BadgeCheck , Lock, Banknote, CreditCardIcon, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ShippingAddress from "./ShippingAddress";
import TermsPopup from "./Terms&condition";

export default function Checkout({ productList }) {
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [pageLoading, setPageLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);


  const openPopup = (e) => {
    e.preventDefault();
    setIsPopupOpen(true);
  };
  
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Simulate initial page loading delay
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1500); // 1.5 second delay on page load
    
    return () => clearTimeout(timer);
  }, []);

  const handleAddress = (key, value) => {
    setAddress({ ...(address ?? {}), [key]: value });
  };
  
  // Calculate total price, total discount, and check if delivery is free
  const totalMRP = productList?.reduce((prev, curr) => {
    return prev + curr?.quantity * (curr?.product?.price || curr?.product?.salePrice);
  }, 0);
  
  const totalSalePrice = productList?.reduce((prev, curr) => {
    return prev + curr?.quantity * curr?.product?.salePrice;
  }, 0);
  
  const totalDiscount = totalMRP - totalSalePrice;
  const isDeliveryFree = totalSalePrice >= 499; // Free delivery for orders above ₹499

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
    // Show a loader while initializing Razorpay
    setProcessingOrder(true);
    
    const res = await initializeRazorpay();

    if (!res) {
      setProcessingOrder(false);
      toast.error("Razorpay SDK failed to load");
      return;
    }

    // Set a timeout to show loader for at least 2 seconds
    const startTime = Date.now();
    const minLoadTime = 2000; // 2 seconds
    
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
      amount: totalSalePrice * 100,
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
      modal: {
        ondismiss: function() {
          setProcessingOrder(false);
        }
      }
    };

    // Ensure we show the loader for at least 2 seconds
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < minLoadTime) {
      await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsedTime));
    }

    // Open Razorpay
    setProcessingOrder(false);
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleSuccessfulPayment = async (paymentId) => {
    setProcessingOrder(true); // Show processing overlay instead of button loader
    try {
      // Here you would save the order with payment details in your database
      const orderId = await createCheckoutOnlineAndGetId({
        uid: user?.uid,
        products: productList,
        address: address,
        paymentMode: "prepaid",
        transactionId: paymentId,
      });
      
      router.push(`/checkout-success?order_id=${orderId}`);
      toast.success("Payment successful! Order placed.");
      confetti();
    } catch (error) {
      toast.error(error?.message || "Failed to process order");
      setProcessingOrder(false);
    }
  };

 // Validate all mandatory fields
const validateAddress = () => {
  const requiredFields = [
    { field: 'fullName', label: 'Full Name' },
    { field: 'mobile', label: 'Mobile Number' },
    { field: 'email', label: 'Email' },
    { field: 'addressLine1', label: 'Address Line 1' },
    { field: 'landmark', label: 'Nearby Location/Landmark' },
    { field: 'pincode', label: 'Pincode' },
    { field: 'city', label: 'City' },
    { field: 'state', label: 'State' }
  ];
  
  // Check if fields are empty
  for (const { field, label } of requiredFields) {
    if (!address || !address[field]) {
      toast.error(`${label} is required`);
      return false;
    }
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(address.email)) {
    toast.error("Please enter a valid email address");
    return false;
  }
  
  // Validate mobile number (exactly 10 digits)
  const mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(address.mobile)) {
    toast.error("Mobile number must be exactly 10 digits");
    return false;
  }
  
  // Validate pincode (exactly 6 digits)
  const pincodeRegex = /^\d{6}$/;
  if (!pincodeRegex.test(address.pincode)) {
    toast.error("Pincode must be exactly 6 digits");
    return false;
  }
  
  return true;
};

  const handlePlaceOrder = async () => {
    // First validate all required fields
    if (!validateAddress()) {
      return;
    }
    
    if (totalSalePrice <= 0) {
      toast.error("Price should be greater than 0");
      return;
    }
    
    if (!productList || productList?.length === 0) {
      toast.error("Product List Is Empty");
      return;
    }

    // Now proceed with order placement
    setProcessingOrder(true); // Show overlay loader instead of button loader
    
    try {
      if (paymentMethod === "prepaid") {
        // Open Razorpay
        handleRazorpayPayment();
        return;
      }
      
      // For COD, first trigger confetti, then continue processing
      confetti();
      
      // Handle COD order with additional delay
      const orderId = await createCheckoutCODAndGetId({
        uid: user?.uid,
        products: productList,
        address: address,
        paymentMode: "cod",
      });
      
      // Add a 3 second delay after COD order is placed before redirecting
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      router.push(`/checkout-success?order_id=${orderId}`);
      toast.success("Order Placed Successfully!");
    } catch (error) {
      setProcessingOrder(false);
      toast.error(error?.message || "An error occurred");
    }
  };
  
  // Only show the full page loader for initial page loading
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading checkout...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 px-[10px] md:px-[30px] relative">
      {/* Semi-transparent overlay loader for processing orders */}
      {processingOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="bg-white/90 p-6 rounded-xl shadow-lg flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <p className="text-gray-700 font-medium">
              {paymentMethod === "cod" ? "Processing your order..." : "Preparing payment..."}
            </p>
          </div>
        </div>
      )}
      
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
          {/* {item?.product?.price && item?.product?.price > item?.product?.salePrice && (
            <div className="flex gap-2 items-center">
              <span className="text-xs text-gray-500 line-through">₹{item?.product?.price}</span>
              <span className="text-xs text-green-600">
                Save ₹{(item?.product?.price - item?.product?.salePrice) * item?.quantity}
              </span>
            </div>
          )} */}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">₹{item?.product?.price * item?.quantity}</p>
        </div>
      </div>
    ))}
     
    {/* Price Breakdown */}
    <div className="pt-4 border-t border-gray-200">
      {/* <div className="flex justify-between items-center text-sm mb-2">
        <span className="text-gray-700">Subtotal</span>
        <span className="text-gray-900">₹{totalMRP}</span>
      </div>
                  */}
      {totalDiscount > 0 && (
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-gray-700">Item Discount</span>
          <span className="text-green-600">-₹{totalDiscount}</span>
        </div>
      )}
                 
      <div className="flex justify-between items-center text-sm mb-2">
        <span className="text-gray-700">Delivery Fee</span>
        {/* 
          For future implementation:
          - Add condition for free delivery threshold
          - Add delivery fee calculation based on distance or weight
          - Add option for express delivery with higher fee
        */}
          <div className="flex items-center gap-2">
              <span className="text-gray-600 line-through text-sm">₹50</span>
              <span className="text-green-600">Free</span>
            </div>
      </div>
                 
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
        <div className="flex items-center gap-2">
          <Tag className="text-gray-700" size={20} />
          <span className="font-bold text-xl text-gray-900">Total to Pay</span>
        </div>
        <span className="font-bold text-xl text-purple-600">₹{totalMRP - totalDiscount}</span>
      </div>
      <div className="mt-2 rounded-lg p-1 flex items-center gap-1">
        <BadgeCheck className="text-emerald-600" size={16} />
        <span className="text-sm font-medium text-emerald-700">You saved ₹{totalDiscount+50}</span>
      </div>    </div>
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
                      <Radio value="prepaid" className="data-[selected=true]:text-purple-500">
                        <div className="flex items-center gap-2">
                          <CreditCardIcon size={18} className="text-purple-500" />
                          <span className="font-medium text-gray-800">Pay Online</span>
                          <div className="ml-auto flex gap-1">
                            <img src="/razorpay.svg" alt="Razorpay" className="h-5" />
                          </div>
                        </div>
                      </Radio>
                    </div>
                  </RadioGroup>
                </div>

                <div>
      <div className="flex gap-2 items-center">
        
          <CheckSquare2 
            size={18} 
            className="text-purple-500"
          />
        
        <p className="text-sm text-gray-600">
          I agree with the{" "}
          <button 
            className="text-purple-500 hover:text-purple-600"
            onClick={openPopup}
          >
            terms & conditions
          </button>
        </p>
      </div>
      
      <TermsPopup isOpen={isPopupOpen} onClose={closePopup} />
    </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {`Place Order${paymentMethod === 'prepaid' ? ' & Pay' : ''}`}
                </button>
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}