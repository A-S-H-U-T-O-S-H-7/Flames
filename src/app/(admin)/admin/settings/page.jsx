"use client";

import { useState } from 'react';
import PermissionGuard from '@/components/Admin/PermissionGuard';
import { FaCog, FaGlobe, FaCreditCard, FaTruck, FaPercent, FaShieldAlt, FaUsers, FaDatabase } from 'react-icons/fa';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  
  const tabs = [
    { id: 'general', label: 'General Settings' },
    { id: 'payment', label: 'Payment Gateways' },
    { id: 'shipping', label: 'Shipping Config' },
    { id: 'tax', label: 'Tax Settings' },
    { id: 'security', label: 'Security' },
    { id: 'integrations', label: 'Integrations' }
  ];

  return (
    <PermissionGuard requiredPermission="settings">
      <main className="flex min-h-screen flex-col gap-4 p-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Configure site settings and integrations</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-green-800 border border-[#22c7d5] text-white text-base font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Save All Changes
            </button>
            <button className="bg-blue-800 border border-[#22c7d5] text-white text-base font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Reset to Defaults
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#22c7d5] text-white'
                  : 'bg-gray-100 dark:bg-[#0e1726] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1e2737]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <FaGlobe className="text-[#22c7d5]" />
                General Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Flames Marketplace"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Description
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="Your trusted marketplace for quality products"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      defaultValue="admin@flames.com"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Support Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue="+1-234-567-8900"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Currency
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white" defaultValue="INR">
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Language
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time Zone
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white">
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Maintenance Mode
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'payment' && (
            <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <FaCreditCard className="text-[#22c7d5]" />
                Payment Gateways
              </h2>
              <div className="space-y-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src="/stripe-logo.png" alt="Stripe" className="w-8 h-8" />
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">Stripe</h3>
                        <p className="text-sm text-gray-500">Accept credit cards and digital payments</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Publishable Key
                      </label>
                      <input
                        type="text"
                        placeholder="pk_test_..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-[#22c7d5] dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Secret Key
                      </label>
                      <input
                        type="password"
                        placeholder="sk_test_..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-[#22c7d5] dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src="/paypal-logo.png" alt="PayPal" className="w-8 h-8" />
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">PayPal</h3>
                        <p className="text-sm text-gray-500">Accept PayPal and credit card payments</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Client ID
                      </label>
                      <input
                        type="text"
                        placeholder="Your PayPal Client ID"
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-[#22c7d5] dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Client Secret
                      </label>
                      <input
                        type="password"
                        placeholder="Your PayPal Client Secret"
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-[#22c7d5] dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'shipping' && (
            <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <FaTruck className="text-[#22c7d5]" />
                Shipping Configuration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Shipping Method
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white">
                      <option value="standard">Standard Shipping</option>
                      <option value="express">Express Shipping</option>
                      <option value="overnight">Overnight Shipping</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Free Shipping Threshold
                    </label>
                    <input
                      type="number"
                      defaultValue="50"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Processing Time (days)
                    </label>
                    <input
                      type="text"
                      defaultValue="1-3"
                      placeholder="e.g., 1-3, 2-5"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Real-time Shipping Rates
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Order Tracking
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Require Signature for Delivery
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'tax' && (
            <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <FaPercent className="text-[#22c7d5]" />
                Tax Settings
              </h2>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Tax configuration settings coming soon...
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <FaShieldAlt className="text-[#22c7d5]" />
                Security Settings
              </h2>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Security configuration settings coming soon...
              </div>
            </div>
          )}
          
          {activeTab === 'integrations' && (
            <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <FaDatabase className="text-[#22c7d5]" />
                Third-party Integrations
              </h2>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Integration settings coming soon...
              </div>
            </div>
          )}
        </div>
      </main>
    </PermissionGuard>
  );
}