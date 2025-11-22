"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firestore/firebase';
import { formatDistanceToNow } from 'date-fns';

export default function DisputesList() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const disputesRef = collection(db, 'disputes');
    const q = query(disputesRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const disputesData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
            resolvedAt: data.resolvedAt?.toDate ? data.resolvedAt.toDate() : null
          };
        });
        setDisputes(disputesData);
        setLoading(false);
      } catch (error) {
        console.error('Error processing disputes data:', error);
        setLoading(false);
      }
    }, (error) => {
      console.error('Error fetching disputes:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateDisputeStatus = async (disputeId, newStatus) => {
    try {
      const disputeRef = doc(db, 'disputes', disputeId);
      const updateData = {
        status: newStatus,
        ...(newStatus === 'resolved' && { resolvedAt: new Date() }),
        ...(newStatus === 'closed' && { closedAt: new Date() })
      };
      await updateDoc(disputeRef, updateData);
    } catch (error) {
      console.error('Error updating dispute status:', error);
    }
  };

  const filteredDisputes = disputes.filter(dispute => {
    if (filter === 'all') return true;
    return dispute.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'investigating': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'escalated': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'chargeback': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'fraud': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'quality': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'delivery': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
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
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Payment Disputes</h2>
        
        <div className="flex gap-2">
          {['all', 'open', 'investigating', 'resolved', 'closed', 'escalated'].map((status) => (
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
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Dispute ID</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Order/Transaction</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Amount</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Type</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Priority</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Status</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Created</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDisputes.map((dispute) => (
              <tr key={dispute.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-4 px-2">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">#{dispute.id?.slice(0, 8)}</div>
                    <div className="text-sm text-gray-500">{dispute.customerName}</div>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">#{dispute.orderId?.slice(0, 8)}</div>
                    <div className="text-sm text-gray-500">{dispute.productName}</div>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    ${dispute.amount ? dispute.amount.toFixed(2) : '0.00'}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(dispute.type)}`}>
                    {dispute.type || 'N/A'}
                  </span>
                </td>
                <td className="py-4 px-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(dispute.priority)}`}>
                    {dispute.priority || 'N/A'}
                  </span>
                </td>
                <td className="py-4 px-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dispute.status)}`}>
                    {dispute.status || 'N/A'}
                  </span>
                </td>
                <td className="py-4 px-2">
                  <div className="text-sm text-gray-500">
                    {dispute.createdAt && formatDistanceToNow(dispute.createdAt, { addSuffix: true })}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="flex gap-2">
                    {dispute.status === 'open' && (
                      <button
                        onClick={() => updateDisputeStatus(dispute.id, 'investigating')}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        Start Investigation
                      </button>
                    )}
                    {dispute.status === 'investigating' && (
                      <>
                        <button
                          onClick={() => updateDisputeStatus(dispute.id, 'resolved')}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => updateDisputeStatus(dispute.id, 'escalated')}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                        >
                          Escalate
                        </button>
                      </>
                    )}
                    {dispute.status === 'resolved' && (
                      <button
                        onClick={() => updateDisputeStatus(dispute.id, 'closed')}
                        className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                      >
                        Close
                      </button>
                    )}
                    <button className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDisputes.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No disputes found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}