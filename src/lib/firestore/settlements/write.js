"use client";

import { db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  Timestamp
} from "firebase/firestore";

/**
 * Create settlement record (called by admin when payment is made)
 * This is for future admin implementation
 */
export async function createSettlement({
  sellerId,
  withdrawalRequestId,
  amount,
  breakdown,
  bankDetails,
  paymentReference,
  adminId,
  method = "NEFT"
}) {
  if (!sellerId || !withdrawalRequestId || !amount || !adminId) {
    throw new Error("All required parameters must be provided");
  }

  try {
    // Create settlement in seller's subcollection
    const settlementRef = doc(collection(db, "sellerWallet", sellerId, "settlements"));
    
    const settlementData = {
      id: settlementRef.id,
      sellerId: sellerId,
      withdrawalRequestId: withdrawalRequestId,
      amount: amount, // Net amount paid
      breakdown: breakdown || {},
      bankDetails: bankDetails || {},
      paymentReference: paymentReference || "",
      method: method, // NEFT, RTGS, UPI, IMPS
      paidAt: Timestamp.now(),
      paidBy: adminId,
      createdAt: Timestamp.now()
    };

    await setDoc(settlementRef, settlementData);

    return {
      success: true,
      message: "Settlement recorded successfully",
      data: settlementData
    };
  } catch (error) {
    console.error("Error creating settlement:", error);
    return {
      success: false,
      error: error.message || "Failed to create settlement"
    };
  }
}

/**
 * Batch create settlements (for bulk payment processing)
 * This is for future admin implementation
 */
export async function createBulkSettlements(settlements) {
  if (!Array.isArray(settlements) || settlements.length === 0) {
    throw new Error("Settlements array is required");
  }

  try {
    const results = [];
    
    for (const settlement of settlements) {
      const result = await createSettlement(settlement);
      results.push({
        sellerId: settlement.sellerId,
        success: result.success,
        error: result.error || null
      });
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;

    return {
      success: failCount === 0,
      message: `${successCount} settlements created, ${failCount} failed`,
      results: results
    };
  } catch (error) {
    console.error("Error creating bulk settlements:", error);
    return {
      success: false,
      error: error.message || "Failed to create bulk settlements"
    };
  }
}
