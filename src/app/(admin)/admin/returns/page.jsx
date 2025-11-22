"use client";

import { useState } from 'react';
import PermissionGuard from '@/components/Admin/PermissionGuard';
import { FaUndoAlt, FaShippingFast, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

export default function AdminReturnsPage() {
  const [activeTab, setActiveTab] = useState('returns');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const tabs = [
    { id: 'returns', label: 'Return Requests' },
    { id: 'rto', label: 'RTO Orders' },
    { id: 'replacements', label: 'Replacements' },
    { id: 'analytics', label: 'Return Analytics' }
  ];

  const mockReturns = [
    {
      id: 'RET001',
      orderId: 'ORD12345',
      customerName: 'John Doe',
      productName: 'Wireless Bluetooth Headphones',
      reason: 'Product not as described',
      status: 'pending',
      amount: 89.99,
      requestDate: '2024-01-15',
      images: ['return1.jpg', 'return2.jpg']
    },
    {
      id: 'RET002',
      orderId: 'ORD12346',
      customerName: 'Jane Smith',
      productName: 'Smart Watch',
      reason: 'Defective product',
      status: 'approved',
      amount: 299.99,
      requestDate: '2024-01-14',
      images: ['return3.jpg']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <PermissionGuard requiredPermission="returns">
      <main className="flex min-h-screen flex-col gap-4 p-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Returns & Refunds</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Handle return requests and refund processing</p>
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="processing">Processing</option>
            </select>
            <button className="bg-blue-800 border border-[#22c7d5] text-white text-base font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Returns</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Requires action</p>
              </div>
              <FaExclamationTriangle className="text-3xl text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">RTO Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">In transit</p>
              </div>
              <FaShippingFast className="text-3xl text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Returns</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
                <p className="text-sm text-green-600 dark:text-green-400">This month</p>
              </div>
              <FaCheckCircle className="text-3xl text-green-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Return Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">2.3%</p>
                <p className="text-sm text-red-600 dark:text-red-400">+0.2% from last month</p>
              </div>
              <FaUndoAlt className="text-3xl text-red-600" />
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
          {activeTab === 'returns' && (
            <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Return Requests</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Return ID</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Order</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Customer</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Product</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Reason</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Amount</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Status</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockReturns.map((returnItem) => (
                      <tr key={returnItem.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-4 px-2">
                          <div className="font-medium text-gray-900 dark:text-white">#{returnItem.id}</div>
                          <div className="text-sm text-gray-500">{returnItem.requestDate}</div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="font-medium text-gray-900 dark:text-white">#{returnItem.orderId}</div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="font-medium text-gray-900 dark:text-white">{returnItem.customerName}</div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                            {returnItem.productName}
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="text-sm text-gray-600 dark:text-gray-300">{returnItem.reason}</div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="font-semibold text-gray-900 dark:text-white">${returnItem.amount}</div>
                        </td>
                        <td className="py-4 px-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(returnItem.status)}`}>
                            {returnItem.status}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                              View
                            </button>
                            {returnItem.status === 'pending' && (
                              <>
                                <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                                  Approve
                                </button>
                                <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'rto' && (
            <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">RTO (Return to Origin) Orders</h2>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                RTO order management interface coming soon...
              </div>
            </div>
          )}
          
          {activeTab === 'replacements' && (
            <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Product Replacements</h2>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Replacement request management coming soon...
              </div>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Return Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Top Return Reasons</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Analysis of most common return reasons</p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Return Rate by Category</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Product category return patterns</p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Cost Impact Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Financial impact of returns</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </PermissionGuard>
  );
}