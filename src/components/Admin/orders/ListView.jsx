"use client"
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firestore/firebase";
import { collection, doc, updateDoc, query, orderBy, onSnapshot, increment, where } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { usePermissions } from '@/context/PermissionContext';
import { getSellerIdFromAdmin } from '@/lib/permissions/sellerPermissions';


import { OrdersTable } from "./OrdersTable";
import { OrderFilters } from "./OrderFilters";
import { OrderSummary } from "./OrderSummary";
import { ViewOrderModal } from "./ViewOrderModal";
import { EditOrderModal } from "./EditOrderModal";
import { CancelOrderModal } from "./CancelOrderModal";

export default function AdminOrdersPage() {
  const { adminData } = usePermissions();
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
  const [pageSize, setPageSize] = useState(10);
const [currentPage, setCurrentPage] = useState(1);


// fetch orders
useEffect(() => {
  const fetchOrders = () => {
    try {
      setLoading(true);
      const ordersRef = collection(db, "orders");
      
      // Build query based on user role
      let q;
      const sellerId = getSellerIdFromAdmin(adminData);
      
      if (sellerId) {
        // Seller: only show orders that contain their products
        // Note: This assumes orders have a sellerId field or line_items with seller info
        // You may need to adjust this based on your data structure
        q = query(
          ordersRef, 
          where("sellerId", "==", sellerId),
          orderBy("createdAt", "desc")
        );
      } else {
        // Admin/Super Admin: show all orders
        q = query(ordersRef, orderBy("createdAt", "desc"));
      }
      
      // Use onSnapshot instead of getDocs for real-time updates
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));
        
        // Additional client-side filtering for sellers if orders contain multiple sellers
        let finalOrdersData = ordersData;
        if (sellerId) {
          finalOrdersData = ordersData.filter(order => {
            // Filter orders that contain products from this seller
            return order.line_items?.some(item => item.sellerId === sellerId) || order.sellerId === sellerId;
          });
        }
        
        setOrders(finalOrdersData);
        setFilteredOrders(finalOrdersData);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
        setLoading(false);
      });
      
      // Return the unsubscribe function to clean up
      return unsubscribe;
    } catch (error) {
      console.error("Error setting up orders listener:", error);
      toast.error("Failed to set up orders listener");
      setLoading(false);
    }
  };

  const unsubscribe = fetchOrders();
  
  // Clean up the subscription when component unmounts
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
}, [adminData]);

  // Apply filters and search
  useEffect(() => {
    let result = [...orders];
    
    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(searchLower) ||
          order.uid?.toLowerCase().includes(searchLower) ||
          order.userName?.toLowerCase().includes(searchLower) ||
          order.address?.fullName?.toLowerCase().includes(searchLower) ||
          order.address?.addressLine1?.toLowerCase().includes(searchLower) ||
          // Search by seller business name
          order.line_items?.some(item => 
            item.sellerBusinessName?.toLowerCase().includes(searchLower) ||
            item.sellerName?.toLowerCase().includes(searchLower) ||
            item.product_data?.metadata?.productSku?.toLowerCase().includes(searchLower)
          ) ||
          // Search in seller groups
          order.sellerGroups?.some(group =>
            group.sellerBusinessName?.toLowerCase().includes(searchLower) ||
            group.sellerName?.toLowerCase().includes(searchLower)
          )
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

const updateOrderStatus = async (orderData, cancellationReason = null) => {
  try {
    const orderRef = doc(db, "orders", orderData.id);
    const updateData = {
      status: orderData.status,
      updatedAt: new Date()
    };
    
    if (cancellationReason && orderData.status === "cancelled") {
      updateData.cancellationReason = cancellationReason;
    }
    
    await updateDoc(orderRef, updateData);
    
    // With onSnapshot, we don't need to manually update the state
    // The onSnapshot listener will automatically update the state
    
    toast.success(`Order status updated to ${orderData.status}`);
    
    // If viewing the same order, update view
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
    // Track product quantity changes to update order counts
    const originalOrder = orders.find(o => o.id === editingOrder.id);
    const productUpdates = {};
    
    // Compare quantities between original and edited order
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
    
    // Update the order first
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
    
    // Then update product order counts if there were changes
    for (const [productId, quantityDiff] of Object.entries(productUpdates)) {
      const productRef = doc(db, "products", productId);
      // Use a transaction or increment to safely update the order count
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
    URL.revokeObjectURL(url);
    
    toast.success("Orders exported successfully!");
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl font-semibold">Loading Orders...</div>
      </div>
    );
  }

  // Add this to calculate paginated orders - place it right before the return statement
const paginatedOrders = filteredOrders.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);

const totalPages = Math.ceil(filteredOrders.length / pageSize);

const handleNextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePrevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

  return (
    <div className=" px-[30px] py-6">
            
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
  filteredOrders={paginatedOrders}
  orders={orders}
  sortConfig={sortConfig}
  handleSort={handleSort}
  handleViewClick={handleViewOrder}
  handleEditClick={handleEditOrder}
  handleCancelOrder={handleCancelOrder}
  updateOrderStatus={updateOrderStatus}
  currentPage={currentPage}
  pageSize={pageSize}
  totalOrders={filteredOrders.length}
  onNextPage={handleNextPage}
  onPrevPage={handlePrevPage}
  onPageSizeChange={setPageSize}
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
  order={orderToCancel}
  setCancelReason={setCancelReason}
  otherReason={otherReason}
  setOtherReason={setOtherReason}
/>
    </div>
  );
}