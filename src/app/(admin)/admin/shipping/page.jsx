"use client";

import { useState } from 'react';
import PermissionGuard from '@/components/Admin/PermissionGuard';
import ShippingStatsCards from './ShippingStatsCards';
import ShippingPartners from './ShippingPartners';
import DeliveryZones from './DeliveryZones';
import ShippingRates from './ShippingRates';
import OrderTracking from './OrderTracking';

export default function AdminShippingPage() {
  const [activeTab, setActiveTab] = useState('partners');
  
  const tabs = [
    { id: 'partners', label: 'Shipping Partners' },
    { id: 'zones', label: 'Delivery Zones' },
    { id: 'rates', label: 'Shipping Rates' },
    { id: 'tracking', label: 'Order Tracking' },
    { id: 'returns', label: 'Returns & RTO' }
  ];

  return (
    <PermissionGuard requiredPermission="shipping">
      <main className="flex min-h-screen flex-col gap-4 p-5">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl">Shipping & Delivery</h1>
          <div className="flex gap-3">
            <button className="bg-purple-800 border border-[#22c7d5] text-white text-base font-semibold px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Add Partner
            </button>
            <button className="bg-green-800 border border-[#22c7d5] text-white text-base font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Bulk Update Rates
            </button>
            <button className="bg-blue-800 border border-[#22c7d5] text-white text-base font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>
        
        <ShippingStatsCards />
        
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
          {activeTab === 'partners' && <ShippingPartners />}
          {activeTab === 'zones' && <DeliveryZones />}
          {activeTab === 'rates' && <ShippingRates />}
          {activeTab === 'tracking' && <OrderTracking />}
          {activeTab === 'returns' && (
            <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Returns & RTO Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Return Requests</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Handle customer return requests and approvals</p>
                  <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    View Requests
                  </button>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">RTO Orders</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage Return to Origin orders</p>
                  <button className="mt-3 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
                    View RTOs
                  </button>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Return Analytics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Return patterns and cost analysis</p>
                  <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </PermissionGuard>
  );
}