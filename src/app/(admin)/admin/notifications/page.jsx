"use client";

import { useState } from 'react';
import PermissionGuard from '@/components/Admin/PermissionGuard';
import { FaBell, FaEnvelope, FaMobileAlt, FaBullhorn, FaUsers, FaCog } from 'react-icons/fa';

export default function AdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState('templates');
  
  const tabs = [
    { id: 'templates', label: 'Email Templates' },
    { id: 'push', label: 'Push Notifications' },
    { id: 'sms', label: 'SMS Templates' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'settings', label: 'Settings' }
  ];

  const emailTemplates = [
    {
      id: 1,
      name: 'Order Confirmation',
      type: 'transactional',
      status: 'active',
      lastModified: '2024-01-15',
      usage: 1247
    },
    {
      id: 2,
      name: 'Shipping Notification',
      type: 'transactional',
      status: 'active',
      lastModified: '2024-01-14',
      usage: 856
    },
    {
      id: 3,
      name: 'Welcome Email',
      type: 'marketing',
      status: 'active',
      lastModified: '2024-01-13',
      usage: 342
    }
  ];

  return (
    <PermissionGuard requiredPermission="notifications">
      <main className="flex min-h-screen flex-col gap-4 p-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage communication templates and announcements</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-green-800 border border-[#22c7d5] text-white text-base font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Create Template
            </button>
            <button className="bg-blue-800 border border-[#22c7d5] text-white text-base font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Send Announcement
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Emails Sent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12,847</p>
                <p className="text-sm text-green-600 dark:text-green-400">This month</p>
              </div>
              <FaEnvelope className="text-3xl text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Push Notifications</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3,256</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Last 7 days</p>
              </div>
              <FaBell className="text-3xl text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">SMS Sent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">2,184</p>
                <p className="text-sm text-purple-600 dark:text-purple-400">This month</p>
              </div>
              <FaMobileAlt className="text-3xl text-green-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">68.5%</p>
                <p className="text-sm text-green-600 dark:text-green-400">+2.3% improvement</p>
              </div>
              <FaBullhorn className="text-3xl text-red-600" />
            </div>
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
          {activeTab === 'templates' && (
            <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Email Templates</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Template Name</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Type</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Status</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Usage</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Last Modified</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailTemplates.map((template) => (
                      <tr key={template.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-4 px-2">
                          <div className="font-medium text-gray-900 dark:text-white">{template.name}</div>
                        </td>
                        <td className="py-4 px-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            template.type === 'transactional' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          }`}>
                            {template.type}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            template.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {template.status}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <div className="text-gray-600 dark:text-gray-300">{template.usage.toLocaleString()}</div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="text-sm text-gray-500">{template.lastModified}</div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                              Edit
                            </button>
                            <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                              Preview
                            </button>
                            <button className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors">
                              Test
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'push' && (
            <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Push Notifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Send Push Notification</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter notification title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                      <textarea 
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter notification message"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Audience</label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white">
                        <option value="all">All Users</option>
                        <option value="customers">Customers Only</option>
                        <option value="sellers">Sellers Only</option>
                        <option value="inactive">Inactive Users</option>
                      </select>
                    </div>
                    <button className="w-full bg-[#22c7d5] text-white py-2 rounded-lg hover:bg-[#1aa5b5] transition-colors">
                      Send Notification
                    </button>
                  </form>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Recent Push Notifications</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">New Products Available</p>
                      <p className="text-xs text-gray-500 mt-1">Sent 2 hours ago • 1,234 recipients</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Flash Sale Starting Soon</p>
                      <p className="text-xs text-gray-500 mt-1">Sent 1 day ago • 5,678 recipients</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'sms' && (
            <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">SMS Templates</h2>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                SMS template management coming soon...
              </div>
            </div>
          )}
          
          {activeTab === 'announcements' && (
            <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">System Announcements</h2>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Announcement management coming soon...
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Notification Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Email Configuration</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">SMTP Server</span>
                      <input type="text" className="px-3 py-1 border rounded text-sm w-48" placeholder="smtp.example.com" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">SMTP Port</span>
                      <input type="number" className="px-3 py-1 border rounded text-sm w-48" placeholder="587" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">From Email</span>
                      <input type="email" className="px-3 py-1 border rounded text-sm w-48" placeholder="noreply@example.com" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Push Notification Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Enable Push Notifications</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="bg-[#22c7d5] text-white px-6 py-2 rounded-lg hover:bg-[#1aa5b5] transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </PermissionGuard>
  );
}