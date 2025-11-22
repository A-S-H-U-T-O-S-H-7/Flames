import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { sendFCMPushNotification } from "../utils/notificationHelpers.js";

// Cloud Function: Trigger when new order is created
export const newOrderNotification = onDocumentCreated("orders/{orderId}", async (event) => {
  try {
    const order = event.data.data();
    const orderId = event.params.orderId;
    
    console.log(`📦 New order created: ${orderId}`);
    
    // Check if this is a multi-seller order
    if (order.sellerGroups && order.sellerGroups.length > 0) {
      console.log(`🛍️ Multi-seller order with ${order.sellerGroups.length} sellers`);
      
      // Send notifications to each seller
      const notificationPromises = order.sellerGroups.map(async (sellerGroup) => {
        await sendOrderNotification(sellerGroup, order, orderId);
      });
      
      await Promise.all(notificationPromises);
      console.log(`✅ Order notifications sent to ${order.sellerGroups.length} sellers`);
    } else {
      console.log('❌ No seller groups found in order');
    }
    
    return null;
  } catch (error) {
    console.error('🚨 Error in newOrderNotification:', error);
    return null;
  }
});

// Helper function to send order notification to seller
async function sendOrderNotification(sellerGroup, order, orderId) {
  const sellerId = sellerGroup.sellerId;
  
  // Count items for this seller
  const itemCount = sellerGroup.items.reduce((total, item) => total + (item.quantity || 1), 0);
  
  // Create notification data
  const notificationData = {
    receiverId: sellerId,
    type: 'order',
    title: '🛍️ New Order Received!',
    message: `You have ${itemCount} new item${itemCount > 1 ? 's' : ''} in order #${orderId.substring(0, 8)}`,
    orderId: orderId,
    sellerId: sellerId,
    itemCount: itemCount,
    totalAmount: sellerGroup.subtotal,
    status: 'unread',
    createdAt: FieldValue.serverTimestamp(),
    link: `/seller/orders/${orderId}`
  };
  
  try {
    // Save notification to Firestore
    await getFirestore().collection('notifications').add(notificationData);
    console.log(`📨 Order notification created for seller: ${sellerId}`);
    
    // Send FCM push notification
    await sendFCMPushNotification(sellerId, notificationData, 'order');
    
  } catch (error) {
    console.error(`❌ Error creating order notification for seller ${sellerId}:`, error);
  }
}