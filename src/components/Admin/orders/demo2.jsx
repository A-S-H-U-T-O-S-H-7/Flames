"use client"
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firestore/firebase";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { toast } from "react-hot-toast";

import { ViewOrderModal } from "./ViewOrderModal";
import { EditOrderModal } from "./EditOrderModal";
import { CancelOrderModal } from "./CancelOrderModal";
import { OrdersTable } from "./demo";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [orderToCancel, setOrderToCancel] = useState(null);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));
        setOrders(ordersData);
        setFilteredOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  

  const updateOrderStatus = async (orderId, newStatus, cancellationReason = null) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const updateData = { 
        status: newStatus,
        updatedAt: new Date()
      };
      
      if (cancellationReason) {
        updateData.cancellationReason = cancellationReason;
      }
      
      await updateDoc(orderRef, updateData);
      
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { 
            ...order, 
            status: newStatus,
            ...(cancellationReason && { cancellationReason })
          } : order
        )
      );
      
      toast.success("Order status updated!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
  };

  const handleViewOrder = (order) => {
    setViewingOrder(order);
  };

  const handleCloseEditModal = () => {
    setEditingOrder(null);
  };

  const handleCloseViewModal = () => {
    setViewingOrder(null);
  };

  const handleCancelOrder = (order) => {
    setOrderToCancel(order);
    setCancelReason("");
    setOtherReason("");
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setOrderToCancel(null);
    setCancelReason("");
    setOtherReason("");
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;
    
    const finalReason = cancelReason === "other" 
      ? otherReason 
      : cancelReason;
      
    if (!finalReason) {
      toast.error("Please select or enter a cancellation reason");
      return;
    }
    
    await updateOrderStatus(orderToCancel.id, "cancelled", finalReason);
    setShowCancelModal(false);
    setOrderToCancel(null);
    
    // If viewing the same order, update view
    if (viewingOrder && viewingOrder.id === orderToCancel.id) {
      setViewingOrder(prev => ({
        ...prev,
        status: "cancelled",
        cancellationReason: finalReason
      }));
    }
  };

  const handleSaveEdit = async () => {
    if (!editingOrder) return;

    try {
      const orderRef = doc(db, "orders", editingOrder.id);
      await updateDoc(orderRef, {
        address: editingOrder.address,
        line_items: editingOrder.line_items,
        updatedAt: new Date()
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

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  return (
    <div className=" mx-auto px-2 py-6">  
      <OrdersTable
        filteredOrders={filteredOrders}
        orders={orders}
        sortConfig={sortConfig}
        handleSort={handleSort}
        handleViewClick={handleViewOrder}
        handleEditClick={handleEditOrder}
        handleCancelOrder={handleCancelOrder}
        updateOrderStatus={updateOrderStatus}
      />
      
      <ViewOrderModal
        order={viewingOrder}
        onClose={handleCloseViewModal}
        onEdit={(order) => {
          setViewingOrder(null);
          handleEditOrder(order);
        }}
        onCancel={(order) => {
          setViewingOrder(null);
          handleCancelOrder(order);
        }}
      />
      
      <EditOrderModal
        order={editingOrder}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
        onChange={setEditingOrder}
      /> 
      <CancelOrderModal
        show={showCancelModal}
        onClose={handleCloseCancelModal}
        onConfirm={confirmCancelOrder}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        otherReason={otherReason}
        setOtherReason={setOtherReason}
      />
    </div>
  );
}