"use client";

import { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firestore/firebase';

export default function PayoutGenerator({ onClose, onGenerated }) {
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState({
    start: '',
    end: ''
  });
  const [minAmount, setMinAmount] = useState(50);

  const generatePayouts = async () => {
    setLoading(true);
    try {
      // Get all transactions for the period
      const transactionsRef = collection(db, 'transactions');
      const q = query(
        transactionsRef,
        where('status', '==', 'completed'),
        where('createdAt', '>=', new Date(period.start)),
        where('createdAt', '<=', new Date(period.end))
      );
      
      const snapshot = await getDocs(q);
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Group transactions by seller
      const sellerTotals = {};
      
      transactions.forEach(transaction => {
        const sellerId = transaction.sellerId;
        if (!sellerTotals[sellerId]) {
          sellerTotals[sellerId] = {
            sellerId,
            sellerName: transaction.sellerName || 'Unknown Seller',
            sellerEmail: transaction.sellerEmail || '',
            totalSales: 0,
            platformFee: 0,
            commission: 0,
            netAmount: 0,
            transactionCount: 0
          };
        }
        
        const saleAmount = transaction.amount || 0;
        const commissionRate = transaction.commissionRate || 0.15; // 15% default
        const commissionAmount = saleAmount * commissionRate;
        const netAmount = saleAmount - commissionAmount;
        
        sellerTotals[sellerId].totalSales += saleAmount;
        sellerTotals[sellerId].commission += commissionAmount;
        sellerTotals[sellerId].netAmount += netAmount;
        sellerTotals[sellerId].transactionCount += 1;
      });

      // Create payouts for sellers with minimum amount
      const payoutsCreated = [];
      const payoutsRef = collection(db, 'payouts');
      
      for (const sellerId in sellerTotals) {
        const sellerData = sellerTotals[sellerId];
        
        if (sellerData.netAmount >= minAmount) {
          const payoutData = {
            sellerId: sellerId,
            sellerName: sellerData.sellerName,
            sellerEmail: sellerData.sellerEmail,
            amount: sellerData.netAmount,
            commission: sellerData.commission,
            totalSales: sellerData.totalSales,
            transactionCount: sellerData.transactionCount,
            periodStart: period.start,
            periodEnd: period.end,
            status: 'pending',
            createdAt: new Date(),
            createdBy: 'admin' // You might want to get the actual admin user
          };
          
          const docRef = await addDoc(payoutsRef, payoutData);
          payoutsCreated.push({ id: docRef.id, ...payoutData });
        }
      }

      onGenerated?.(payoutsCreated);
      onClose?.();
      
    } catch (error) {
      console.error('Error generating payouts:', error);
      alert('Error generating payouts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Generate Payouts</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Period Start Date
            </label>
            <input
              type="date"
              value={period.start}
              onChange={(e) => setPeriod({ ...period, start: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Period End Date
            </label>
            <input
              type="date"
              value={period.end}
              onChange={(e) => setPeriod({ ...period, end: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Payout Amount ($)
            </label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
              min="0"
              step="0.01"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-400">
              This will generate payouts for all sellers who have earned at least ${minAmount} 
              during the selected period.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={generatePayouts}
            disabled={loading || !period.start || !period.end}
            className="flex-1 px-4 py-2 bg-[#22c7d5] text-white rounded-lg hover:bg-[#1aa5b5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generating...' : 'Generate Payouts'}
          </button>
        </div>
      </div>
    </div>
  );
}