"use client";

import { Bell, CheckCheck } from 'lucide-react';
import { getDocs, writeBatch, collection, query, where, doc } from 'firebase/firestore';
import { db } from '@/lib/firestore/firebase';
import Swal from 'sweetalert2';

export default function NotificationHeader({ notifications, filteredCount, sellerId }) {
  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const handleMarkAllAsRead = async () => {
    if (!sellerId) return;

    try {
      const q = query(
        collection(db, 'notifications'),
        where('receiverId', '==', sellerId),
        where('status', '==', 'unread')
      );

      const snapshot = await getDocs(q);
      const batch = writeBatch(db);

      snapshot.docs.forEach(docSnap => {
        batch.update(doc(db, 'notifications', docSnap.id), { status: 'read' });
      });

      await batch.commit();

      Swal.fire({
        title: 'Success!',
        text: `Marked ${snapshot.size} notifications as read`,
        icon: 'success',
        confirmButtonColor: '#10b981',
        timer: 2000,
        background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#1e293b',
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to mark notifications as read',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#1e293b',
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl">
            <Bell className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
              Notifications
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm sm:text-base">
              {filteredCount === notifications.length 
                ? `${unreadCount} unread of ${notifications.length} total`
                : `${filteredCount} notifications match your filters`
              }
            </p>
          </div>
        </div>
      </div>
      
      {unreadCount > 0 && (
        <button
          onClick={handleMarkAllAsRead}
          className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-sm sm:text-base"
        >
          <CheckCheck size={20} />
          Mark all as read ({unreadCount})
        </button>
      )}
    </div>
  );
}
