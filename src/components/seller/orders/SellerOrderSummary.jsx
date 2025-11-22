"use client";
import React from "react";

export function OrderSummary({ orders }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      <div className="bg-white border border-gray-600 dark:bg-gray-800 p-4 rounded-lg shadow text-center">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Total Orders
        </div>
        <div className="text-2xl font-bold text-gray-800 dark:text-white">
          {orders.length}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-600 dark:bg-yellow-900/30 p-4 rounded-lg shadow text-center">
        <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">
          Pending
        </div>
        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
          {orders.filter(o => o.status === "pending").length}
        </div>
      </div>
      <div className="bg-purple-50 border border-purple-600 dark:bg-purple-900/30 p-4 rounded-lg shadow text-center">
        <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">
          Packed
        </div>
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {orders.filter(o => o.status === "packed").length}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-600 dark:bg-blue-900/30 p-4 rounded-lg shadow text-center">
        <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">
          Shipped/Transit
        </div>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {
            orders.filter(
              o => o.status === "shipped" || o.status === "in transit"
            ).length
          }
        </div>
      </div>

      <div className="bg-green-50 border border-green-600 dark:bg-green-900/30 p-4 rounded-lg shadow text-center">
        <div className="text-sm text-green-600 dark:text-green-400 mb-1">
          Delivered
        </div>
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
          {orders.filter(o => o.status === "delivered").length}
        </div>
      </div>

      <div className="bg-red-50 border border-red-600 dark:bg-red-900/30 p-4 rounded-lg shadow text-center">
        <div className="text-sm text-red-600 dark:text-red-400 mb-1">
          Cancelled
        </div>
        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
          {orders.filter(o => o.status === "cancelled").length}
        </div>
      </div>
    </div>
  );
}
