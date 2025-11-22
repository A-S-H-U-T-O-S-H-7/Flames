"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firestore/firebase';

export default function FirestoreDebug() {
  const [allNotifications, setAllNotifications] = useState([]);

  useEffect(() => {
    const checkAllNotifications = async () => {
      try {
        console.log('🔍 CHECKING ALL NOTIFICATIONS IN FIRESTORE...');
        
        const querySnapshot = await getDocs(collection(db, 'notifications'));
        console.log('📋 TOTAL NOTIFICATIONS IN COLLECTION:', querySnapshot.size);
        
        const allDocs = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          allDocs.push({
            id: doc.id,
            ...data
          });
          console.log('📄 NOTIFICATION DOCUMENT:', {
            id: doc.id,
            ...data
          });
        });
        
        setAllNotifications(allDocs);
        
        // Check if any match our user
        const currentUserId = 'HceU2TMURiSQAlrck4LwJDsIIqs2';
        const userNotifications = allDocs.filter(doc => doc.receiverId === currentUserId);
        console.log('👤 NOTIFICATIONS FOR CURRENT USER:', userNotifications.length);
        console.log('👤 CURRENT USER ID:', currentUserId);
        
      } catch (error) {
        console.error('❌ Error checking notifications:', error);
      }
    };

    checkAllNotifications();
  }, []);

  return (
    <div className="p-4 bg-red-100 border border-red-400 rounded mb-4">
      <h3 className="font-bold text-red-700">Firestore Debug</h3>
      <p>Total notifications in collection: {allNotifications.length}</p>
      <p>Check browser console for details</p>
    </div>
  );
}