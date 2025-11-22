import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onRequest } from "firebase-functions/v2/https";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { sendFCMPushNotification } from "../utils/notificationHelpers.js";

// Enhanced review notification function
export const newReviewNotification = onDocumentCreated(
  {
    document: "products/{productId}/reviews/{reviewId}",
    database: "(default)"
  },
  async (event) => {
  try {
    console.log('🔔🔔🔔 REVIEW FUNCTION TRIGGERED!');
    
    if (!event.data) {
      console.log('❌ No event data found - document might have been deleted immediately');
      return null;
    }

    const review = event.data.data();
    const productId = event.params.productId;
    const reviewId = event.params.reviewId;
    
    console.log(`📝 Review Data:`, JSON.stringify(review, null, 2));
    console.log(`📦 Product ID: ${productId}`);
    console.log(`⭐ Review ID: ${reviewId}`);
    
    if (!review) {
      console.log('❌ No review data found in document');
      return null;
    }

    // Check if review has seller information
    if (review.sellerId) {
      console.log(`📨 Sending review notification to seller: ${review.sellerId}`);
      await sendReviewNotification(review, productId, reviewId);
    } else {
      console.log('❌ No sellerId found in review. Available fields:', Object.keys(review));
    }
    
    return null;
  } catch (error) {
    console.error('🚨 Error in newReviewNotification:', error);
    return null;
  }
});

// Add a test endpoint to manually trigger the function
export const testReviewFunction = onRequest(async (req, res) => {
  try {
    console.log('🧪 TEST: Manually testing review function');
    
    const testReview = {
      sellerId: "test_seller_123",
      rating: 5,
      productName: "Manual Test Product",
      displayName: "Test User",
      createdAt: FieldValue.serverTimestamp()
    };
    
    // Simulate the notification
    await sendReviewNotification(testReview, "test_product_123", "test_review_123");
    
    res.json({ 
      success: true, 
      message: "Test review notification sent",
      testData: testReview
    });
  } catch (error) {
    console.error('Test failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to send review notification to seller
async function sendReviewNotification(review, productId, reviewId) {
  const sellerId = review.sellerId;
  const productName = review.productName || 'Product';
  const rating = review.rating || 0;
  const customerName = review.displayName || 'Customer';
  
  console.log(`🎯 Creating notification for seller: ${sellerId}`);
  
  // Create stars based on rating
  const stars = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  
  // Create notification data
  const notificationData = {
    receiverId: sellerId,
    type: 'review',
    title: `⭐ ${rating}/5 Star Review!`,
    message: `${customerName} rated "${productName}" ${stars}`,
    reviewId: reviewId,
    productId: productId,
    sellerId: sellerId,
    rating: rating,
    customerName: customerName,
    productName: productName,
    status: 'unread',
    createdAt: FieldValue.serverTimestamp(),
    link: `/seller/reviews/${productId}`
  };
  
  try {
    // Save notification to Firestore
    const notificationRef = await getFirestore().collection('notifications').add(notificationData);
    console.log(`📨 Review notification created for seller: ${sellerId}, ID: ${notificationRef.id}`);
    
    // Send FCM push notification
    await sendFCMPushNotification(sellerId, notificationData, 'review');
    console.log(`📱 FCM push sent for review notification`);
    
  } catch (error) {
    console.error(`❌ Error creating review notification for seller ${sellerId}:`, error);
    throw error; // Re-throw to see in logs
  }
}