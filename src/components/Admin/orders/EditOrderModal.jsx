"use client";
import React, { useState, useEffect } from 'react';
import { X, Trash2, CreditCard, Package, Mail, Calendar } from 'lucide-react';

export function EditOrderModal({
  order,
  onClose,
  onSave,
  onChange
}) {
  if (!order) return null;
  
  const [discount, setDiscount] = useState(order.discount || 0);
  const [discountPercent, setDiscountPercent] = useState(0);
  
  // Calculate subtotal from line items
  const calculateSubtotal = () => {
    return order.line_items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Calculate and update discount percentage whenever discount or subtotal changes
  useEffect(() => {
    const subtotal = calculateSubtotal();
    const percentage = subtotal > 0 ? ((discount / subtotal) * 100).toFixed(2) : 0;
    setDiscountPercent(percentage);
  }, [discount, order.line_items]);
  
  // Handle discount input change
  const handleDiscountChange = (value) => {
    const numValue = parseFloat(value) || 0;
    setDiscount(numValue);
    
    // Update the order with new discount
    const updatedOrder = {
      ...order,
      discount: numValue,
      total: calculateSubtotal() - numValue
    };
    
    onChange(updatedOrder);
  };
  
  // Toggle payment method
  const togglePaymentMethod = () => {
    const newPaymentMode = order.paymentMode === "COD" ? "Prepaid" : "COD";
    onChange({
      ...order,
      paymentMode: newPaymentMode
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar border border-gray-200 dark:border-gray-700">
        {/* Header - Changed from amber/orange to blue */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="h-5 w-5" /> Edit Order
          </h3>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="px-6 py-6 space-y-6">
          {/* Customer Info */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" /> Customer Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={order.address?.fullName || ""}
                  onChange={(e) => onChange({
                    ...order,
                    address: { ...order.address, fullName: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={order.address?.mobile || ""}
                  onChange={(e) => onChange({
                    ...order,
                    address: { ...order.address, mobile: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={order.address?.email || ""}
                  onChange={(e) => onChange({
                    ...order,
                    address: { ...order.address, email: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address Line
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={order.address?.addressLine1 || ""}
                  onChange={(e) => onChange({
                    ...order,
                    address: { ...order.address, addressLine1: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={order.address?.city || ""}
                  onChange={(e) => onChange({
                    ...order,
                    address: { ...order.address, city: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pin Code
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={order.address?.pincode || ""}
                  onChange={(e) => onChange({
                    ...order,
                    address: { ...order.address, pincode: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>
          
          {/* Order Info */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-500" /> Order Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order ID
                </label>
                <div className="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 font-mono text-sm">
                  {order.id}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <div className="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={order.status || "pending"}
                  onChange={(e) => onChange({
                    ...order,
                    status: e.target.value
                  })}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method
                </label>
                <div className="flex items-center">
                  <button
                    onClick={togglePaymentMethod}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center ${
                      order.paymentMode === "COD" 
                        ? "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700" 
                        : "bg-green-50 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
                    }`}
                  >
                    <span>{order.paymentMode || "COD"}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700">
                      Click to toggle
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" /> Order Items
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {order.line_items.map((item, index) => (
                <div key={index} className="p-4 grid grid-cols-12 gap-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  {/* Product Image & ID */}
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
                    <div className="mt-auto grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Price: </span>
                        <span className="font-medium">₹{item.price}</span>
                      </div>
                      <div className="text-sm flex items-center">
                        <span className="text-gray-500 dark:text-gray-400 mr-2">Qty: </span>
                        <input
                          type="number"
                          min="1"
                          className="w-16 px-2 py-1 border rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1;
                            const updatedItems = [...order.line_items];
                            updatedItems[index] = {
                              ...item,
                              quantity: newQuantity
                            };
                            onChange({
                              ...order,
                              line_items: updatedItems,
                              total: calculateSubtotal() - discount
                            });
                          }}
                        />
                      </div>
                      <div className="text-sm flex items-center justify-end">
                        <span className="text-gray-500 dark:text-gray-400 mr-2">Total: </span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">₹{(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => {
                            const updatedItems = order.line_items.filter((_, i) => i !== index);
                            onChange({
                              ...order,
                              line_items: updatedItems,
                              total: calculateSubtotal() - discount
                            });
                          }}
                          className="ml-3 text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary with Discount */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-500" /> Order Summary
            </h4>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                <span className="font-medium">Subtotal:</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                <span className="font-medium">Shipping:</span>
                <span>₹{order.shipping || "0.00"}</span>
              </div>
              {/* New Discount Field */}
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Discount:</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {discountPercent}%
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 mr-2">₹</span>
                  <input
                    type="number"
                    min="0"
                    max={calculateSubtotal()}
                    step="0.01"
                    className="w-24 px-2 py-1 border rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={discount}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                <span className="font-medium">Tax:</span>
                <span>₹{order.tax || "0.00"}</span>
              </div>
              <div className="mt-4 pt-2 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                <span>Total:</span>
                <span className="text-blue-600 dark:text-blue-400">₹{(calculateSubtotal() - discount).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onSave}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 font-medium transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}