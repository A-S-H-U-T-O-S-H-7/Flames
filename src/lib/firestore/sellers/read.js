"use client";

import { useEffect, useState } from "react";
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
} from "firebase/firestore";

/**
 * Get single seller by ID
 */
export const getSellerById = async (sellerId) => {
  try {
    const sellerRef = doc(db, "sellers", sellerId);
    const sellerSnap = await getDoc(sellerRef);

    if (sellerSnap.exists()) {
      return {
        success: true,
        data: { id: sellerSnap.id, ...sellerSnap.data() },
      };
    } else {
      return { success: false, error: "Seller not found" };
    }
  } catch (error) {
    console.error("Error getting seller:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get seller by email address
 */
export const getSellerByEmail = async (email) => {
  try {
    const sellersRef = collection(db, "sellers");
    const q = query(sellersRef, where("personalInfo.email", "==", email), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        success: true,
        data: { id: doc.id, ...doc.data() },
      };
    } else {
      // Return success: false but clarify it's just "not found"
      return { success: false, data: null }; // ← Changed this
    }
  } catch (error) {
    console.error("Error getting seller by email:", error);
    return { success: false, error: error.message }; // ← This is actual error
  }
};

/**
 * Get sellers with pagination and filtering
 */
export const getSellers = async ({
  pageLimit = 10,
  lastDoc = null,
  status = null,
} = {}) => {
  try {
    const sellersRef = collection(db, "sellers");
    const constraints = [];

    // Add status filter if provided
    if (status) {
      constraints.push(where("status", "==", status));
    }

    // Always order by creation date
    constraints.push(orderBy("createdAt", "desc"));
    constraints.push(limit(pageLimit));

    // Build query
    let q = query(sellersRef, ...constraints);

    // Add pagination
    if (lastDoc) {
      q = query(sellersRef, ...constraints.slice(0, -1), startAfter(lastDoc), limit(pageLimit));
    }

    const querySnapshot = await getDocs(q);
    const sellers = [];

    querySnapshot.forEach((doc) => {
      sellers.push({ id: doc.id, ...doc.data() });
    });

    return {
      success: true,
      data: sellers,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
    };
  } catch (error) {
    console.error("Error getting sellers:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Search sellers by multiple fields
 */
export const searchSellers = async (searchTerm) => {
  try {
    if (!searchTerm || !searchTerm.trim()) {
      return { success: true, data: [] };
    }

    const sellersRef = collection(db, "sellers");
    const searchLower = searchTerm.toLowerCase();

    // Get all sellers and filter client-side for better search
    const q = query(sellersRef, limit(100));
    const querySnapshot = await getDocs(q);

    const sellers = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const businessName = (data.businessInfo?.businessName || data.businessName || "").toLowerCase();
      const email = (data.personalInfo?.email || data.email || "").toLowerCase();
      const phone = (data.personalInfo?.phone || data.phone || "").toLowerCase();

      if (
        businessName.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchLower)
      ) {
        sellers.push({ id: doc.id, ...data });
      }
    });

    return { success: true, data: sellers };
  } catch (error) {
    console.error("Error searching sellers:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get seller statistics
 */
export const getSellerStats = async () => {
  try {
    const sellersRef = collection(db, "sellers");

    // Get all sellers
    const allSellersQuery = query(sellersRef);
    const allSellersSnapshot = await getDocs(allSellersQuery);

    let totalSellers = 0;
    let activeSellers = 0;
    let pendingSellers = 0;
    let suspendedSellers = 0;
    let rejectedSellers = 0;
    let totalCommissionEarned = 0;
    let totalCommissionRate = 0;

    allSellersSnapshot.forEach((doc) => {
      const seller = doc.data();
      totalSellers++;

      // Count by status
      switch (seller.status) {
        case "approved":
          activeSellers++;
          break;
        case "pending":
          pendingSellers++;
          break;
        case "suspended":
          suspendedSellers++;
          break;
        case "rejected":
          rejectedSellers++;
          break;
      }

      // Calculate commission earnings
      const commission = seller.commission ?? seller.bankDetails?.platformFee ?? 10;
      totalCommissionRate += commission;

      // Calculate total commission earned from orders
      if (seller.totalEarnings) {
        totalCommissionEarned += (seller.totalEarnings * commission) / 100;
      }
    });

    const averageCommission = totalSellers > 0 ? totalCommissionRate / totalSellers : 10;

    return {
      success: true,
      data: {
        totalSellers,
        activeSellers,
        pendingSellers,
        suspendedSellers,
        rejectedSellers,
        totalCommissionEarned,
        averageCommission,
      },
    };
  } catch (error) {
    console.error("Error getting seller stats:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get seller analytics for individual seller
 */
export const getSellerAnalytics = async (sellerId) => {
  try {
    if (!sellerId) {
      throw new Error("Seller ID is required");
    }

    // Get seller data
    const sellerResult = await getSellerById(sellerId);
    if (!sellerResult.success) {
      throw new Error(sellerResult.error);
    }

    // Get seller orders
    const ordersRef = collection(db, "orders");
    const ordersQuery = query(ordersRef, where("sellerId", "==", sellerId), limit(100));
    const ordersSnapshot = await getDocs(ordersQuery);

    const orders = [];
    let totalRevenue = 0;
    let commissionEarned = 0;
    const ordersByStatus = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    ordersSnapshot.forEach((doc) => {
      const order = { id: doc.id, ...doc.data() };
      orders.push(order);

      // Calculate totals
      if (order.status !== "cancelled") {
        totalRevenue += order.total || 0;
      }

      // Calculate commission
      const commission = sellerResult.data.commission ?? sellerResult.data.bankDetails?.platformFee ?? 10;
      if (order.status !== "cancelled") {
        commissionEarned += ((order.total || 0) * commission) / 100;
      }

      // Count by status
      const status = order.status || "pending";
      if (ordersByStatus.hasOwnProperty(status)) {
        ordersByStatus[status]++;
      }
    });

    return {
      seller: sellerResult.data,
      orders,
      totalOrders: orders.length,
      totalRevenue,
      commissionEarned,
      ordersByStatus,
    };
  } catch (error) {
    console.error("Error getting seller analytics:", error);
    throw error;
  }
};

export function useSeller({ email }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      setIsLoading(false);
      return;
    }

    getSellerByEmail(email)
      .then(result => {
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [email]);

  return { data, error, isLoading };
}