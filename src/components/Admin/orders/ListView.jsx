"use client"
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firestore/firebase";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { toast } from "react-hot-toast";

import { OrdersTable } from "./OrdersTable";
import { OrderFilters } from "./OrderFilters";
import { OrderSummary } from "./OrderSummary";
import { ViewOrderModal } from "./ViewOrderModal";
import { EditOrderModal } from "./EditOrderModal";
import { CancelOrderModal } from "./CancelOrderModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
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

  // Apply filters and search
  useEffect(() => {
    let result = [...orders];
    
    // Apply search
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.uid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.address?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.address?.addressLine1?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }
    
    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // End of day
      
      result = result.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= fromDate && orderDate <= toDate;
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, dateRange, sortConfig]);



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

  // const confirmCancelOrder = async () => {
  //   if (!orderToCancel) return;
    
  //   const finalReason = cancelReason === "other" 
  //     ? otherReason 
  //     : cancelReason;
      
  //   if (!finalReason) {
  //     toast.error("Please select or enter a cancellation reason");
  //     return;
  //   }
    
  //   await updateOrderStatus({ id: orderToCancel.id, status: "cancelled" }, finalReason);
  //   setShowCancelModal(false);
  //   setOrderToCancel(null);
    
  //   // If viewing the same order, update view
  //   if (viewingOrder && viewingOrder.id === orderToCancel.id) {
  //     setViewingOrder(prev => ({
  //       ...prev,
  //       status: "cancelled",
  //       cancellationReason: finalReason
  //     }));
  //   }
  // };

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

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRange({ from: "", to: "" });
    setSortConfig({ key: "createdAt", direction: "desc" });
  };

  const exportToCSV = () => {
    const headers = ["Order ID", "User Name", "Address", "Products", "Total", "Payment", "Status", "Date", "Time", "Cancellation Reason"];
    
    const csvContent = filteredOrders.map(order => {
      const products = order.line_items.map(item => 
        `${item.product_data.name} (${item.quantity})`
      ).join(", ");
      
      const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A";
      const time = order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : "N/A";
      
      return [
        order.id,
        order.userName || "N/A",
        `${order.address.fullName}, ${order.address.addressLine1}, ${order.address.city}, ${order.address.postalCode}`,
        products,
        order.total,
        order.paymentMode,
        order.status,
        date,
        time,
        order.cancellationReason || "N/A"
      ].join(',');
    });
    
    const csv = [headers, ...csvContent].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revoObjectURL(url);
    
    toast.success("Orders exported successfully!");
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl font-semibold">Loading Orders...</div>
      </div>
    );
  }

  return (
    <div className=" mx-auto px-2 py-6">
            
      <OrderFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        clearFilters={clearFilters}
        exportToCSV={exportToCSV}
      />
      
      <OrderSummary orders={orders} />
      
      <OrdersTable
        filteredOrders={filteredOrders}
        orders={orders}
        sortConfig={sortConfig}
        handleSort={handleSort}
        handleViewClick={handleViewOrder}
        handleEditClick={handleEditOrder}
        handleCancelOrder={handleCancelOrder}
        // updateOrderStatus={updateOrderStatus}
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
        // onConfirm={confirmCancelOrder}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        otherReason={otherReason}
        setOtherReason={setOtherReason}
      />
    </div>
  );
}