"use client";

import { useState } from 'react';
import { Trash2, ShoppingBag, Star, Megaphone, Bell, X, CheckCheck, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firestore/firebase';
import { useRouter } from 'next/navigation';

export default function NotificationCard({ notification }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRead, setIsRead] = useState(notification.status === 'read');
  const router = useRouter();

  const handleCardClick = () => {
    setIsModalOpen(true);
    if (!isRead) {
      markAsRead();
    }
  };

  const markAsRead = async () => {
    try {
      await updateDoc(doc(db, 'notifications', notification.id), {
        status: 'read'
      });
      setIsRead(true);
    } catch (error) {
      // Silent fail
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
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'order':
        return <ShoppingBag className={`${iconClass} text-blue-600`} />;
      case 'review':
        return <Star className={`${iconClass} text-amber-500`} />;
      case 'admin':
        return <Megaphone className={`${iconClass} text-purple-600`} />;
      default:
        return <Bell className={`${iconClass} text-teal-600`} />;
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
    if (notification.type === 'review' && notification.customerName && notification.productName) {
      return `${notification.customerName} reviewed "${notification.productName}"`;
    }
    
    if (notification.type === 'order' && notification.itemCount) {
      return `${notification.itemCount} item(s) • ₹${notification.sellerTotal?.toFixed(2) || '0.00'}`;
    }
    
    return notification.message || '';
  };

  const handleNavigate = () => {
    if (notification.link) {
      router.push(notification.link);
      setIsModalOpen(false);
    } else {
      switch (notification.type) {
        case 'order':
          router.push('/sellers/orders');
          break;
        case 'review':
          router.push('/seller/reviews');
          break;
        default:
          break;
      }
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {/* Compact Notification Card */}
      <div
        onClick={handleCardClick}
        className={`relative w-full bg-white dark:bg-slate-800 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg border ${
          !isRead
            ? 'border-teal-200 dark:border-teal-800 bg-gradient-to-r from-teal-50/80 to-white dark:from-teal-900/20 dark:to-slate-800 shadow-md'
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Icon with status indicator */}
          <div className="relative flex-shrink-0">
            <div className={`p-2 rounded-lg ${
              !isRead 
                ? 'bg-teal-100 dark:bg-teal-900/50 ring-2 ring-teal-200 dark:ring-teal-800' 
                : 'bg-slate-100 dark:bg-slate-700'
            }`}>
              {getTypeIcon(notification.type)}
            </div>
            {!isRead && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full ring-2 ring-white dark:ring-slate-800"></div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  !isRead
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {getTypeLabel(notification.type)}
                </span>
                
                {!isRead && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                    <Sparkles size={10} />
                    New
                  </span>
                )}
              </div>
              
              <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap flex-shrink-0">
                {formatDate(notification.createdAt)}
              </span>
            </div>

            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1 line-clamp-1">
              {notification.title}
            </h3>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
              {getNotificationPreview()}
            </p>

            {/* Additional Info */}
            <div className="flex items-center gap-3">
              {notification.type === 'review' && notification.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-amber-500 text-xs">
                    {'★'.repeat(notification.rating)}{'☆'.repeat(5 - notification.rating)}
                  </span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {notification.rating}/5
                  </span>
                </div>
              )}

              {notification.type === 'order' && notification.sellerTotal && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded">
                  ₹{notification.sellerTotal.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0"
            title="Delete notification"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Premium Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  !isRead 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                }`}>
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      {getTypeLabel(notification.type)}
                    </span>
                    {!isRead && (
                      <span className="text-xs font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {notification.title}
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Message</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {notification.message}
                </p>
              </div>

              {/* Order Details */}
              {notification.type === 'order' && (
                <div className="grid grid-cols-2 gap-3">
                  {notification.itemCount && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Items</p>
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                        {notification.itemCount}
                      </p>
                    </div>
                  )}
                  {notification.sellerTotal && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Amount</p>
                      <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                        ₹{notification.sellerTotal.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Review Details */}
              {notification.type === 'review' && notification.rating && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg text-amber-600 dark:text-amber-400">
                      {'★'.repeat(notification.rating)}{'☆'.repeat(5 - notification.rating)}
                    </span>
                    <span className="text-lg font-bold text-amber-700 dark:text-amber-300">
                      {notification.rating}/5
                    </span>
                  </div>
                  {notification.customerName && (
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      By {notification.customerName}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                <Bell size={12} />
                <span>Received {formatDate(notification.createdAt)}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 dark:bg-slate-800 p-4 flex gap-3 border-t border-slate-200 dark:border-slate-700">
              {notification.link && (
                <button
                  onClick={handleNavigate}
                  className="flex-1 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors font-medium text-sm"
                >
                  View Details
                </button>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}