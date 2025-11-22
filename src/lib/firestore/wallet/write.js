"use client";

import { db } from "../firebase";
import {
  doc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  Timestamp,
  getDoc,
  collection,
  addDoc
} from "firebase/firestore";

/**
 * Initialize seller wallet (called when seller is approved)
 */
export async function initializeSellerWallet(sellerId) {
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }

  try {
    const walletRef = doc(db, "sellerWallet", sellerId);
    
    // Check if wallet already exists
    const walletSnap = await getDoc(walletRef);
    if (walletSnap.exists()) {
      return { success: true, message: "Wallet already exists" };
    }

    const walletData = {
      sellerId,
      totalEarnings: 0,
      totalWithdrawn: 0,
      availableBalance: 0,
      pendingBalance: 0,
      lifetimeRevenue: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(walletRef, walletData);

    return { success: true, message: "Wallet initialized successfully" };
  } catch (error) {
    console.error("Error initializing seller wallet:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Add earnings to seller wallet (called when order is delivered)
 */
export async function addEarningsToWallet({ 
  sellerId, 
  amount, 
  orderId, 
  orderDetails = {} 
}) {
  if (!sellerId || !amount || !orderId) {
    throw new Error("Seller ID, amount, and order ID are required");
  }

  if (amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  try {
    const walletRef = doc(db, "sellerWallet", sellerId);

    // Check if wallet exists, if not initialize it
    const walletSnap = await getDoc(walletRef);
    if (!walletSnap.exists()) {
      await initializeSellerWallet(sellerId);
    }

    // Update wallet balances using atomic increment
    await updateDoc(walletRef, {
      totalEarnings: increment(amount),
      availableBalance: increment(amount),
      lifetimeRevenue: increment(amount),
      updatedAt: serverTimestamp()
    });

    // Record transaction in subcollection for audit trail
    const transactionRef = collection(db, "sellerWallet", sellerId, "transactions");
    await addDoc(transactionRef, {
      type: "earning",
      amount: amount,
      orderId: orderId,
      paymentMode: orderDetails.paymentMode || null,
      orderTotal: orderDetails.orderTotal || null,
      createdAt: Timestamp.now(),
      description: `Earning from order ${orderId}`
    });

    return { 
      success: true, 
      message: `₹${amount} added to wallet successfully` 
    };
  } catch (error) {
    console.error("Error adding earnings to wallet:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Deduct amount from available balance (called when withdrawal is approved)
 * This deducts the GROSS amount, but tracks the NET amount as withdrawn
 */
export async function processWithdrawal({ 
  sellerId, 
  grossAmount, 
  netAmount, 
  withdrawalRequestId 
}) {
  if (!sellerId || !grossAmount || !netAmount || !withdrawalRequestId) {
    throw new Error("All parameters are required");
  }

  try {
    const walletRef = doc(db, "sellerWallet", sellerId);

    // Verify sufficient balance
    const walletSnap = await getDoc(walletRef);
    if (!walletSnap.exists()) {
      throw new Error("Wallet not found");
    }

    const walletData = walletSnap.data();
    if (walletData.availableBalance < grossAmount) {
      throw new Error("Insufficient balance");
    }

    // Update wallet
    await updateDoc(walletRef, {
      availableBalance: increment(-grossAmount), // Deduct gross amount
      totalWithdrawn: increment(netAmount),      // Track net amount paid
      updatedAt: serverTimestamp()
    });

    // Record transaction
    const transactionRef = collection(db, "sellerWallet", sellerId, "transactions");
    await addDoc(transactionRef, {
      type: "withdrawal",
      grossAmount: grossAmount,
      netAmount: netAmount,
      deduction: grossAmount - netAmount,
      withdrawalRequestId: withdrawalRequestId,
      createdAt: Timestamp.now(),
      description: `Withdrawal processed - Request ${withdrawalRequestId}`
    });

    return { 
      success: true, 
      message: "Withdrawal processed successfully" 
    };
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Refund withdrawal amount (if withdrawal is rejected after deduction)
 */
export async function refundWithdrawal({ 
  sellerId, 
  amount, 
  withdrawalRequestId 
}) {
  if (!sellerId || !amount || !withdrawalRequestId) {
    throw new Error("All parameters are required");
  }

  try {
    const walletRef = doc(db, "sellerWallet", sellerId);

    // Add back to available balance
    await updateDoc(walletRef, {
      availableBalance: increment(amount),
      updatedAt: serverTimestamp()
    });

    // Record transaction
    const transactionRef = collection(db, "sellerWallet", sellerId, "transactions");
    await addDoc(transactionRef, {
      type: "refund",
      amount: amount,
      withdrawalRequestId: withdrawalRequestId,
      createdAt: Timestamp.now(),
      description: `Withdrawal refunded - Request ${withdrawalRequestId}`
    });

    return { 
      success: true, 
      message: "Amount refunded to wallet" 
    };
  } catch (error) {
    console.error("Error refunding withdrawal:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Manual adjustment (admin only - for corrections)
 */
export async function adjustWalletBalance({ 
  sellerId, 
  amount, 
  reason, 
  adminId 
}) {
  if (!sellerId || !amount || !reason || !adminId) {
    throw new Error("All parameters are required");
  }

  try {
    const walletRef = doc(db, "sellerWallet", sellerId);

    await updateDoc(walletRef, {
      availableBalance: increment(amount),
      lifetimeRevenue: increment(amount > 0 ? amount : 0),
      updatedAt: serverTimestamp()
    });

    // Record transaction
    const transactionRef = collection(db, "sellerWallet", sellerId, "transactions");
    await addDoc(transactionRef, {
      type: "adjustment",
      amount: amount,
      reason: reason,
      adminId: adminId,
      createdAt: Timestamp.now(),
      description: `Manual adjustment by admin: ${reason}`
    });

    return { 
      success: true, 
      message: "Wallet adjusted successfully" 
    };
  } catch (error) {
    console.error("Error adjusting wallet:", error);
    return { success: false, error: error.message };
  }
}
