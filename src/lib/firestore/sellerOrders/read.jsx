"use client";

import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getDoc,
  doc,
  getCountFromServer,
  onSnapshot
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";
import useSWR from "swr";

/**
 * Hook to get seller's orders in real-time
 * BLAZING FAST - Direct collection access, no filtering needed
 */
export function useSellerOrders({ 
  sellerId, 
  pageLimit = 10, 
  lastSnapDoc = null,
  status = null 
} = {}) {
  const { data, error } = useSWRSubscription(
    ["sellerOrders", sellerId, pageLimit, lastSnapDoc, status],
    ([path, sellerId, pageLimit, lastSnapDoc, status], { next }) => {
      if (!sellerId) {
        next(null, { list: [], lastSnapDoc: null });
        return () => {};
      }

      // Direct path to seller's orders - NO filtering needed!
      const ref = collection(db, "sellerOrders", sellerId, "orders");
      let constraints = [orderBy("createdAt", "desc"), limit(pageLimit)];

      // Optional status filter
      if (status) {
        constraints.unshift(where("status", "==", status));
      }

      if (lastSnapDoc) {
        constraints.push(startAfter(lastSnapDoc));
      }

      const q = query(ref, ...constraints);

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const orders = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          next(null, {
            list: orders,
            lastSnapDoc: snapshot.docs[snapshot.docs.length - 1] || null,
          });
        },
        (err) => {
          console.error("Error fetching seller orders:", err);
          next(err, null);
        }
      );

      return () => unsub();
    }
  );

  return {
    data: data?.list || [],
    lastSnapDoc: data?.lastSnapDoc,
    error: error?.message,
    isLoading: !data && !error,
  };
}

/**
 * Hook to get seller's order count
 */
export function useSellerOrdersCount({ sellerId, status = null } = {}) {
  const fetcher = async ([path, sellerId, status]) => {
    if (!sellerId) return 0;

    const ref = collection(db, "sellerOrders", sellerId, "orders");
    let q = query(ref);

    if (status) {
      q = query(ref, where("status", "==", status));
    }

    const countSnapshot = await getCountFromServer(q);
    return countSnapshot.data().count;
  };

  const { data, error, isLoading } = useSWR(
    ["sellerOrdersCount", sellerId, status],
    fetcher
  );

  return {
    count: data || 0,
    error: error?.message,
    isLoading,
  };
}

/**
 * Hook to get a single seller order
 */
export function useSellerOrder({ sellerId, orderId } = {}) {
  const { data, error } = useSWRSubscription(
    ["sellerOrder", sellerId, orderId],
    ([path, sellerId, orderId], { next }) => {
      if (!sellerId || !orderId) {
        next(null, null);
        return () => {};
      }

      const ref = doc(db, "sellerOrders", sellerId, "orders", orderId);

      const unsub = onSnapshot(
        ref,
        (snapshot) => {
          if (!snapshot.exists()) {
            next(new Error("Order not found"), null);
            return;
          }

          next(null, { id: snapshot.id, ...snapshot.data() });
        },
        (err) => next(err, null)
      );

      return () => unsub();
    }
  );

  return {
    data: data,
    error: error?.message,
    isLoading: data === undefined && !error,
  };
}

/**
 * Get seller order statistics
 */
export async function getSellerOrderStats(sellerId) {
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }

  const ordersRef = collection(db, "sellerOrders", sellerId, "orders");
  
  // Get all orders for stats calculation
  const allOrdersQuery = query(ordersRef);
  const allOrdersSnapshot = await getDocs(allOrdersQuery);

  const stats = {
    totalOrders: 0,
    totalRevenue: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    multiSellerOrders: 0,
  };

  allOrdersSnapshot.forEach((doc) => {
    const order = doc.data();
    stats.totalOrders++;

    // Calculate revenue (only for non-cancelled orders)
    if (order.status !== "cancelled") {
      stats.totalRevenue += order.sellerTotal || 0;
    }

    // Count by status
    const status = order.status || "pending";
    if (stats.hasOwnProperty(status)) {
      stats[status]++;
    }

    // Track multi-seller orders
    if (order.isMultiSellerOrder) {
      stats.multiSellerOrders++;
    }
  });

  return stats;
}

/**
 * Server-side function to get seller orders (for SSR)
 */
export async function getSellerOrders({ 
  sellerId, 
  pageLimit = 10, 
  status = null 
}) {
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }

  const ref = collection(db, "sellerOrders", sellerId, "orders");
  let constraints = [orderBy("createdAt", "desc"), limit(pageLimit)];

  if (status) {
    constraints.unshift(where("status", "==", status));
  }

  const q = query(ref, ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    // Serialize timestamps
    createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
  }));
}

/**
 * Server-side function to get a single seller order
 */
export async function getSellerOrder({ sellerId, orderId }) {
  if (!sellerId || !orderId) {
    throw new Error("Seller ID and Order ID are required");
  }

  const orderRef = doc(db, "sellerOrders", sellerId, "orders", orderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) {
    return null;
  }

  return {
    id: orderSnap.id,
    ...orderSnap.data(),
    // Serialize timestamps
    createdAt: orderSnap.data().createdAt?.toDate?.() || orderSnap.data().createdAt,
  };
}
