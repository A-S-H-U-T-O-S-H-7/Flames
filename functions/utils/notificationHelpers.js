import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

// Shared helper function to send FCM push notifications
function sendFCMPushNotification(sellerId, notificationData, type) {
  return new Promise(async (resolve, reject) => {
    try {
      // Get seller's FCM token
      const tokenDoc = await getFirestore().collection('sellerTokens').doc(sellerId).get();
      
      if (!tokenDoc.exists) {
        console.log(`❌ No FCM token found for seller: ${sellerId}`);
        resolve();
        return;
      }
      
      const sellerToken = tokenDoc.data().token;
      
      // FCM message payload
      const message = {
        token: sellerToken,
        notification: {
          title: notificationData.title,
          body: notificationData.message,
        },
        data: {
          type: type,
          ...(type === 'order' && { orderId: notificationData.orderId }),
          ...(type === 'review' && { 
            productId: notificationData.productId,
            rating: notificationData.rating.toString()
          }),
          ...(type === 'admin' && { announcementId: notificationData.announcementId })
        }
      };
      
      // Send FCM message
      const response = await getMessaging().send(message);
      console.log(`📱 FCM ${type} push sent to seller ${sellerId}`);
      resolve();
      
    } catch (error) {
      console.error(`❌ Error sending FCM ${type} to seller ${sellerId}:`, error);
      
      // If token is invalid, remove it
      if (error.code === 'messaging/registration-token-not-registered') {
        await getFirestore().collection('sellerTokens').doc(sellerId).delete();
        console.log(`🗑️ Removed invalid FCM token for seller: ${sellerId}`);
      }
      reject(error);
    }
  });
}

export {
  sendFCMPushNotification
};
