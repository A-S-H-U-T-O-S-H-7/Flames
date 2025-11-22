"use client";

import { 
  addDoc, 
  collection, 
  Timestamp, 
  deleteDoc, 
  doc,
  writeBatch 
} from 'firebase/firestore';
import { db } from '@/lib/firestore/firebase';

// Create a notification for a specific user
export const createNotification = async (notificationData) => {
  try {
    const { receiverId, type, title, message, link = null, metadata = {} } = notificationData;

    const notificationDoc = {
      receiverId,
      type,
      title,
      message,
      link,
      status: 'unread',
      createdAt: Timestamp.now(),
      metadata,
    };

    // Include additional fields based on type
    if (type === 'review') {
      notificationDoc.customerName = metadata.customerName;
      notificationDoc.productId = metadata.productId;
      notificationDoc.productName = metadata.productName;
      notificationDoc.rating = metadata.rating;
      notificationDoc.reviewId = metadata.reviewId;
      notificationDoc.sellerId = metadata.sellerId;
    }

    if (type === 'order') {
      notificationDoc.orderId = metadata.orderId;
      notificationDoc.sellerBusinessName = metadata.sellerBusinessName;
      notificationDoc.itemCount = metadata.itemCount;
      notificationDoc.sellerTotal = metadata.sellerTotal;
      notificationDoc.paymentMode = metadata.paymentMode;
      notificationDoc.paymentStatus = metadata.paymentStatus;
    }

    const notificationRef = await addDoc(
      collection(db, 'notifications'),
      notificationDoc
    );

    return notificationRef.id;
  } catch (error) {
    throw error;
  }
};

// Create review notification for seller
export const createReviewNotification = async (reviewData) => {
  const { sellerId, customerName, productId, productName, rating, reviewId } = reviewData;
  
  return createNotification({
    receiverId: sellerId,
    type: 'review',
    title: `⭐ ${rating}/5 Star Review!`,
    message: `${customerName} rated "${productName}" ${'⭐'.repeat(rating)}${'☆'.repeat(5 - rating)}`,
    link: `/seller/reviews/${productId}`,
    metadata: {
      customerName,
      productId,
      productName,
      rating,
      reviewId,
      sellerId
    }
  });
};

// Create order notifications for multiple sellers
export const createOrderNotificationsForSellers = async (orderData) => {
  try {
    const { orderId, sellerGroups, orderData: orderInfo } = orderData;

    const notificationPromises = sellerGroups.map(async (sellerGroup) => {
      const sellerId = sellerGroup.sellerId;
      const sellerBusinessName = sellerGroup.sellerBusinessName || 'Your Business';
      const itemCount = sellerGroup.itemCount || sellerGroup.items?.length || 0;
      const sellerTotal = sellerGroup.subtotal || 0;

      return createNotification({
        receiverId: sellerId,
        type: 'order',
        title: 'New Order Received! 🎉',
        message: `You have a new order with ${itemCount} item(s) worth ₹${sellerTotal.toFixed(2)}`,
        link: `/sellers/orders/${orderId}`,
        metadata: {
          orderId,
          sellerBusinessName,
          itemCount,
          sellerTotal,
          paymentMode: orderInfo.paymentMode,
          paymentStatus: orderInfo.paymentStatus,
          isMultiSellerOrder: sellerGroups.length > 1
        }
      });
    });

    await Promise.all(notificationPromises);
  } catch (error) {
    throw error;
  }
};

// Create admin notification
export const createAdminNotification = async (adminData) => {
  const { sellerId, title, message, link = null, metadata = {} } = adminData;
  
  return createNotification({
    receiverId: sellerId,
    type: 'admin',
    title,
    message,
    link,
    metadata
  });
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  await deleteDoc(doc(db, 'notifications', notificationId));
};

// Delete multiple notifications
export const deleteMultipleNotifications = async (notificationIds) => {
  const batch = writeBatch(db);
  
  notificationIds.forEach(id => {
    const docRef = doc(db, 'notifications', id);
    batch.delete(docRef);
  });

  await batch.commit();
};