"use client";

import { Clock, CheckCircle, XCircle, AlertCircle, ChevronDown, IndianRupee, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import Pagination from '../Pangination';

export default function WithdrawalHistoryTable({ withdrawals, isLoading }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '₹0.00';
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        text: 'Pending',
        className: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700',
        iconColor: 'text-amber-600 dark:text-amber-400'
      },
      approved: {
        icon: CheckCircle,
        text: 'Approved',
        className: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700',
        iconColor: 'text-emerald-600 dark:text-emerald-400'
      },
      rejected: {
        icon: XCircle,
        text: 'Rejected',
        className: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-700',
        iconColor: 'text-rose-600 dark:text-rose-400'
      },
      processing: {
        icon: AlertCircle,
        text: 'Processing',
        className: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700',
        iconColor: 'text-blue-600 dark:text-blue-400'
      },
      cancelled: {
        icon: XCircle,
        text: 'Cancelled',
        className: 'bg-slate-200 text-slate-700 border-slate-400 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
        iconColor: 'text-slate-600 dark:text-slate-500'
      }
    };

    return configs[status?.toLowerCase()] || {
      icon: Clock,
      text: status,
      className: 'bg-slate-200 text-slate-700 border-slate-400 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
      iconColor: 'text-slate-600 dark:text-slate-500'
    };
  };

  // Filter withdrawals based on status
  const filteredWithdrawals = withdrawals?.filter(withdrawal => 
    statusFilter === 'all' || withdrawal.status?.toLowerCase() === statusFilter
  ) || [];

  // Pagination logic
  const totalItems = filteredWithdrawals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWithdrawals = filteredWithdrawals.slice(startIndex, startIndex + itemsPerPage);

  const cellBase = "px-4 py-4 border-r";
  const cellBorder = "border-emerald-300/40 dark:border-emerald-600/40";
  const cellStyle = `${cellBase} ${cellBorder}`;
  

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-emerald-300/40 dark:border-emerald-600/40 shadow-sm">
        <div className="px-6 py-4 border-b border-emerald-300/40 dark:border-emerald-600/40 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-slate-800/50 dark:to-slate-900/50">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Withdrawal History</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track your payout requests and their status
          </p>
        </div>
        <div className="p-12 text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-emerald-300/40 dark:border-emerald-600/40 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-emerald-300/40 dark:border-emerald-600/40 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-slate-800/50 dark:to-slate-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Withdrawal History</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Track your payout requests and their status
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Items Per Page */}
            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      {!withdrawals || withdrawals.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-300 dark:border-slate-700">
            <IndianRupee className="w-8 h-8 text-slate-400 dark:text-slate-600" />
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-medium mb-2">No withdrawal requests yet</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 max-w-sm mx-auto">
            Your withdrawal requests will appear here once you make them
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50">
                <tr>
                  <th className={`${cellStyle} text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider`}>
                    Date
                  </th>
                  <th className={`${cellStyle} text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider`}>
                    Amount
                  </th>
                  <th className={`${cellStyle} text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider`}>
                    You'll Receive
                  </th>
                  <th className={`${cellStyle} text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider`}>
                    Status
                  </th>
                  <th className={`${cellBase} text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider`}>
                    Note
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {paginatedWithdrawals.map((withdrawal, index) => {
                  const statusConfig = getStatusConfig(withdrawal.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr
                      key={withdrawal.id}
                      className={`border-b transition-all duration-200 hover:shadow-lg border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-slate-700/50 ${
                        index % 2 === 0
                          ? "bg-slate-100/60 dark:bg-slate-800/30"
                          : "bg-white dark:bg-slate-800/10"
                      }`}
                    >
                      {/* Date */}
                      <td className={cellStyle}>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {formatDate(withdrawal.createdAt)}
                        </div>
                      </td>

                      {/* Amount Requested */}
                      <td className={cellStyle}>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-slate-900 dark:text-white">
                            {formatCurrency(withdrawal.amountRequested)}
                          </span>
                        </div>
                      </td>

                      {/* Net Payable */}
                      <td className={cellStyle}>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(withdrawal.breakdown?.netPayable || 0)}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            After {withdrawal.breakdown?.commissionRate || 0}% fee
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className={cellStyle}>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.className}`}>
                          <StatusIcon className={`w-3 h-3 ${statusConfig.iconColor}`} />
                          {statusConfig.text}
                        </span>
                      </td>

                      {/* Note */}
                      <td className={cellBase}>
                        <div className="text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          {withdrawal.sellerNote || withdrawal.adminNote || (
                            <span className="text-slate-400 dark:text-slate-600 italic">-</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              itemLabel="transactions"
              className="border-t border-emerald-300/40 dark:border-emerald-600/40"
            />
          )}
        </>
      )}
    </div>
  );
}