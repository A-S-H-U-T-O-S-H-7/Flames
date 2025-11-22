import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firestore/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firestore/firebase';

export const useFCM = () => {
  const requestPermission = async (sellerId, userEmail = null) => {
    try {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return null;
      }

      // Check if messaging is available
      if (!messaging) {
        console.log('Firebase messaging not available');
        return null;
      }

      // Register service worker first
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker registered:', registration);
          
          // Wait for service worker to be ready
          await navigator.serviceWorker.ready;
          console.log('Service Worker is ready');
        } catch (swError) {
          console.error('Service Worker registration failed:', swError);
          // Continue even if SW registration fails - FCM might still work
        }
      }

      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        
        try {
          // Get FCM token with timeout
          const token = await Promise.race([
            getToken(messaging, { 
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY 
            }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('FCM token timeout')), 15000)
            )
          ]);
          
          if (token) {
            // Save token to Firestore for this seller
            await setDoc(doc(db, 'sellerTokens', sellerId), {
              token: token,
              createdAt: new Date(),
              sellerId: sellerId,
              email: userEmail 
            });
            console.log('FCM token saved for seller:', sellerId);
            return token;
          }
        } catch (tokenError) {
          console.error('Error getting FCM token:', tokenError);
          // Don't throw - allow app to continue without FCM
        }
      } else {
        console.log('Notification permission denied.');
      }
    } catch (error) {
      console.error('Error in requestPermission:', error);
      // Don't throw - allow app to continue
    }
    return null;
  };

  return { requestPermission };
};
