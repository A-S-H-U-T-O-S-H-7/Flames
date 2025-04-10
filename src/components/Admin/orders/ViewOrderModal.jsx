"use client";
import React from "react";
import { X, Calendar, Clock, CreditCard, Package, Phone, Mail, MapPin, StickyNote } from "lucide-react";
import { formatDateTime } from "./OrdersUtil";

export function ViewOrderModal({ order, onClose, onEdit, onCancel }) {
  if (!order) return null;

  const { date, time } = formatDateTime(order.createdAt);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="h-5 w-5" /> Order Details
          </h3>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Customer & Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" /> Customer Information
              </h4>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="font-medium w-24 flex-shrink-0">Name:</span> 
                  <span className="font-semibold break-words">{order.address?.fullName}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium w-24 flex-shrink-0">Email:</span> 
                  <span className="break-all">{order.address?.email || "N/A"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium w-24 flex-shrink-0">Phone:</span> 
                  <span>{order.address?.mobile || "N/A"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium w-24 flex-shrink-0">Address:</span> 
                  <span className="break-words">{order.address?.addressLine1}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium w-24 flex-shrink-0">City:</span> 
                  <span>{order.address?.city || "N/A"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium w-24 flex-shrink-0">Pin Code:</span> 
                  <span>{order.address?.pincode || "N/A"}</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-500" /> Order Information
              </h4>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="font-medium w-32 flex-shrink-0">Order ID:</span> 
                  <span className="font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs break-all">{order.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium w-32 flex-shrink-0">Date:</span> 
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-blue-500" /> {date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium w-32 flex-shrink-0">Time:</span> 
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-blue-500" /> {time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium w-32 flex-shrink-0">Payment Method:</span> 
                  <span>{order.paymentMode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium w-32 flex-shrink-0">Status:</span> 
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    order.status === "confirmed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                    order.status === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" :
                    order.status === "delivered" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" :
                    order.status === "cancelled" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" :
                    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}>
                    {order.status}
                  </span>
                </div>
                {order.status === "cancelled" && (
                  <div className="flex items-start gap-2">
                    <span className="font-medium w-32 flex-shrink-0">Cancellation Reason:</span> 
                    <span className="break-words">{order.cancellationReason || "N/A"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Notes - Only visible when notes exist */}
{order.address?.orderNote && (
  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-amber-900/30 dark:to-yellow-900/20 p-3 rounded-xl shadow-sm border border-amber-200 dark:border-amber-800 relative overflow-hidden">
    {/* Decorative elements */}
    <div className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 opacity-10">
      <StickyNote className="w-full h-full text-amber-500" />
    </div>
    
    <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
      <StickyNote className="h-4 w-4 text-amber-500" /> Order Notes
    </h4>
    
    <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-inner border border-amber-100 dark:border-amber-800 min-h-24">
      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{order.address.orderNote}</p>
    </div>
  </div>
)}

          {/* Order Items */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" /> Order Items
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {order.line_items.map((item, index) => (
                <div key={index} className="p-4 grid grid-cols-12 gap-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  {/* Product ID & Image */}
                  <div className="col-span-12 sm:col-span-3 flex flex-col items-center gap-2">
                    <div className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-lg text-blue-700 dark:text-blue-300 font-mono text-xs">
                      ID: {item.product_data.metadata.productId}
                    </div>
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border-2 border-gray-200 dark:border-gray-600 shadow-md">
                      <img src={item.product_data.images[0]} alt={item.product_data.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="col-span-12 sm:col-span-9 flex flex-col">
                    <p className="text-base font-bold text-gray-900 dark:text-white">{item.product_data.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 my-1">{item.product_data.description}</p>
                    <div className="mt-auto grid grid-cols-3 gap-2">
                      <div className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Price: </span>
                        <span className="font-medium">₹{item.price}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Qty: </span>
                        <span className="font-medium">{item.quantity}</span>
                      </div>
                      <div className="text-sm text-right">
                        <span className="text-gray-500 dark:text-gray-400">Total: </span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-500" /> Order Summary
            </h4>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                <span className="font-medium">Subtotal:</span>
                <span>₹{order.subtotal || order.total}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                <span className="font-medium">Shipping:</span>
                <span>₹{order.shipping || "0.00"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                <span className="font-medium">Tax:</span>
                <span>₹{order.tax || "0.00"}</span>
              </div>
              <div className="mt-4 pt-2 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                <span>Total:</span>
                <span className="text-blue-600 dark:text-blue-400">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button 
              onClick={onClose} 
              className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
            >
              Close
            </button>
            <button 
              onClick={() => onEdit(order)} 
              className="px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium transition-colors flex items-center gap-1"
            >
              Edit Order
            </button>
            {order.status !== "cancelled" && (
              <button 
                onClick={() => onCancel(order)} 
                className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors flex items-center gap-1"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}