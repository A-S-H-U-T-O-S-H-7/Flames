"use client";

import { db } from "../firebase";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";
import useSWR from "swr";

/**
 * Real-time hook to get seller's wallet data
 */
export function useSellerWallet(sellerId) {
  const { data, error } = useSWRSubscription(
    ["sellerWallet", sellerId],
    ([path, sellerId], { next }) => {
      if (!sellerId) {
        next(null, null);
        return () => {};
      }

      const walletRef = doc(db, "sellerWallet", sellerId);

      const unsub = onSnapshot(
        walletRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            // Return empty wallet structure if doesn't exist
            next(null, {
              sellerId,
              totalEarnings: 0,
              totalWithdrawn: 0,
              availableBalance: 0,
              pendingBalance: 0,
              lifetimeRevenue: 0,
              exists: false
            });
            return;
          }

          next(null, { 
            id: snapshot.id, 
            ...snapshot.data(),
            exists: true 
          });
        },
        (err) => {
          console.error("Error fetching seller wallet:", err);
          next(err, null);
        }
      );

      return () => unsub();
    }
  );

  return {
    wallet: data,
    error: error?.message,
    isLoading: data === undefined && !error,
  };
}

/**
 * Get seller wallet data (one-time fetch)
 */
export async function getSellerWallet(sellerId) {
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }

  try {
    const walletRef = doc(db, "sellerWallet", sellerId);
    const walletSnap = await getDoc(walletRef);

    if (!walletSnap.exists()) {
      return {
        success: true,
        data: {
          sellerId,
          totalEarnings: 0,
          totalWithdrawn: 0,
          availableBalance: 0,
          pendingBalance: 0,
          lifetimeRevenue: 0,
          exists: false
        }
      };
    }

    return {
      success: true,
      data: { id: walletSnap.id, ...walletSnap.data(), exists: true }
    };
  } catch (error) {
    console.error("Error getting seller wallet:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get wallet transaction history (for future use)
 * This will track all earning additions
 */
export async function getWalletTransactions(sellerId, limitCount = 50) {
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }

  try {
    const transactionsRef = collection(db, "sellerWallet", sellerId, "transactions");
    const q = query(
      transactionsRef,
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, data: transactions };
  } catch (error) {
    console.error("Error getting wallet transactions:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if seller has sufficient balance for withdrawal
 */
export async function checkWithdrawalEligibility(sellerId, amount) {
  if (!sellerId || !amount) {
    return { eligible: false, reason: "Invalid parameters" };
  }

  try {
    const walletResult = await getSellerWallet(sellerId);
    
    if (!walletResult.success) {
      return { eligible: false, reason: "Failed to fetch wallet" };
    }

    const wallet = walletResult.data;
    const minWithdrawal = 100; // Minimum ₹100

    if (amount < minWithdrawal) {
      return { 
        eligible: false, 
        reason: `Minimum withdrawal amount is ₹${minWithdrawal}` 
      };
    }

    if (amount > wallet.availableBalance) {
      return { 
        eligible: false, 
        reason: `Insufficient balance. Available: ₹${wallet.availableBalance}` 
      };
    }

    return { 
      eligible: true, 
      availableBalance: wallet.availableBalance 
    };
  } catch (error) {
    console.error("Error checking withdrawal eligibility:", error);
    return { eligible: false, reason: error.message };
  }
}
