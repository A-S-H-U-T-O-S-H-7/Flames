"use client";

import { useState } from 'react';
import { Shield,MessageCircle, Headphones, Bell, CreditCard, Settings as SettingsIcon } from 'lucide-react';
import SecuritySettings from './PasswordSettings';
import NotificationSettings from './NotificationSettings';
import PaymentBusinessSettings from './Payment-BusinessSettings';
import SupportSettings from './SupportSettings';
import SellerFAQs from './SellerFAQs';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('security');

  const tabs = [
    { id: 'security', label: 'Security', icon: Shield, component: SecuritySettings },
    { id: 'payment', label: 'Payment & Business', icon: CreditCard, component: PaymentBusinessSettings },
    { id: 'support', label: 'Support', icon: Headphones, component: SupportSettings },
    { id: 'faqs', label: 'FAQs', icon: MessageCircle, component: SellerFAQs }

  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 dark:from-gray-900 dark:to-gray-900 px-1 md:px-4 py-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/30">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your account preferences and security settings
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs - Sticky */}
          <div className="lg:w-80">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-emerald-300 dark:border-emerald-600/50 p-4 sticky top-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-emerald-300 dark:border-emerald-600/50 p-2 md:p-6">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}