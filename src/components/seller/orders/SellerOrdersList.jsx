// components/seller/orders/SellerOrdersPage.jsx
"use client"
import React, { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firestore/firebase";
import { collection, doc, updateDoc, query, orderBy, onSnapshot, increment, where } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useAuth } from '@/context/AuthContext';
import { useSeller } from '@/lib/firestore/sellers/read';
import { useSellerOrders } from '@/lib/firestore/sellerOrders/read';
import { updateSellerOrderStatus } from '@/lib/firestore/sellerOrders/write';

import OrdersTable from "./SellerOrderTable";
import OrderFilters from "./SellerOrderFilters";
import { OrderSummary } from "./SellerOrderSummary";
import { ViewOrderModal } from "./SellerViewModal";
import { EditOrderModal } from "./SellerEditOrder";
import { CancelOrderModal } from "./SellerCancelModal";

export default function SellerOrdersPage() {
  const { user } = useAuth();
  const { data: seller, isLoading: sellerLoading } = useSeller({ email: user?.email });
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [orderToCancel, setOrderToCancel] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filters state
  const [filters, setFilters] = useState({
    status: 'all',
    paymentMode: 'all',
    dateFrom: '',
    dateTo: ''
  });

  // Get sellerId from seller data
  const sellerId = seller?.id || null;
  
  // Fetch orders using new seller-specific collection
  const { data: sellerOrders = [], isLoading, error } = useSellerOrders({ 
    sellerId: sellerId,
    pageLimit: 1000
  });
  
  // Process orders directly with useMemo - no state needed
  const orders = useMemo(() => {
    if (!sellerOrders || sellerOrders.length === 0) return [];
    
    return sellerOrders.map(order => ({
      ...order,
      createdAt: order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt)
    }));
  }, [sellerOrders]);
  
  // Show loading state
  const loading = sellerLoading || isLoading;

  // Apply filters and search - use useMemo instead of useEffect
  const filteredOrders = useMemo(() => {
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
    if (filters.status !== "all") {
      result = result.filter((order) => order.status === filters.status);
    }
    
    // Apply payment mode filter
    if (filters.paymentMode !== "all") {
      result = result.filter((order) => order.paymentMode === filters.paymentMode);
    }
    
    // Apply date range filter
    if (filters.dateFrom && filters.dateTo) {
      const fromDate = new Date(filters.dateFrom);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      
      result = result.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= fromDate && orderDate <= toDate;
      });
    }
    
    // Sort by creation date in descending order (newest first)
    result.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB - dateA;
    });
    
    return result;
  }, [orders, searchTerm, filters]);

  // Pagination
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  const updateOrderStatus = async (orderData, cancellationReason = null) => {
    try {
      // Use seller order update function (syncs BOTH /orders + /sellerOrders + wallet)
      await updateSellerOrderStatus({
        sellerId: sellerId,
        orderId: orderData.id,
        status: orderData.status,
        note: cancellationReason || ""
      });
      
      toast.success(`Order status updated to ${orderData.status}`);
      
      if (viewingOrder && viewingOrder.id === orderData.id) {
        setViewingOrder(prev => ({
          ...prev,
          status: orderData.status,
          ...(cancellationReason && orderData.status === "cancelled" ? { cancellationReason } : {})
        }));
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status.");
    }
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;
    
    const finalReason = cancelReason === "Other" 
      ? otherReason 
      : cancelReason;
      
    if (!finalReason) {
      toast.error("Please select or enter a cancellation reason");
      return;
    }
    
    await updateOrderStatus({ id: orderToCancel.id, status: "cancelled" }, finalReason);
    handleCloseCancelModal();
  };

  const handleSaveEdit = async () => {
    if (!editingOrder) return;

    try {
      const originalOrder = orders.find(o => o.id === editingOrder.id);
      const productUpdates = {};
      
      editingOrder.line_items.forEach(editedItem => {
        const originalItem = originalOrder.line_items.find(
          item => item.product_data.metadata.productId === editedItem.product_data.metadata.productId
        );
        
        if (originalItem && editedItem.quantity !== originalItem.quantity) {
          const productId = editedItem.product_data.metadata.productId;
          const quantityDiff = editedItem.quantity - originalItem.quantity;
          productUpdates[productId] = quantityDiff;
        }
      });
      
      const orderRef = doc(db, "orders", editingOrder.id);
      await updateDoc(orderRef, {
        address: editingOrder.address,
        line_items: editingOrder.line_items,
        paymentMode: editingOrder.paymentMode,
        paymentStatus: editingOrder.paymentMode === "COD" ? "Pending" : "Paid",
        discount: editingOrder.discount || 0,
        total: editingOrder.total,
        updatedAt: new Date()
      });
      
      for (const [productId, quantityDiff] of Object.entries(productUpdates)) {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, {
          orders: increment(quantityDiff)
        });
      }
      
      setEditingOrder(null);
      toast.success("Order details updated!");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order.");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      status: 'all',
      paymentMode: 'all',
      dateFrom: '',
      dateTo: ''
    });
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
    URL.revokeObjectURL(url);
    
    toast.success("Orders exported successfully!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div>
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
                Order Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm sm:text-base">
                Manage and track your customer orders
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <OrderFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFilterChange={setFilters}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onClearFilters={clearFilters}
            onExportCSV={exportToCSV}
          />
        </div>

        {/* Order Summary */}
        <div className="mb-6">
          <OrderSummary orders={orders} />
        </div>

        {/* Orders Table */}
        <OrdersTable
          orders={currentOrders}
          loading={loading}
          onView={handleViewOrder}
          onEdit={handleEditOrder}
          onCancel={handleCancelOrder}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
        
        {/* Modals */}
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
          order={orderToCancel}
          setCancelReason={setCancelReason}
          otherReason={otherReason}
          setOtherReason={setOtherReason}
        />
    </div>
  );
}
