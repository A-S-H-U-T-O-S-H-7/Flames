"use client";

import { useState } from 'react';
import PermissionGuard from '@/components/Admin/PermissionGuard';
import InventoryStatsCards from './InventoryStatsCards';
import StockAlerts from './StockAlerts';
import InventoryList from './InventoryList';
import SuppliersList from './SuppliersList';
import BulkUpdateModal from './BulkUpdateModal';

export default function AdminInventoryPage() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  
  const tabs = [
    { id: 'inventory', label: 'Inventory' },
    { id: 'alerts', label: 'Stock Alerts' },
    { id: 'suppliers', label: 'Suppliers' },
    { id: 'reports', label: 'Reports' }
  ];

  return (
    <PermissionGuard requiredPermission="inventory">
      <main className="flex min-h-screen flex-col gap-4 p-5">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl">Inventory Management</h1>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowBulkUpdate(true)}
              className="bg-purple-800 border border-[#22c7d5] text-white text-base font-semibold px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Bulk Update
            </button>
            <button className="bg-green-800 border border-[#22c7d5] text-white text-base font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Import Stock
            </button>
            <button className="bg-blue-800 border border-[#22c7d5] text-white text-base font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>
        
        <InventoryStatsCards />
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4">
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
        
        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === 'inventory' && <InventoryList />}
          {activeTab === 'alerts' && <StockAlerts />}
          {activeTab === 'suppliers' && <SuppliersList />}
          {activeTab === 'reports' && (
            <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Inventory Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Stock Valuation Report</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current inventory value and cost analysis</p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">ABC Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Product categorization by sales volume</p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Slow Moving Stock</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Products with low turnover rates</p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Supplier Performance</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Delivery and quality metrics by supplier</p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Stock Movement</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Inventory in/out transactions</p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Reorder Recommendations</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered stock replenishment suggestions</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {showBulkUpdate && (
          <BulkUpdateModal
            onClose={() => setShowBulkUpdate(false)}
            onUpdate={() => setShowBulkUpdate(false)}
          />
        )}
      </main>
    </PermissionGuard>
  );
}