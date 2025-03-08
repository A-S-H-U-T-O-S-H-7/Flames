"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firestore/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { CircularProgress } from "@nextui-org/react";
import Link from "next/link";
import { FaCheckCircle, FaShippingFast, FaBox, FaHourglassHalf, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";
import { WhatsAppSupport } from "./WhatsappSupport";
import { OrderDetails } from "./OrderDetails";
import { OrderItem } from "./OrderItem";

// Helper function to get status color - extracted to avoid repetition
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "shipped": return "bg-blue-100 text-blue-800";
    case "transit": return "bg-purple-100 text-purple-800";
    case "delivered": return "bg-green-100 text-green-800";
    case "cancelled": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const OrderStatus = ({ status }) => {
  const statuses = ["pending", "shipped", "transit", "delivered"];
  const statusIndex = statuses.indexOf(status.toLowerCase());
  
  const statusIcons = {
    pending: <FaHourglassHalf className="text-yellow-500" />,
    shipped: <FaBox className="text-blue-500" />,
    transit: <FaShippingFast className="text-purple-500" />,
    delivered: <FaCheckCircle className="text-green-500" />
  };

  if (status.toLowerCase() === "delivered") return null;
  if (status.toLowerCase() === "cancelled") {
    return (
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-gray-700 mb-2">Order Status</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>Cancelled</span>
        <p className="text-sm text-gray-600 mt-2">This order has been cancelled.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-700 mb-2">Order Status</h3>
      <div className="mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="relative mb-6">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          {statuses.map((s, i) => (
            <div key={i} className="flex flex-col items-center" style={{ width: "60px" }}>
              <div className={`mb-2 ${statusIndex >= i ? "text-blue-600" : "text-gray-400"}`}>{statusIcons[s]}</div>
              <div className={`capitalize text-center ${statusIndex >= i ? "font-medium" : ""}`}>{s}</div>
            </div>
          ))}
        </div>
        <div className="relative h-3 bg-gray-200 rounded-full mt-2 overflow-hidden">
          <div 
            className={`absolute top-0 left-0 h-3 rounded-full ${
              statusIndex < statuses.length - 1 ? "bg-gradient-to-r from-blue-500 to-blue-400 animate-pulse" : "bg-green-500"
            }`}
            style={{ width: `${(statusIndex + 1) * 25}%` }}
          ></div>
          {statuses.map((s, i) => (
            <div 
              key={i} 
              className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center ${
                statusIndex >= i 
                  ? i === statusIndex ? "bg-white border-2 border-blue-500 shadow-md" : "bg-blue-500"
                  : "bg-white border-2 border-gray-300"
              }`}
              style={{ left: `calc(${i * 25}% - ${i > 0 ? "10px" : "0px"})`, zIndex: 10, transition: "all 0.3s ease" }}
            >
              {statusIndex === i && <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EmptyOrders = () => (
  <div className="bg-white rounded-lg shadow-md p-8 text-center">
    <div className="text-gray-400 text-5xl mb-4 flex justify-center"><FaBox /></div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h3>
    <p className="text-gray-600 mb-6">You don't have any orders yet. Start shopping to see your orders here.</p>
    <Link href="/products" className="inline-block px-6 py-3 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all">
      Start Shopping
    </Link>
  </div>
);

// Order Cancellation Popup component
const CancellationPopup = ({ onCancel, onClose, orderId }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onCancel(orderId, reason);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FaExclamationTriangle className="text-yellow-500 mr-2" />
              Cancel Order
            </h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <FaTimesCircle className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            
            <div className="mt-4">
              <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700">
                Reason for cancellation (optional)
              </label>
              <select
                id="cancelReason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select a reason</option>
                <option value="Changed my mind">Changed my mind</option>
                <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Shipping takes too long">Shipping takes too long</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row-reverse gap-2">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Cancel Order"
              )}
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto mt-3 sm:mt-0 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Keep Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Orders Component - Enhanced with inline popups
export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupOrderId, setPopupOrderId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "orders"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  // Function to handle order cancellation
  const handleCancelOrder = (orderId, reason) => {
    // Update the orders state with the cancelled order
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: "cancelled", cancellationReason: reason || "Not specified" } 
        : order
    ));
    
    // Close the popup
    setPopupOrderId(null);
    
    // Here you would also update the order status in your database
    console.log(`Order ${orderId} cancelled with reason: ${reason || "Not specified"}`);
    
    // You might want to show a success notification here
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <CircularProgress size="lg" />
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">      
      {orders.length > 0 ? (
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="relative bg-white rounded-lg shadow-md overflow-hidden p-5">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">
                  Ordered on {new Date(order.createdAt?.toDate()).toLocaleDateString()}
                </p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Items</h3>
                <div className="flex flex-wrap gap-4">
                  {order.line_items.map((item, index) => (
                    <OrderItem key={index} item={item} />
                  ))}
                </div>
              </div>
              
              <div className="border-b border-gray-200 pb-4 mb-4">
                <OrderDetails order={order} />
              </div>
              
              <OrderStatus status={order.status} />
              
              <div className="mt-4 flex flex-wrap gap-2 justify-end items-center">
                {order.status.toLowerCase() === "cancelled" && (
                  <div className="flex-grow">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Cancellation reason:</span> {order.cancellationReason || "Not specified"}
                    </p>
                  </div>
                )}
                
                {order.status.toLowerCase() === "delivered" && (
                  <Link 
                    href={`/products/${order.line_items[0].product_id}?rate=true`}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all"
                  >
                    Rate this Purchase
                  </Link>
                )}
                
                {order.status.toLowerCase() === "delivered" && (
                  <Link 
                    href={`/products/${order.line_items[0].product_id}`}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-all"
                  >
                    Buy Again
                  </Link>
                )}
                
                {order.status.toLowerCase() === "pending" && (
                  <button 
                    onClick={() => setPopupOrderId(order.id)}
                    className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-all flex items-center space-x-1"
                  >
                    <FaTimesCircle className="mr-1" />
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyOrders />
      )}
      
      {/* Cancellation Popup */}
      {popupOrderId && (
        <CancellationPopup 
          orderId={popupOrderId}
          onCancel={handleCancelOrder}
          onClose={() => setPopupOrderId(null)}
        />
      )}
      
      <WhatsAppSupport/>
    </div>
  );
}