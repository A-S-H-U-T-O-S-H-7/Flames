"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingBag, Star, Megaphone, Bell } from 'lucide-react';
import Swal from 'sweetalert2';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firestore/firebase';

export default function NotificationRow({ notification }) {
  const [isRead, setIsRead] = useState(notification.status === 'read');
  const router = useRouter();

  const handleMarkAsRead = async () => {
    if (!isRead) {
      try {
        await updateDoc(doc(db, 'notifications', notification.id), {
          status: 'read'
        });
        setIsRead(true);
      } catch (error) {
        // Silent fail - notification will remain unread
      }
    }
  };

  const handleClick = (e) => {
    if (e.target.closest('.delete-button')) {
      return;
    }
    handleMarkAsRead();
    
    // Navigate based on notification type and link
    if (notification.link) {
      router.push(notification.link);
    } else {
      // Fallback navigation based on type
      switch (notification.type) {
        case 'order':
          router.push('/sellers/orders');
          break;
        case 'review':
          router.push('/seller/reviews');
          break;
        default:
          // Do nothing
          break;
      }
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    
    const result = await Swal.fire({
      title: 'Delete Notification?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#1e293b',
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'notifications', notification.id));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Notification has been deleted.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          timer: 2000,
          background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#1e293b',
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete notification.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#1e293b',
        });
      }
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingBag size={18} className="text-blue-500" />;
      case 'review':
        return <Star size={18} className="text-yellow-500" />;
      case 'admin':
        return <Megaphone size={18} className="text-purple-500" />;
      default:
        return <Bell size={18} className="text-teal-500" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'order': return 'Order';
      case 'review': return 'Review';
      case 'admin': return 'Admin';
      default: return 'General';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffInMs = now - date;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays}d ago`;
      
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  const getNotificationPreview = () => {
    // For review notifications, show customer and product info
    if (notification.type === 'review' && notification.customerName && notification.productName) {
      return `${notification.customerName} reviewed "${notification.productName}"`;
    }
    
    // For order notifications, show order summary
    if (notification.type === 'order' && notification.itemCount) {
      return `${notification.itemCount} item(s) • ₹${notification.sellerTotal?.toFixed(2) || '0.00'}`;
    }
    
    // Default to message
    return notification.message || '';
  };

  const cellBase = "px-4 py-4 border-r";
  const cellBorder = "border-emerald-300/40 dark:border-emerald-600/40";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  const textPrimary = "text-slate-900 dark:text-gray-100";
  const textSecondary = "text-slate-700 dark:text-gray-200";

  return (
    <tr 
      onClick={handleClick}
      className={`border-b transition-all duration-200 hover:shadow-lg cursor-pointer ${
        "border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-slate-700/50"
      } ${
        !isRead
          ? "bg-teal-50/80 dark:bg-teal-900/20"
          : index % 2 === 0
            ? "bg-slate-100/60 dark:bg-slate-800/30"
            : "bg-white dark:bg-slate-800/10"
      }`}
    >
      {/* Type */}
      <td className={cellStyle}>
        <div className="flex items-center space-x-2">
          {!isRead && (
            <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0" title="Unread" />
          )}
          {getTypeIcon(notification.type)}
          <span className={`capitalize text-sm font-medium ${textSecondary}`}>
            {getTypeLabel(notification.type)}
          </span>
        </div>
      </td>

      {/* Message & Preview */}
      <td className={cellStyle}>
        <div>
          <div className={`font-medium ${textPrimary} line-clamp-1 mb-1`}>
            {notification.title}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {getNotificationPreview()}
          </div>
          
          {/* Additional metadata */}
          {notification.type === 'review' && notification.rating && (
            <div className="flex items-center mt-1">
              <span className="text-yellow-500 text-sm">
                {'⭐'.repeat(notification.rating)}
                {'☆'.repeat(5 - notification.rating)}
              </span>
              <span className="text-xs text-slate-500 ml-2">
                ({notification.rating}/5)
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Date */}
      <td className={cellStyle}>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {formatDate(notification.createdAt)}
        </span>
      </td>

      {/* Actions */}
      <td className={cellBase}>
        <div className="flex items-center justify-center">
          <button
            onClick={handleDelete}
            className="delete-button p-2 text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 rounded-lg transition-colors duration-200 border border-red-700 dark:border-red-600 shadow-sm"
            title="Delete notification"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
