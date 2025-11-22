"use client";

import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  onSnapshot
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

/**
 * Real-time hook to get seller's withdrawal requests
 */
export function useSellerWithdrawals({ sellerId, status = null, limitCount = 50 }) {
  const { data, error } = useSWRSubscription(
    ["sellerWithdrawals", sellerId, status, limitCount],
    ([path, sellerId, status, limitCount], { next }) => {
      if (!sellerId) {
        next(null, []);
        return () => {};
      }

      const withdrawalsRef = collection(db, "withdrawalRequests");
      let constraints = [
        where("sellerId", "==", sellerId),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      ];

      // Add status filter if provided
      if (status) {
        constraints.splice(1, 0, where("status", "==", status));
      }

      const q = query(withdrawalsRef, ...constraints);

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const withdrawals = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          next(null, withdrawals);
        },
        (err) => {
          console.error("Error fetching withdrawals:", err);
          next(err, []);
        }
      );

      return () => unsub();
    }
  );

  return {
    withdrawals: data || [],
    error: error?.message,
    isLoading: data === undefined && !error,
  };
}

/**
 * Get seller's withdrawal requests (one-time fetch)
 */
export async function getSellerWithdrawals({ sellerId, status = null, limitCount = 50 }) {
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }

  try {
    const withdrawalsRef = collection(db, "withdrawalRequests");
    let constraints = [
      where("sellerId", "==", sellerId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    ];

    if (status) {
      constraints.splice(1, 0, where("status", "==", status));
    }

    const q = query(withdrawalsRef, ...constraints);
    const snapshot = await getDocs(q);

    const withdrawals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, data: withdrawals };
  } catch (error) {
    console.error("Error getting seller withdrawals:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get a single withdrawal request
 */
export async function getWithdrawalRequest(requestId) {
  if (!requestId) {
    throw new Error("Request ID is required");
  }

  try {
    const requestRef = doc(db, "withdrawalRequests", requestId);
    const requestSnap = await getDoc(requestRef);

    if (!requestSnap.exists()) {
      return { success: false, error: "Withdrawal request not found" };
    }

    return {
      success: true,
      data: { id: requestSnap.id, ...requestSnap.data() }
    };
  } catch (error) {
    console.error("Error getting withdrawal request:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if seller has pending withdrawal request
 */
export async function hasPendingWithdrawal(sellerId) {
  if (!sellerId) {
    return { hasPending: false };
  }

  try {
    const withdrawalsRef = collection(db, "withdrawalRequests");
    const q = query(
      withdrawalsRef,
      where("sellerId", "==", sellerId),
      where("status", "==", "pending"),
      limit(1)
    );

    const snapshot = await getDocs(q);
    
    return {
      hasPending: !snapshot.empty,
      pendingRequest: snapshot.empty ? null : {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      }
    };
  } catch (error) {
    console.error("Error checking pending withdrawal:", error);
    return { hasPending: false, error: error.message };
  }
}

/**
 * Get withdrawal statistics for seller
 */
export async function getWithdrawalStats(sellerId) {
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }

  try {
    const withdrawalsRef = collection(db, "withdrawalRequests");
    const q = query(withdrawalsRef, where("sellerId", "==", sellerId));
    const snapshot = await getDocs(q);

    const stats = {
      totalRequests: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      processing: 0,
      totalRequested: 0,
      totalApproved: 0,
      totalNetReceived: 0
    };

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      stats.totalRequests++;
      stats.totalRequested += data.amountRequested || 0;

      // Count by status
      switch (data.status) {
        case "pending":
          stats.pending++;
          break;
        case "approved":
          stats.approved++;
          stats.totalApproved += data.amountRequested || 0;
          stats.totalNetReceived += data.breakdown?.netPayable || 0;
          break;
        case "rejected":
          stats.rejected++;
          break;
        case "processing":
          stats.processing++;
          break;
      }
    });

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error getting withdrawal stats:", error);
    return { success: false, error: error.message };
  }
}
