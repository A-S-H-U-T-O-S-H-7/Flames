"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firestore/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
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
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order status updated!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleEditClick = (order) => {
    setEditingOrder(order);
  };

  const handleSaveEdit = async () => {
    if (!editingOrder) return;

    try {
      const orderRef = doc(db, "orders", editingOrder.id);
      await updateDoc(orderRef, {
        address: editingOrder.address,
        line_items: editingOrder.line_items,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === editingOrder.id ? editingOrder : order
        )
      );
      setEditingOrder(null);
      toast.success("Order details updated!");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading Orders...</p>;

  return (
    <div className="p-6 bg-white dark:bg-[#1e2737] rounded-xl shadow-lg">
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#22c7d5] text-white">
              <th className="px-4 py-3 text-left">User ID</th>
              <th className="px-4 py-3 text-left">User Name</th>
              <th className="px-4 py-3 text-left">Address</th>
              <th className="px-4 py-3 text-center">Products</th>
              <th className="px-4 py-3 text-center">Total</th>
              <th className="px-4 py-3 text-center">Payment</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <td className="px-4 py-3">{order.uid}</td>
                <td className="px-4 py-3">{order.userName || "N/A"}</td>
                <td className="px-4 py-3">
                  {order.address.fullName}, {order.address.addressLine1}
                </td>
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
                <td className="px-4 py-3 text-center">
                  <select
                    className="border p-1 rounded"
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-4 py-3 flex justify-center gap-3">
                  <button
                    onClick={() => handleEditClick(order)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-all"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Order</h2>
            <label className="block mb-2">Full Name</label>
            <input
              className="border p-2 w-full mb-4"
              value={editingOrder.address.fullName}
              onChange={(e) =>
                setEditingOrder({
                  ...editingOrder,
                  address: { ...editingOrder.address, fullName: e.target.value },
                })
              }
            />
            <label className="block mb-2">Address</label>
            <input
              className="border p-2 w-full mb-4"
              value={editingOrder.address.addressLine1}
              onChange={(e) =>
                setEditingOrder({
                  ...editingOrder,
                  address: { ...editingOrder.address, addressLine1: e.target.value },
                })
              }
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingOrder(null)} className="bg-gray-400 px-3 py-1 rounded-lg">
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="bg-green-500 px-3 py-1 rounded-lg text-white">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
