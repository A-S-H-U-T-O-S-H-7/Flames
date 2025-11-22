"use client";

import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firestore/firebase';

// Subscribe to real-time notifications for a SELLER
export const subscribeToNotifications = (sellerId, callback) => {
  if (!sellerId) {
    return () => {};
  }

  const q = query(
    collection(db, 'notifications'),
    where('receiverId', '==', sellerId),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, 
    (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      callback(notifications);
    },
    (error) => {
      console.error('Notification listener error:', error);
    }
  );

  return unsubscribe;
};

// Get all notifications for a seller (one-time read)
export const getSellerNotifications = async (sellerId) => {
  if (!sellerId) return [];
  const q = query(
    collection(db, 'notifications'),
    where('receiverId', '==', sellerId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Get a specific notification by ID
export const getNotificationById = async (notificationId) => {
  const docRef = doc(db, 'notifications', notificationId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  }
  return null;
};

// Get unread notifications count for a user
export const getUnreadNotificationsCount = async (sellerId) => {
  if (!sellerId) return 0;

  const q = query(
    collection(db, 'notifications'),
    where('receiverId', '==', sellerId),
    where('status', '==', 'unread')
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
};

// Mark all notifications as read for a seller
export const markAllNotificationsAsRead = async (sellerId) => {
  if (!sellerId) return;

  const q = query(
    collection(db, 'notifications'),
    where('receiverId', '==', sellerId),
    where('status', '==', 'unread')
  );

  const snapshot = await getDocs(q);
  const batch = writeBatch(db);

  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, { status: 'read' });
  });

  await batch.commit();
};

// Mark a single notification as read
export const markNotificationAsRead = async (notificationId) => {
  await updateDoc(doc(db, 'notifications', notificationId), {
    status: 'read'
  });
};