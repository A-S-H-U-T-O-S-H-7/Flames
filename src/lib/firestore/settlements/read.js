"use client";

import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where
} from "firebase/firestore";

/**
 * Get settlement history for a seller
 */
export async function getSellerSettlements({ sellerId, limitCount = 50 }) {
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }

  try {
    const settlementsRef = collection(db, "sellerWallet", sellerId, "settlements");
    const q = query(
      settlementsRef,
      orderBy("paidAt", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const settlements = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, data: settlements };
  } catch (error) {
    console.error("Error getting seller settlements:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all settlements (admin only - for future use)
 */
export async function getAllSettlements({ limitCount = 100 }) {
  try {
    // This would require a top-level settlements collection for admin view
    // For now, we'll note this as a future enhancement
    // In production, you'd query all seller wallets or use a denormalized collection
    
    return { 
      success: false, 
      error: "Admin settlement view not yet implemented. Use seller-specific queries for now." 
    };
  } catch (error) {
    console.error("Error getting all settlements:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get settlement statistics for a seller
 */
export async function getSellerSettlementStats(sellerId) {
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }

  try {
    const settlementsRef = collection(db, "sellerWallet", sellerId, "settlements");
    const snapshot = await getDocs(settlementsRef);

    const stats = {
      totalSettlements: 0,
      totalPaid: 0,
      averageSettlement: 0,
      lastSettlementDate: null
    };

    let totalAmount = 0;

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      stats.totalSettlements++;
      totalAmount += data.amount || 0;

      // Track last settlement date
      if (data.paidAt && (!stats.lastSettlementDate || data.paidAt > stats.lastSettlementDate)) {
        stats.lastSettlementDate = data.paidAt;
      }
    });

    stats.totalPaid = totalAmount;
    stats.averageSettlement = stats.totalSettlements > 0 
      ? totalAmount / stats.totalSettlements 
      : 0;

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error getting settlement stats:", error);
    return { success: false, error: error.message };
  }
}
