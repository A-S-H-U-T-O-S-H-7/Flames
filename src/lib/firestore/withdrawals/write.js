"use client";

import { db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  getDoc
} from "firebase/firestore";
import { calculateWithdrawalBreakdown, validateWithdrawalRequest } from "./calculations";
import { getSellerWallet } from "../wallet/read";
import { getSellerById } from "../sellers/read";
import { hasPendingWithdrawal } from "./read";

/**
 * Create a withdrawal request
 */
export async function createWithdrawalRequest({ 
  sellerId, 
  amount, 
  note = "" 
}) {
  try {
    // 1. Get seller data
    const sellerResult = await getSellerById(sellerId);
    if (!sellerResult.success) {
      throw new Error("Seller not found");
    }
    const seller = sellerResult.data;

    // 2. Get wallet data
    const walletResult = await getSellerWallet(sellerId);
    if (!walletResult.success) {
      throw new Error("Failed to fetch wallet");
    }
    const wallet = walletResult.data;

    // 3. Validate withdrawal
    const validation = validateWithdrawalRequest({
      sellerId,
      amount,
      availableBalance: wallet.availableBalance
    });

    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(", ")
      };
    }

    // 4. Check for pending requests
    const pendingCheck = await hasPendingWithdrawal(sellerId);
    if (pendingCheck.hasPending) {
      return {
        success: false,
        error: "You already have a pending withdrawal request. Please wait for it to be processed."
      };
    }

    // 5. Calculate breakdown
    const commissionRate = seller.commission || seller.bankDetails?.platformFee || 10;
    const breakdown = calculateWithdrawalBreakdown(amount, commissionRate);

    // 6. Create withdrawal request document
    const requestRef = doc(collection(db, "withdrawalRequests"));
    const requestData = {
      id: requestRef.id,
      sellerId: sellerId,
      
      // Denormalized seller info for admin view
      sellerInfo: {
        businessName: seller.businessInfo?.businessName || seller.businessName || "N/A",
        email: seller.personalInfo?.email || seller.email || "N/A",
        phone: seller.personalInfo?.phone || seller.phone || "N/A",
        fullName: seller.personalInfo?.fullName || "N/A"
      },
      
      // Request details
      amountRequested: amount,
      breakdown: breakdown,
      
      // Bank details snapshot
      bankDetails: {
        accountHolder: seller.bankDetails?.accountHolder || "",
        accountNumber: seller.bankDetails?.accountNumber || "",
        ifscCode: seller.bankDetails?.ifscCode || "",
        bankName: seller.bankDetails?.bankName || "",
        bankBranch: seller.bankDetails?.bankBranch || "",
        upiId: seller.bankDetails?.upiId || ""
      },
      
      // Status tracking
      status: "pending",
      createdAt: Timestamp.now(),
      processedAt: null,
      processedBy: null,
      
      // Notes
      sellerNote: note,
      adminNote: "",
      
      // Payment reference (filled by admin when paid)
      paymentReference: ""
    };

    await setDoc(requestRef, requestData);

    return {
      success: true,
      message: "Withdrawal request submitted successfully",
      data: { id: requestRef.id, ...requestData }
    };
  } catch (error) {
    console.error("Error creating withdrawal request:", error);
    return {
      success: false,
      error: error.message || "Failed to create withdrawal request"
    };
  }
}

/**
 * Cancel a pending withdrawal request (seller only)
 */
export async function cancelWithdrawalRequest({ requestId, sellerId }) {
  if (!requestId || !sellerId) {
    throw new Error("Request ID and Seller ID are required");
  }

  try {
    const requestRef = doc(db, "withdrawalRequests", requestId);
    const requestSnap = await getDoc(requestRef);

    if (!requestSnap.exists()) {
      return { success: false, error: "Withdrawal request not found" };
    }

    const requestData = requestSnap.data();

    // Verify ownership
    if (requestData.sellerId !== sellerId) {
      return { success: false, error: "Unauthorized" };
    }

    // Only pending requests can be cancelled
    if (requestData.status !== "pending") {
      return {
        success: false,
        error: `Cannot cancel ${requestData.status} request`
      };
    }

    // Update status to cancelled
    await updateDoc(requestRef, {
      status: "cancelled",
      cancelledAt: Timestamp.now(),
      cancelledBy: sellerId
    });

    return {
      success: true,
      message: "Withdrawal request cancelled successfully"
    };
  } catch (error) {
    console.error("Error cancelling withdrawal request:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update withdrawal request (admin only - for future use)
 * This will be used in admin panel
 */
export async function updateWithdrawalStatus({ 
  requestId, 
  status, 
  adminId, 
  adminNote = "",
  paymentReference = "" 
}) {
  if (!requestId || !status || !adminId) {
    throw new Error("Request ID, status, and admin ID are required");
  }

  try {
    const requestRef = doc(db, "withdrawalRequests", requestId);
    const requestSnap = await getDoc(requestRef);

    if (!requestSnap.exists()) {
      return { success: false, error: "Withdrawal request not found" };
    }

    const updateData = {
      status: status,
      processedAt: Timestamp.now(),
      processedBy: adminId,
      adminNote: adminNote
    };

    if (paymentReference) {
      updateData.paymentReference = paymentReference;
    }

    await updateDoc(requestRef, updateData);

    return {
      success: true,
      message: `Withdrawal request ${status} successfully`
    };
  } catch (error) {
    console.error("Error updating withdrawal status:", error);
    return { success: false, error: error.message };
  }
}
