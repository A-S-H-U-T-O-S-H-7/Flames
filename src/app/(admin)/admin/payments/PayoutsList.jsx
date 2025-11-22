"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firestore/firebase';
import { formatDistanceToNow } from 'date-fns';

export default function PayoutsList() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const payoutsRef = collection(db, 'payouts');
    const q = query(payoutsRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const payoutsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
            processedAt: data.processedAt?.toDate ? data.processedAt.toDate() : null
          };
        });
        setPayouts(payoutsData);
        setLoading(false);
      } catch (error) {
        console.error('Error processing payouts data:', error);
        setLoading(false);
      }
    }, (error) => {
      console.error('Error fetching payouts:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updatePayoutStatus = async (payoutId, newStatus) => {
    try {
      const payoutRef = doc(db, 'payouts', payoutId);
      const updateData = {
        status: newStatus,
        ...(newStatus === 'processed' && { processedAt: new Date() })
      };
      await updateDoc(payoutRef, updateData);
    } catch (error) {
      console.error('Error updating payout status:', error);
    }
  };

  const filteredPayouts = payouts.filter(payout => {
    if (filter === 'all') return true;
    return payout.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'approved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'processed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Seller Payouts</h2>
        
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'processed', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-[#22c7d5] text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Seller</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Amount</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Commission</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Period</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Status</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Requested</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayouts.map((payout) => (
              <tr key={payout.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-4 px-2">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{payout.sellerName}</div>
                    <div className="text-sm text-gray-500">{payout.sellerEmail}</div>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    ₹{payout.amount ? payout.amount.toFixed(2) : '0.00'}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-gray-600 dark:text-gray-300">
                    ₹{payout.commission ? payout.commission.toFixed(2) : '0.00'}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {payout.periodStart} - {payout.periodEnd}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payout.status)}`}>
                    {payout.status}
                  </span>
                </td>
                <td className="py-4 px-2">
                  <div className="text-sm text-gray-500">
                    {payout.createdAt && formatDistanceToNow(payout.createdAt, { addSuffix: true })}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="flex gap-2">
                    {payout.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updatePayoutStatus(payout.id, 'approved')}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updatePayoutStatus(payout.id, 'rejected')}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {payout.status === 'approved' && (
                      <button
                        onClick={() => updatePayoutStatus(payout.id, 'processed')}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        Mark Processed
                      </button>
                    )}
                    <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPayouts.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No payouts found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}