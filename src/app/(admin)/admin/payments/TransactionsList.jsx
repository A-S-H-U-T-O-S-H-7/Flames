"use client";

import { useState, useEffect } from 'react';
import { Button } from "@nextui-org/react";
import { Edit2, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import toast from 'react-hot-toast';
import { usePermissions } from '@/context/PermissionContext';
import { getSellerIdFromAdmin } from '@/lib/permissions/sellerPermissions';

export default function TransactionsList() {
  const { adminData } = usePermissions();
  const [pageLimit, setPageLimit] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [allTransactions] = useState([
    // Mock data matching the admin table structure
    {
      id: 'txn_001',
      orderId: 'ORD-2024-001',
      seller: 'Tech Store',
      sellerId: 'seller_1',
      customer: 'John Doe',
      amount: 299.99,
      commission: 29.99,
      netAmount: 270.00,
      status: 'completed',
      paymentMethod: 'Card',
      date: '2024-01-10'
    },
    {
      id: 'txn_002',
      orderId: 'ORD-2024-002',
      seller: 'Fashion Hub',
      sellerId: 'seller_2',
      customer: 'Jane Smith',
      amount: 149.99,
      commission: 14.99,
      netAmount: 135.00,
      status: 'pending',
      paymentMethod: 'UPI',
      date: '2024-01-09'
    },
    {
      id: 'txn_003',
      orderId: 'ORD-2024-003',
      seller: 'Electronics Plus',
      sellerId: 'seller_1',
      customer: 'Mike Johnson',
      amount: 599.99,
      commission: 59.99,
      netAmount: 540.00,
      status: 'failed',
      paymentMethod: 'Wallet',
      date: '2024-01-08'
    }
  ]);

  const [transactions, setTransactions] = useState([]);

  // Filter transactions based on user role
  useEffect(() => {
    const sellerId = getSellerIdFromAdmin(adminData);
    
    if (sellerId) {
      // Seller: only show their own transactions
      const filtered = allTransactions.filter(transaction => transaction.sellerId === sellerId);
      setTransactions(filtered);
    } else {
      // Admin/Super Admin: show all transactions
      setTransactions(allTransactions);
    }
  }, [adminData, allTransactions]);

  const getStatusBadge = (status) => {
    const statusColors = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status] || statusColors.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleUpdateStatus = (newStatus) => {
    if (selectedTransaction) {
      // In a real app, this would make an API call
      toast.success(`Transaction status updated to ${newStatus}`);
      setIsEditModalOpen(false);
    }
  };

  const closeModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="bg-white dark:bg-[#0e1726] rounded-xl p-4 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm transition-all duration-200">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1e2737]">
                <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300 rounded-l-lg">#</th>
                <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300">Order ID</th>
                <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300">Seller</th>
                <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300">Customer</th>
                <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300">Amount</th>
                <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300">Commission</th>
                <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300">Status</th>
                <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300">Method</th>
                <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {transactions.map((transaction, index) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-[#1e2737] transition-colors">
                  <td className="px-4 py-4 text-center text-gray-600 dark:text-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-mono text-sm text-gray-900 dark:text-white">
                      {transaction.orderId}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {transaction.seller}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="text-gray-900 dark:text-white">
                      {transaction.customer}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Net: {formatCurrency(transaction.netAmount)}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(transaction.commission)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {((transaction.commission / transaction.amount) * 100).toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-4 py-4 text-center text-gray-600 dark:text-gray-300">
                    {transaction.paymentMethod}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        onPress={() => handleViewTransaction(transaction)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        onPress={() => handleEditTransaction(transaction)}
                        title="Edit Transaction"
                      >
                        <Edit2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pt-4 border-t border-gray-100 dark:border-gray-700">
        <Button
          size="sm"
          variant="bordered"
          className="w-full sm:w-auto flex items-center gap-1 border rounded-lg border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          isDisabled={true}
        >
          <ChevronLeft size={16} /> Previous
        </Button>

        <select
          value={pageLimit}
          onChange={(e) => setPageLimit(Number(e.target.value))}
          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0e1726] text-gray-900 dark:text-gray-100 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>

        <Button
          size="sm"
          variant="bordered"
          className="w-full sm:w-auto flex items-center gap-1 border rounded-lg border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          isDisabled={true}
        >
          Next <ChevronRight size={16} />
        </Button>
      </div>

      {/* View Transaction Modal */}
      {isViewModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30 dark:border-[#22c7d5]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Transaction Details
              </h3>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={closeModals}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Transaction ID</label>
                  <p className="text-gray-900 dark:text-white font-mono">{selectedTransaction.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Order ID</label>
                  <p className="text-gray-900 dark:text-white font-mono">{selectedTransaction.orderId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Seller</label>
                  <p className="text-gray-900 dark:text-white">{selectedTransaction.seller}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer</label>
                  <p className="text-gray-900 dark:text-white">{selectedTransaction.customer}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount</label>
                  <p className="text-gray-900 dark:text-white font-semibold">{formatCurrency(selectedTransaction.amount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Commission</label>
                  <p className="text-gray-900 dark:text-white">{formatCurrency(selectedTransaction.commission)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Amount</label>
                  <p className="text-gray-900 dark:text-white font-semibold">{formatCurrency(selectedTransaction.netAmount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Method</label>
                  <p className="text-gray-900 dark:text-white">{selectedTransaction.paymentMethod}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Date</label>
                  <p className="text-gray-900 dark:text-white">{selectedTransaction.date}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button
                color="primary"
                variant="bordered"
                onPress={closeModals}
                className="border-[#22c7d5] text-[#22c7d5] hover:bg-[#22c7d5] hover:text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {isEditModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 max-w-md w-full border border-purple-500/30 dark:border-[#22c7d5]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Transaction
              </h3>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={closeModals}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                  Transaction ID: {selectedTransaction.id}
                </label>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                  Update Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    color="success"
                    variant={selectedTransaction.status === 'completed' ? 'solid' : 'bordered'}
                    onPress={() => handleUpdateStatus('completed')}
                    className="w-full"
                  >
                    Completed
                  </Button>
                  <Button
                    size="sm"
                    color="warning"
                    variant={selectedTransaction.status === 'pending' ? 'solid' : 'bordered'}
                    onPress={() => handleUpdateStatus('pending')}
                    className="w-full"
                  >
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant={selectedTransaction.status === 'failed' ? 'solid' : 'bordered'}
                    onPress={() => handleUpdateStatus('failed')}
                    className="w-full"
                  >
                    Failed
                  </Button>
                  <Button
                    size="sm"
                    color="default"
                    variant={selectedTransaction.status === 'refunded' ? 'solid' : 'bordered'}
                    onPress={() => handleUpdateStatus('refunded')}
                    className="w-full"
                  >
                    Refunded
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="light"
                onPress={closeModals}
                className="text-gray-600 dark:text-gray-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
