// components/seller/payments/SellerPaymentsPage.jsx
"use client"
import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from '@/context/AuthContext';
import { useSeller } from '@/lib/firestore/sellers/read';
import { useSellerPayments } from "@/lib/firestore/payments/sellerPayment";

import PaymentsTable from "./SellerPaymentTable";
import PaymentFilters from "./SellerPaymentFilters";
import { PaymentSummary } from "./SellerPaymentSummary";

export default function SellerPaymentsPage() {
  const { user } = useAuth();
  const { data: seller, isLoading: sellerLoading } = useSeller({ email: user?.email });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Filters state
  const [filters, setFilters] = useState({
    status: 'all',
    paymentMode: 'all',
    dateFrom: '',
    dateTo: ''
  });

  const sellerId = seller?.id;

  // Use seller-specific payments hook
  const { data: payments = [], isLoading: paymentsLoading } = useSellerPayments({
    sellerId
  });

  const loading = sellerLoading || paymentsLoading;

  // Apply filters and search
  const filteredPayments = useMemo(() => {
    let result = [...payments];
    
    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(payment =>
        payment.orderId?.toLowerCase().includes(term) ||
        payment.transactionId?.toLowerCase().includes(term) ||
        payment.customerName?.toLowerCase().includes(term)
      );
    }
    
    // Status filter
    if (filters.status !== 'all') {
      result = result.filter(payment => payment.status === filters.status);
    }
    
    // Payment mode filter
    if (filters.paymentMode !== 'all') {
      result = result.filter(payment => payment.paymentMode === filters.paymentMode);
    }
    
    // Date range filter
    if (filters.dateFrom && filters.dateTo) {
      const fromDate = new Date(filters.dateFrom);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      
      result = result.filter(payment => {
        const paymentDate = new Date(payment.timestampCreate);
        return paymentDate >= fromDate && paymentDate <= toDate;
      });
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.timestampCreate) - new Date(a.timestampCreate));
    
    return result;
  }, [payments, searchTerm, filters]);

  // Pagination
  const totalItems = filteredPayments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handlePageChange = (page) => setCurrentPage(page);

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      status: 'all',
      paymentMode: 'all',
      dateFrom: '',
      dateTo: ''
    });
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = ["Order ID", "Transaction ID", "Customer", "Amount", "Payment Method", "Status", "Date"];
    
    const csvContent = filteredPayments.map(payment => {
      const date = payment.timestampCreate ? new Date(payment.timestampCreate).toLocaleDateString() : "N/A";
      
      return [
        payment.orderId,
        payment.transactionId,
        payment.customerName,
        payment.grossAmount,
        payment.paymentMethod,
        payment.status,
        date
      ].join(',');
    });
    
    const csv = [headers, ...csvContent].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-payments-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Payments exported successfully!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!sellerId && !sellerLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">Seller profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
          Payment Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Track your payment transactions and earnings
        </p>
      </div>

      {/* Search and Filters */}
      <PaymentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFilterChange={setFilters}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClearFilters={clearFilters}
        onExportCSV={exportToCSV}
      />

      {/* Payment Summary */}
      <PaymentSummary payments={payments} />

      {/* Payments Table */}
      <PaymentsTable
        payments={currentPayments}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}