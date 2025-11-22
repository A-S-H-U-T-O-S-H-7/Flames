import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { sendFCMPushNotification } from "../utils/notificationHelpers.js";

// Cloud Function: Trigger when admin creates announcement
export const adminAnnouncementNotification = onDocumentCreated("announcements/{announcementId}", async (event) => {
  try {
    const announcement = event.data.data();
    const announcementId = event.params.announcementId;
    
    console.log(`📢 New admin announcement: ${announcementId}`);
    
    // Get all sellers
    const sellersSnapshot = await getFirestore().collection('sellers').get();
    
    console.log(`📨 Broadcasting to ${sellersSnapshot.size} sellers`);
    
    // Send notifications to all sellers
    const notificationPromises = sellersSnapshot.docs.map(async (sellerDoc) => {
      await sendAdminNotification(sellerDoc.id, announcement, announcementId);
    });
    
    await Promise.all(notificationPromises);
    console.log(`✅ Admin announcement sent to ${sellersSnapshot.size} sellers`);
    
    return null;
  } catch (error) {
    console.error('🚨 Error in adminAnnouncementNotification:', error);
    return null;
  }
});

// Helper function to send admin notification to seller
async function sendAdminNotification(sellerId, announcement, announcementId) {
  const title = announcement.title || 'Admin Announcement';
  const message = announcement.message || 'New announcement from admin';
  
  // Create notification data
  const notificationData = {
    receiverId: sellerId,
    type: 'admin',
    title: `📢 ${title}`,
    message: message,
    announcementId: announcementId,
    status: 'unread',
    createdAt: FieldValue.serverTimestamp(),
    link: announcement.link || '/seller/notifications'
  };
  
  try {
    // Save notification to Firestore
    await getFirestore().collection('notifications').add(notificationData);
    console.log(`📨 Admin notification created for seller: ${sellerId}`);
    
    // Send FCM push notification
    await sendFCMPushNotification(sellerId, notificationData, 'admin');
    
  } catch (error) {
    console.error(`❌ Error creating admin notification for seller ${sellerId}:`, error);
  }
}