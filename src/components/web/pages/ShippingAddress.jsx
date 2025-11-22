"use client";

import { Truck } from "lucide-react";
import { useState } from "react";

export default function ShippingAddress({ address, handleAddress }) {
  // State to track validation errors
  const [errors, setErrors] = useState({
    fullName: "",
    mobile: "",
    email: "",
    addressLine1: "",
    landmark: "",
    pincode: "",
    city: "",
    state: ""
  });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };

  const validatePincode = (pincode) => {
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(pincode);
  };

  // Handle input changes with validation
  const handleInputChange = (key, value) => {
    let errorMessage = "";

    // Validate based on field type
    if (key === "email" && value) {
      if (!validateEmail(value)) {
        errorMessage = "Please enter a valid email address";
      }
    } else if (key === "mobile" && value) {
      if (!validateMobile(value)) {
        errorMessage = "Mobile number must be exactly 10 digits";
      }
    } else if (key === "pincode" && value) {
      if (!validatePincode(value)) {
        errorMessage = "Pincode must be exactly 6 digits";
      }
    }

    // Update error state
    setErrors(prev => ({ ...prev, [key]: errorMessage }));
    
    // Call the parent handler to update address
    handleAddress(key, value);
  };

  // Input restriction handlers
  const handleMobileInput = (e) => {
    // Allow only numbers and restrict to 10 digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    handleInputChange("mobile", value);
  };

  const handlePincodeInput = (e) => {
    // Allow only numbers and restrict to 6 digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    handleInputChange("pincode", value);
  };

  return (
    <section className="flex-1 flex flex-col border border-purple-300 gap-6 bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b pb-4">
        <Truck className="text-purple-500" size={24} />
        <h2 className="font-heading text-xl text-gray-900">Shipping Address</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="relative">
          <input
            type="text"
            placeholder="Full Name *"
            value={address?.fullName ?? ""}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? "border-red-400" : "border-gray-200"} text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors`}
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>
        
        {/* Mobile Number */}
        <div className="relative">
          <input
            type="tel"
            placeholder="Mobile Number (10 digits) *"
            value={address?.mobile ?? ""}
            onChange={(e) => handleMobileInput(e)}
            className={`w-full px-4 py-3 rounded-lg border ${errors.mobile ? "border-red-400" : "border-gray-200"} text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors`}
          />
          {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
        </div>
        
        {/* Email */}
        <div className="relative md:col-span-2">
          <input
            type="email"
            placeholder="Email *"
            value={address?.email ?? ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-400" : "border-gray-200"} text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        
        {/* Address Line 1 */}
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="Address Line 1 *"
            value={address?.addressLine1 ?? ""}
            onChange={(e) => handleInputChange("addressLine1", e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${errors.addressLine1 ? "border-red-400" : "border-gray-200"} text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors`}
          />
          {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>}
        </div>
        
        {/* Address Line 2 */}
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="Address Line 2"
            value={address?.addressLine2 ?? ""}
            onChange={(e) => handleInputChange("addressLine2", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors"
          />
        </div>
        
        {/* Landmark */}
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="Nearby Location/Landmark *"
            value={address?.landmark ?? ""}
            onChange={(e) => handleInputChange("landmark", e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${errors.landmark ? "border-red-400" : "border-gray-200"} text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors`}
          />
          {errors.landmark && <p className="text-red-500 text-xs mt-1">{errors.landmark}</p>}
        </div>
        
        {/* Pincode */}
        <div className="relative">
          <input
            type="text"
            placeholder="Pincode (6 digits) *"
            value={address?.pincode ?? ""}
            onChange={(e) => handlePincodeInput(e)}
            className={`w-full px-4 py-3 rounded-lg border ${errors.pincode ? "border-red-400" : "border-gray-200"} text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors`}
          />
          {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
        </div>
        
        {/* City */}
        <div className="relative">
          <input
            type="text"
            placeholder="City *"
            value={address?.city ?? ""}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${errors.city ? "border-red-400" : "border-gray-200"} text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors`}
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>
        
        {/* State */}
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="State *"
            value={address?.state ?? ""}
            onChange={(e) => handleInputChange("state", e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${errors.state ? "border-red-400" : "border-gray-200"} text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors`}
          />
          {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
        </div>
        
        {/* Order Notes */}
        <div className="relative md:col-span-2">
          <textarea
            placeholder="Notes about your order (optional)"
            value={address?.orderNote ?? ""}
            onChange={(e) => handleInputChange("orderNote", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-colors min-h-[100px]"
          />
        </div>
        
        <div className="text-xs text-gray-500 md:col-span-2">
          * Required fields
        </div>
      </div>
    </section>
  );
}