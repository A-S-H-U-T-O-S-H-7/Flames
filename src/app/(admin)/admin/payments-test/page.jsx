"use client";

import { useState } from 'react';
import PermissionGuard from '@/components/Admin/PermissionGuard';

export default function PaymentsTestPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Test payment hooks
  useState(() => {
    const testHooks = async () => {
      try {
        // Import the hooks to see if they cause errors
        const { 
          usePaymentAnalytics,
          useTransactions,
          usePayouts 
        } = await import('@/lib/firestore/payments/simple-admin');
        
        console.log('Payment hooks imported successfully');
        setLoading(false);
      } catch (err) {
        console.error('Error importing payment hooks:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    testHooks();
  }, []);

  if (loading) {
    return (
      <PermissionGuard requiredPermission="payments">
        <div className="p-6 bg-[#1e2737] min-h-screen">
          <div className="text-white">Loading payment system...</div>
        </div>
      </PermissionGuard>
    );
  }

  if (error) {
    return (
      <PermissionGuard requiredPermission="payments">
        <div className="p-6 bg-[#1e2737] min-h-screen">
          <div className="bg-red-900/20 border border-red-600/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Payment System Error</h2>
            <p className="text-red-400 mb-4">{error}</p>
            <details className="text-sm text-gray-300">
              <summary className="cursor-pointer">Error Details</summary>
              <pre className="mt-2 bg-gray-800 p-2 rounded overflow-x-auto">
                {error}
              </pre>
            </details>
          </div>
        </div>
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard requiredPermission="payments">
      <div className="p-6 bg-[#1e2737] min-h-screen">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Payment System Test</h1>
          <p className="text-gray-400">Testing payment components and hooks</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Stats Card Test */}
          <div className="bg-[#0e1726] rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Basic Stats Test</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-900/20 border border-green-600/20 rounded-lg p-4">
                <p className="text-green-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">₹0</p>
              </div>
              <div className="bg-blue-900/20 border border-blue-600/20 rounded-lg p-4">
                <p className="text-blue-400 text-sm">Transactions</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>

          {/* Component Status */}
          <div className="bg-[#0e1726] rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Component Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Payment Hooks</span>
                <span className="text-green-400">✓ Loaded</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Permissions</span>
                <span className="text-green-400">✓ Working</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Firebase Connection</span>
                <span className="text-yellow-400">⚠ Testing</span>
              </div>
            </div>
          </div>

          {/* Simple Transactions List */}
          <div className="bg-[#0e1726] rounded-xl p-6 border border-gray-700 md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">Sample Transactions</h3>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center p-3 bg-[#1e2737] rounded-lg">
                  <div>
                    <p className="text-white font-medium">Transaction #{i}</p>
                    <p className="text-gray-400 text-sm">Sample transaction data</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">₹100.00</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button 
            onClick={() => window.location.href = '/admin/payments'}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go to Full Payment Page
          </button>
          <button 
            onClick={() => console.log('Test button clicked')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Test Console Log
          </button>
        </div>
      </div>
    </PermissionGuard>
  );
}