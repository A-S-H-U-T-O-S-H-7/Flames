// lib/firestore/payments/sellerPayments.js
"use client";

import { useSellerOrders } from "../sellerOrders/read";

/**
 * Hook to get seller's payment transactions (virtual)
 * Only shows current seller's data
 */
export function useSellerPayments({ sellerId }) {
  // Get ALL orders for the seller to show proper payment status
  const { data: orders = [], isLoading, error } = useSellerOrders({ 
    sellerId,
    pageLimit: 100
  });

  // Transform seller orders to payment view
  const payments = orders.map(order => {
    const isCOD = order.paymentMode === 'cod';
    const isPrepaid = order.paymentMode === 'prepaid';
    
    // Determine payment status based on order & payment status
    let paymentStatus = 'pending';
    
    if (isPrepaid && order.paymentStatus === 'paid') {
      paymentStatus = 'paid';
    } else if (isCOD && order.status === 'delivered') {
      paymentStatus = 'collected'; // COD money collected after delivery
    } else if (order.status === 'cancelled') {
      paymentStatus = 'failed';
    }

    // Get customer name from address.fullName
    const customerName = order.address?.fullName || 'Customer';

    return {
      // Payment ID (virtual)
      id: `pay_${order.id}`,
      orderId: order.id,
      
      // Payment Details
      transactionId: order.transactionId || (isCOD ? `cod_${order.id}` : `prepaid_${order.id}`),
      paymentMode: order.paymentMode,
      paymentMethod: isCOD ? 'Cash on Delivery' : 
                   order.paymentDetails?.method === 'upi' ? 'UPI' :
                   order.paymentDetails?.method === 'card' ? 'Card' : 'Online Payment',
      
      // Amounts
      grossAmount: order.sellerTotal || 0,
      sellerEarnings: order.sellerTotal || 0,
      
      // Status
      status: paymentStatus,
      orderStatus: order.status, // Keep for reference
      
      // Customer & Timing
      customerName: customerName,
      customerId: order.uid,
      timestampCreate: order.createdAt || order.timestampCreate,
    };
  });

  return { data: payments, isLoading, error };
}