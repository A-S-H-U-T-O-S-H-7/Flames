"use client";

import { Truck } from "lucide-react";

export default function ShippingAddress({ address, handleAddress }) {
  return (
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
  );
}