"use client";
import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export function CancelOrderModal({
  show,
  onClose,
  onConfirm,
  cancelReason,
  setCancelReason,
  otherReason,
  setOtherReason
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden w-full max-w-md">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <AlertTriangle className="text-red-500 mr-2" size={20} />
            Cancel Order
          </h3>
          <button onClick={onClose} 
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
            <div className="flex items-center">
              <input
                type="radio"
                id="out-of-stock"
                name="cancelReason"
                value="Out of stock"
                checked={cancelReason === "Out of stock"}
                onChange={(e) => setCancelReason(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="out-of-stock" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Out of stock
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="customer-request"
                name="cancelReason"
                value="Customer requested cancellation"
                checked={cancelReason === "Customer requested cancellation"}
                onChange={(e) => setCancelReason(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="customer-request" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Customer requested cancellation
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="address-issue"
                name="cancelReason"
                value="Delivery address issue"
                checked={cancelReason === "Delivery address issue"}
                onChange={(e) => setCancelReason(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="address-issue" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Delivery address issue
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="payment-issue"
                name="cancelReason"
                value="Payment issue"
                checked={cancelReason === "Payment issue"}
                onChange={(e) => setCancelReason(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="payment-issue" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Payment issue
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="other"
                name="cancelReason"
                value="other"
                checked={cancelReason === "other"}
                onChange={(e) => setCancelReason(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="other" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Other reason
              </label>
            </div>
            
            {cancelReason === "other" && (
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
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Close
            </button>
            <button 
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}