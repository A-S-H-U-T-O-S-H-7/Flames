"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firestore/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { CircularProgress } from "@nextui-org/react";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="flex justify-center mt-10"><CircularProgress /></div>;

  return (
    <div className="p-6 bg-white dark:bg-[#1e2737] rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#22c7d5] text-white">
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Address</th>
              <th className="px-4 py-3 text-center">Products</th>
              <th className="px-4 py-3 text-center">Total</th>
              <th className="px-4 py-3 text-center">Payment</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                  <td className="px-4 py-3">{order.id}</td>
                  <td className="px-4 py-3">{order.address.fullName}, {order.address.addressLine1}</td>
                  <td className="px-4 py-3">
                    {order.line_items.map((item, index) => (
                      <div key={index} className="mb-2">
                        <p>{item.product_data.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <img
                          src={item.product_data.images[0]}
                          alt={item.product_data.name}
                          className="w-10 h-10 rounded-md"
                        />
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-center">₹{order.total}</td>
                  <td className="px-4 py-3 text-center uppercase">{order.paymentMode}</td>
                  <td className="px-4 py-3 text-center capitalize font-medium">{order.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}