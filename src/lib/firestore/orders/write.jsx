import { db } from "../firebase";
import { doc, Timestamp, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { addEarningsToWallet } from "../wallet/write";

/**
 * UNIFIED ORDER STATUS UPDATE
 * Updates BOTH collections: orders + sellerOrders
 * Triggers wallet earnings addition on delivery
 * Works for both Admin and Seller updates
 */
export const updateOrderStatus = async ({ id, status, cancellationReason, note = "" }) => {
  if (!id || !status) {
    throw new Error("Order ID and status are required");
  }
  
  try {
    // 1. GET ORDER DATA FIRST (to check previous status and get seller info)
    const orderRef = doc(db, `orders/${id}`);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      throw new Error("Order not found");
    }
    
    const orderData = orderSnap.data();
    const previousStatus = orderData.status;
    
    // 2. PREPARE UPDATE DATA
    const updateData = {
      status: status,
      timestampStatusUpdate: serverTimestamp(),
      updatedAt: Timestamp.now(),
      statusHistory: {
        ...(orderData.statusHistory || {}),
        [status]: serverTimestamp()
      }
    };
    
    // Add cancellation reason if provided
    if (cancellationReason && status === "cancelled") {
      updateData.cancellationReason = cancellationReason;
      updateData.cancellation = {
        reason: cancellationReason,
        cancelledAt: Timestamp.now()
      };
    }
    
    // Add note if provided
    if (note) {
      updateData[`statusNotes.${status}`] = note;
    }
    
    // 3. UPDATE MASTER ORDER COLLECTION
    console.log(`🔄 Updating /orders/${id} with status: ${status}`);
    await updateDoc(orderRef, updateData);
    console.log(`✅ Updated /orders/${id}`);
    
    // 4. UPDATE SELLER-SPECIFIC ORDERS
    console.log(`📦 Order data:`, { sellerId: orderData.sellerId, isMultiSeller: orderData.isMultiSellerOrder, sellerIds: orderData.sellerIds });
    
    // Handle both single-seller and multi-seller orders
    if (orderData.isMultiSellerOrder && orderData.sellerIds && orderData.sellerIds.length > 0) {
      // Multi-seller order: Update each seller's order
      for (const sellerId of orderData.sellerIds) {
        try {
          const sellerOrderRef = doc(db, "sellerOrders", sellerId, "orders", id);
          const sellerOrderSnap = await getDoc(sellerOrderRef);
          
          if (sellerOrderSnap.exists()) {
            await updateDoc(sellerOrderRef, updateData);
            
            // Trigger wallet logic for this seller
            await handleWalletLogic({
              sellerId,
              orderId: id,
              status,
              previousStatus,
              orderData: sellerOrderSnap.data()
            });
          }
        } catch (error) {
          console.error(`Error updating seller ${sellerId} order:`, error);
          // Continue with other sellers even if one fails
        }
      }
    } else {
      // Single-seller order - extract from sellerIds array
      const sellerId = orderData.sellerId || (orderData.sellerIds && orderData.sellerIds[0]);
      console.log(`👤 Single-seller order. sellerId: ${sellerId}`);
      console.log(`📋 Extracted from:`, { hasSellerId: !!orderData.sellerId, sellerIds: orderData.sellerIds });
      
      if (sellerId) {
        const sellerOrderRef = doc(db, "sellerOrders", sellerId, "orders", id);
        console.log(`🔍 Checking /sellerOrders/${sellerId}/orders/${id}`);
        const sellerOrderSnap = await getDoc(sellerOrderRef);
        
        if (sellerOrderSnap.exists()) {
          console.log(`✅ Found seller order, updating with status: ${status}`);
          await updateDoc(sellerOrderRef, updateData);
          console.log(`✅ Updated /sellerOrders/${sellerId}/orders/${id}`);
          
          // Trigger wallet logic
          await handleWalletLogic({
            sellerId,
            orderId: id,
            status,
            previousStatus,
            orderData: sellerOrderSnap.data()
          });
        } else {
          console.warn(`⚠️ Seller order NOT found at /sellerOrders/${sellerId}/orders/${id}`);
        }
      } else {
        console.warn(`⚠️ No sellerId found in order data`);
      }
    }
    
    return { success: true };
    
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

/**
 * WALLET LOGIC HANDLER
 * Adds earnings to seller wallet when order is delivered
 */
async function handleWalletLogic({ sellerId, orderId, status, previousStatus, orderData }) {
  // Only add earnings when status changes to "delivered"
  if (status !== "delivered" || previousStatus === "delivered") {
    return;
  }
  
  const paymentMode = orderData.paymentMode;
  const paymentStatus = orderData.paymentStatus;
  const sellerTotal = orderData.sellerTotal || 0;
  
  if (sellerTotal <= 0) {
    console.log(`⚠️ No seller total for order ${orderId}`);
    return;
  }
  
  try {
    // Add earnings for prepaid orders (already paid)
    if (paymentMode === "prepaid" && paymentStatus === "paid") {
      await addEarningsToWallet({
        sellerId: sellerId,
        amount: sellerTotal,
        orderId: orderId,
        orderDetails: {
          paymentMode: paymentMode,
          orderTotal: orderData.orderTotal || sellerTotal
        }
      });
      console.log(`✅ Added ₹${sellerTotal} to seller ${sellerId} wallet for prepaid order ${orderId}`);
    }
    
    // Add earnings for COD orders (if payment collected)
    else if (paymentMode === "cod" && paymentStatus === "collected") {
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
    }
    
    else {
      console.log(`⏳ Order ${orderId} delivered but payment not ready. Mode: ${paymentMode}, Status: ${paymentStatus}`);
    }
  } catch (walletError) {
    console.error(`⚠️ Failed to add earnings to wallet for seller ${sellerId}:`, walletError);
    // Don't fail the status update if wallet update fails
  }
}
