import { db } from "../firebase";
import { doc, updateDoc, Timestamp, getDoc } from "firebase/firestore";
import { addEarningsToWallet } from "../wallet/write";

/**
 * Update seller order status
 * Syncs to both sellerOrders collection and master orders collection
 * Automatically adds earnings to wallet when order is delivered
 * 
 * NOTE: This now uses the unified updateOrderStatus from orders/write.jsx
 * which properly syncs BOTH collections
 */
export const updateSellerOrderStatus = async ({ sellerId, orderId, status, note = "" }) => {
  if (!sellerId || !orderId || !status) {
    throw new Error("Seller ID, Order ID, and status are required");
  }

  try {
    // Get order data before updating status
    const sellerOrderRef = doc(db, "sellerOrders", sellerId, "orders", orderId);
    const orderSnap = await getDoc(sellerOrderRef);
    
    if (!orderSnap.exists()) {
      throw new Error("Order not found");
    }
    
    const orderData = orderSnap.data();
    const previousStatus = orderData.status;

    const updateData = {
      status: status,
      updatedAt: Timestamp.now(),
      timestampStatusUpdate: Timestamp.now(),
      ...(note && { [`statusNotes.${status}`]: note })
    };

    // Update seller's order
    await updateDoc(sellerOrderRef, updateData);

    // Update master order - update the main status AND sellerGroups
    const masterOrderRef = doc(db, "orders", orderId);
    await updateDoc(masterOrderRef, {
      status: status, // Update main status too!
      [`sellerGroups.${sellerId}.status`]: status,
      updatedAt: Timestamp.now(),
      timestampStatusUpdate: Timestamp.now()
    });

    // 🔥 AUTO-ADD EARNINGS TO WALLET WHEN ORDER IS DELIVERED
    if (status === "delivered" && previousStatus !== "delivered") {
      const paymentMode = orderData.paymentMode;
      const paymentStatus = orderData.paymentStatus;
      const sellerTotal = orderData.sellerTotal || 0;

      // Add earnings for prepaid orders (already paid)
      if (paymentMode === "prepaid" && paymentStatus === "paid" && sellerTotal > 0) {
        try {
          await addEarningsToWallet({
            sellerId: sellerId,
            amount: sellerTotal,
            orderId: orderId,
            orderDetails: {
              paymentMode: paymentMode,
              orderTotal: orderData.orderTotal || sellerTotal
            }
          });
          console.log(`✅ Added ₹${sellerTotal} to seller ${sellerId} wallet for order ${orderId}`);
        } catch (walletError) {
          console.error("⚠️ Failed to add earnings to wallet:", walletError);
          // Don't fail the status update if wallet update fails
        }
      }

      // Add earnings for COD orders (if payment collected)
      if (paymentMode === "cod" && paymentStatus === "collected" && sellerTotal > 0) {
        try {
          await addEarningsToWallet({
            sellerId: sellerId,
            amount: sellerTotal,
            orderId: orderId,
            orderDetails: {
              paymentMode: paymentMode,
              orderTotal: orderData.orderTotal || sellerTotal
            }
          });
          console.log(`✅ Added ₹${sellerTotal} to seller ${sellerId} wallet for COD order ${orderId}`);
        } catch (walletError) {
          console.error("⚠️ Failed to add earnings to wallet:", walletError);
          // Don't fail the status update if wallet update fails
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating seller order status:", error);
    throw error;
  }
};

/**
 * Update seller order tracking information
 */
export const updateSellerOrderTracking = async ({ 
  sellerId, 
  orderId, 
  trackingNumber, 
  carrier, 
  estimatedDelivery 
}) => {
  if (!sellerId || !orderId) {
    throw new Error("Seller ID and Order ID are required");
  }

  try {
    const updateData = {
      tracking: {
        trackingNumber: trackingNumber || "",
        carrier: carrier || "",
        estimatedDelivery: estimatedDelivery || null,
        updatedAt: Timestamp.now(),
      },
      updatedAt: Timestamp.now(),
    };

    // Update seller's order
    const sellerOrderRef = doc(db, "sellerOrders", sellerId, "orders", orderId);
    await updateDoc(sellerOrderRef, updateData);

    // Update master order
    const masterOrderRef = doc(db, "orders", orderId);
    await updateDoc(masterOrderRef, {
      [`sellerGroups.${sellerId}.tracking`]: updateData.tracking,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating tracking:", error);
    throw error;
  }
};

/**
 * Add note to seller order
 */
export const addSellerOrderNote = async ({ sellerId, orderId, note }) => {
  if (!sellerId || !orderId || !note) {
    throw new Error("Seller ID, Order ID, and note are required");
  }

  try {
    const noteData = {
      text: note,
      createdAt: Timestamp.now(),
      addedBy: sellerId,
    };

    const sellerOrderRef = doc(db, "sellerOrders", sellerId, "orders", orderId);
    
    await updateDoc(sellerOrderRef, {
      sellerNotes: [...(await getDoc(sellerOrderRef)).data().sellerNotes || [], noteData],
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

/**
 * Bulk update order statuses for seller
 * Useful for processing multiple orders at once
 */
export const bulkUpdateSellerOrderStatus = async ({ 
  sellerId, 
  orderIds, 
  status 
}) => {
  if (!sellerId || !orderIds || orderIds.length === 0 || !status) {
    throw new Error("Seller ID, order IDs, and status are required");
  }

  try {
    const updatePromises = orderIds.map(orderId =>
      updateSellerOrderStatus({ sellerId, orderId, status })
    );

    await Promise.all(updatePromises);

    return { 
      success: true, 
      updated: orderIds.length 
    };
  } catch (error) {
    console.error("Error in bulk update:", error);
    throw error;
  }
};

/**
 * Cancel seller order
 * Updates both seller and master collections
 */
export const cancelSellerOrder = async ({ 
  sellerId, 
  orderId, 
  reason 
}) => {
  if (!sellerId || !orderId) {
    throw new Error("Seller ID and Order ID are required");
  }

  try {
    const updateData = {
      status: "cancelled",
      cancellation: {
        reason: reason || "Cancelled by seller",
        cancelledAt: Timestamp.now(),
        cancelledBy: sellerId,
      },
      updatedAt: Timestamp.now(),
    };

    // Update seller's order
    const sellerOrderRef = doc(db, "sellerOrders", sellerId, "orders", orderId);
    await updateDoc(sellerOrderRef, updateData);

    // Update master order
    const masterOrderRef = doc(db, "orders", orderId);
    await updateDoc(masterOrderRef, {
      [`sellerGroups.${sellerId}.status`]: "cancelled",
      [`sellerGroups.${sellerId}.cancellation`]: updateData.cancellation,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};
