"use client";

import { useState } from 'react';
import PermissionGuard from '@/components/Admin/PermissionGuard';
import PaymentStatsCards from './PaymentStatsCards';
import TransactionsList from './TransactionsList';
import PayoutsList from './PayoutsList';
import RefundsList from './RefundsList';
import DisputesList from './DisputesList';
import PayoutGenerator from './PayoutGenerator';

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = useState('transactions');
  const [showPayoutGenerator, setShowPayoutGenerator] = useState(false);
  
  const tabs = [
    { id: 'transactions', label: 'Transactions' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'refunds', label: 'Refunds' },
    { id: 'disputes', label: 'Disputes' }
  ];

  return (
    <PermissionGuard requiredPermission="payments">
      <main className="flex min-h-screen flex-col gap-4 p-5">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl">Payments & Transactions</h1>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowPayoutGenerator(true)}
              className="bg-green-800 border border-[#22c7d5] text-white text-base font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Generate Payouts
            </button>
            <button className="bg-blue-800 border border-[#22c7d5] text-white text-base font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Export Data
            </button>
          </div>
        </div>
        
        <PaymentStatsCards />
        
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
          {activeTab === 'transactions' && <TransactionsList />}
          {activeTab === 'payouts' && <PayoutsList />}
          {activeTab === 'refunds' && <RefundsList />}
          {activeTab === 'disputes' && <DisputesList />}
        </div>
        
        {showPayoutGenerator && (
          <PayoutGenerator
            onClose={() => setShowPayoutGenerator(false)}
            onGenerated={(payouts) => {
              console.log('Generated payouts:', payouts);
              setShowPayoutGenerator(false);
            }}
          />
        )}
      </main>
    </PermissionGuard>
  );
}
