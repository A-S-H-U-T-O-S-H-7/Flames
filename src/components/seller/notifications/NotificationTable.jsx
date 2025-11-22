"use client";

import { Bell } from 'lucide-react';
import NotificationCard from './NotificationCard';

export default function NotificationTable({ notifications }) {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
          <Bell size={40} className="mb-3 opacity-50" />
          <p className="text-base font-medium">No notifications found</p>
          <p className="mt-1 text-sm">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationCard 
          key={notification.id} 
          notification={notification}
        />
      ))}
    </div>
  );
}