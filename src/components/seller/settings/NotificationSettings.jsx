"use client";

import { useState } from 'react';
import { Bell, Mail, MessageSquare } from 'lucide-react';

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    email: {
      orders: true,
      payments: true,
      promotions: false,
      security: true
    },
    push: {
      orders: true,
      payments: false,
      promotions: false,
      security: true
    },
    sms: {
      orders: false,
      payments: true,
      promotions: false,
      security: false
    }
  });

  const handleToggle = (category, type) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type]
      }
    }));
  };

  const NotificationCategory = ({ title, icon: Icon, category, items }) => (
    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
          <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>

      <div className="space-y-4">
        {Object.entries(items).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-white capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {getNotificationDescription(key)}
              </p>
            </div>
            <button
              onClick={() => handleToggle(category, key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications[category][key]
                  ? 'bg-teal-500'
                  : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications[category][key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const getNotificationDescription = (type) => {
    const descriptions = {
      orders: 'Get notified about new orders and order updates',
      payments: 'Receive payment confirmation and settlement alerts',
      promotions: 'Special offers and promotional campaigns',
      security: 'Important security alerts and account activities'
    };
    return descriptions[type] || 'Notification settings';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Notification Preferences</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Choose how you want to receive notifications
        </p>
      </div>

      <div className="space-y-6">
        <NotificationCategory
          title="Email Notifications"
          icon={Mail}
          category="email"
          items={notifications.email}
        />

        <NotificationCategory
          title="Push Notifications"
          icon={Bell}
          category="push"
          items={notifications.push}
        />

        <NotificationCategory
          title="SMS Notifications"
          icon={MessageSquare}
          category="sms"
          items={notifications.sms}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
          Save Preferences
        </button>
      </div>
    </div>
  );
}