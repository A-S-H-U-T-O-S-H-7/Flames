// components/seller/payments/PaymentSummary.jsx
"use client";
import React from "react";

export function PaymentSummary({ payments }) {
  // Calculate counts and amounts for each status
  const paidPayments = payments.filter(p => p.status === 'paid');
  const collectedPayments = payments.filter(p => p.status === 'collected');
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const failedPayments = payments.filter(p => p.status === 'failed');

  // Calculate total amounts
  const paidAmount = paidPayments.reduce((sum, p) => sum + (p.grossAmount || 0), 0);
  const collectedAmount = collectedPayments.reduce((sum, p) => sum + (p.grossAmount || 0), 0);
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + (p.grossAmount || 0), 0);
  const failedAmount = failedPayments.reduce((sum, p) => sum + (p.grossAmount || 0), 0);

  // Total payments count
  const totalPayments = payments.length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* Total Payments */}
      <div className="bg-white border border-slate-300 dark:bg-slate-800 p-4 rounded-lg shadow text-center">
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
          Total Payments
        </div>
        <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
          {totalPayments}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          All Transactions
        </div>
      </div>

      {/* Paid */}
      <div className="bg-green-50 border border-green-200 dark:bg-green-900/30 p-4 rounded-lg shadow text-center">
        <div className="text-sm text-green-600 dark:text-green-400 mb-1">
          Paid Amount
        </div>
        <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">
          ₹{paidAmount.toFixed(2)}
        </div>
        <div className="text-xs text-green-500 dark:text-green-400">
          {paidPayments.length} Payment{paidPayments.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Collected */}
      <div className="bg-blue-50 border border-blue-200 dark:bg-blue-900/30 p-4 rounded-lg shadow text-center">
        <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">
          Collected Amount
        </div>
        <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">
          ₹{collectedAmount.toFixed(2)}
        </div>
        <div className="text-xs text-blue-500 dark:text-blue-400">
          {collectedPayments.length} Payment{collectedPayments.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Pending */}
      <div className="bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/30 p-4 rounded-lg shadow text-center">
        <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">
          Pending Amount
        </div>
        <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
          ₹{pendingAmount.toFixed(2)}
        </div>
        <div className="text-xs text-yellow-500 dark:text-yellow-400">
          {pendingPayments.length} Payment{pendingPayments.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Failed */}
      <div className="bg-red-50 border border-red-200 dark:bg-red-900/30 p-4 rounded-lg shadow text-center">
        <div className="text-sm text-red-600 dark:text-red-400 mb-1">
          Failed Amount
        </div>
        <div className="text-xl font-bold text-red-600 dark:text-red-400 mb-1">
          ₹{failedAmount.toFixed(2)}
        </div>
        <div className="text-xs text-red-500 dark:text-red-400">
          {failedPayments.length} Payment{failedPayments.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}