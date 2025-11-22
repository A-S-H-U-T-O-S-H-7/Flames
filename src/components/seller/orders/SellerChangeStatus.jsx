"use client";

import { useState, useEffect } from "react";
import { updateOrderStatus } from "@/lib/firestore/orders/write";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firestore/firebase";
import toast from "react-hot-toast";
import { X, AlertTriangle } from 'lucide-react';

// Define customer-focused cancel reasons
const CANCEL_REASONS = [
  "I'm not available to receive the delivery",
  "Delivery time is too long",
  "Found a better price elsewhere",
  "Changed my mind about the product",
  "Ordered by mistake",
  "Need to change delivery address",
  "Need to change payment method",
  "Other"
];

export default function ChangeOrderStatus({ order }) {
  const [currentStatus, setCurrentStatus] = useState(order?.status || "");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  
  // Listen for real-time updates to this order
  useEffect(() => {
    if (!order?.id) return;
    
    const unsubscribe = onSnapshot(doc(db, `orders/${order.id}`), (doc) => {
      if (doc.exists()) {
        const updatedOrder = doc.data();
        setCurrentStatus(updatedOrder.status);
      }
    });
    
    return () => unsubscribe();
  }, [order?.id]);
  
  // Update order status when changed
  const handleChangeStatus = async (status) => {
    try {
      if (!status) {
        toast.error("Please Select Status");
        return;
      }
      
      // If status is cancelled, show modal instead of updating immediately
      if (status === "cancelled") {
        setShowCancelModal(true);
        return;
      }
      
      await toast.promise(
        updateOrderStatus({ id: order?.id, status: status }),
        {
          error: (e) => e?.message,
          loading: "Updating...",
          success: "Successfully Updated",
        }
      );
    } catch (error) {
      toast.error(error?.message);
    }
  };
  
  // Handle cancel confirmation
  const handleConfirmCancel = async () => {
    const finalReason = cancelReason === "Other" ? otherReason : cancelReason;
  
    if (!finalReason) {
      toast.error("Please select or enter a cancellation reason");
      return;
    }
  
    try {
      await toast.promise(
        updateOrderStatus({ 
          id: order?.id, 
          status: "cancelled",
          cancellationReason: finalReason
        }),
        {
          loading: "Cancelling order...",
          success: "Order cancelled successfully",
          error: (err) => err?.message || "Failed to cancel order"
        }
      );
      setShowCancelModal(false);
      setCancelReason("");
      setOtherReason("");
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };
  
  // Get appropriate styling based on status
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return "text-yellow-400 border-yellow-500";
      case 'packed':
        return "text-orange-400 border-orange-500";
      case 'shipped':
        return "text-blue-400 border-blue-500";
      case 'in transit':
        return "text-purple-400 border-purple-500";
      case 'delivered':
        return "text-green-400 border-green-500";
      case 'cancelled':
        return "text-red-400 border-red-500";
      default:
        return "text-gray-400 border-gray-600";
    }
  };
  
  return (
    <div className="relative">
      <select
        value={currentStatus}
        onChange={(e) => {
          handleChangeStatus(e.target.value);
        }}
        name="change-order-status"
        id="change-order-status"
        className={`px-4 py-2 rounded-lg bg-gray-800 border ${getStatusStyles(currentStatus)} appearance-none focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500 w-full`}
      >
        <option value="" className="bg-gray-800 text-gray-300">Update Status</option>
        <option value="pending" className="bg-gray-800 text-yellow-400">Pending</option>
        <option value="packed" className="bg-gray-800 text-orange-400">Packed</option>
        <option value="shipped" className="bg-gray-800 text-blue-400">Shipped</option>
        <option value="in transit" className="bg-gray-800 text-purple-400">In Transit</option>
        <option value="delivered" className="bg-gray-800 text-green-400">Delivered</option>
        <option value="cancelled" className="bg-gray-800 text-red-400">Cancelled</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden w-full max-w-md">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <AlertTriangle className="text-red-500 mr-2" size={20} />
                Cancel Order
              </h3>
              <button onClick={() => {
                setShowCancelModal(false);
                // Reset dropdown to previous value
                setCurrentStatus(order?.status || "");
              }} 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="px-6 py-4">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Please select a reason for cancellation:
              </p>
              
              <div className="space-y-2 mb-4">
                {CANCEL_REASONS.map((reason) => (
                  <div key={reason} className="flex items-center">
                    <input
                      type="radio"
                      id={reason.toLowerCase().replace(/\s+/g, '-')}
                      name="cancelReason"
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={(e) => {
                        setCancelReason(e.target.value);
                        if (e.target.value !== "Other") {
                          setOtherReason("");
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label 
                      htmlFor={reason.toLowerCase().replace(/\s+/g, '-')} 
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      {reason}
                    </label>
                  </div>
                ))}
                
                {cancelReason === "Other" && (
                  <div className="mt-2">
                    <textarea
                      value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                      placeholder="Please specify the reason"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      rows={3}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => {
                    setShowCancelModal(false);
                    // Reset dropdown to previous value
                    setCurrentStatus(order?.status || "");
                  }}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Close
                </button>
                <button 
                  onClick={handleConfirmCancel}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}