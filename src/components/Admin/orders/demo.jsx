"use client";
import React from 'react';
import { Eye, Edit } from 'lucide-react';
import { formatDateTime, getStatusColor } from './OrdersUtil';

export function OrdersTable({
  filteredOrders,
  handleViewClick,
  handleEditClick,
  handleCancelOrder,
  updateOrderStatus
}) {
  return (
    <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          
          <tbody className="divide-y divide-gray-800">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-6 text-center text-gray-400">
                    
                    <p className="text-gray-400 font-medium">No orders found matching your filters.</p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => {
                const { date, time } = formatDateTime(order.createdAt);
                return (
                  <tr key={order.id} className="transition-colors duration-200 bg-gray-900 hover:bg-gray-800">
                    
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewClick(order)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-lg transition-all duration-200 transform hover:scale-105"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditClick(order)}
                          className="bg-amber-600 hover:bg-amber-700 text-white p-1.5 rounded-lg transition-all duration-200 transform hover:scale-105"
                          title="Edit Order"
                        >
                          <Edit size={16} />
                        </button>
                        <select
  className="text-xs border border-gray-700 rounded-lg py-1.5 pl-2 pr-8 bg-gray-800 text-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20"
  value={order.status}
  onChange={(e) => {
    if (e.target.value === "cancelled") {
      handleCancelOrder(order);
    } else {
      updateOrderStatus({ id: order.id, status: e.target.value });
    }
  }}
>
  <option value="pending">Pending</option>
  <option value="shipped">Shipped</option>
  <option value="transit">Transit</option>
  <option value="delivered">Delivered</option>
  <option value="cancelled">Cancel</option>
</select>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>    
    </div>
  );
}



// MainComponent.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import OrderTable from './OrderTable';
import { updateOrderStatus as updateOrderInFirebase } from '../utils/write';

const MainComponent = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  
  // Other state and useEffect code...

  const handleCancelOrder = async (order) => {
    // Show modal or prompt for cancellation reason
    const cancellationReason = prompt("Please enter a reason for cancellation:");
    if (cancellationReason) {
      await updateOrderStatus(order.id, "cancelled", cancellationReason);
    }
  };

  const updateOrderStatus = async (id, status, cancellationReason = null) => {
    try {
      // Call the imported function from write.jsx
      await updateOrderInFirebase(id, status);
      
      // Update local state
      const updateData = {
        status: status,
        updatedAt: new Date(),
      };
      
      if (cancellationReason) {
        updateData.cancellationReason = cancellationReason;
      }
      
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, ...updateData } : order
        )
      );
      
      setFilteredOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, ...updateData } : order
        )
      );
      
      toast.success("Order status updated!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  return (
    <div>
      {/* Other UI components */}
      <OrderTable 
        orders={filteredOrders} 
        handleCancelOrder={handleCancelOrder} 
      />
      {/* More UI components */}
    </div>
  );
};

export default MainComponent;