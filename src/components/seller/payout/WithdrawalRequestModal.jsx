"use client";

import { useState, useEffect } from 'react';
import { X, AlertCircle, TrendingDown, DollarSign } from 'lucide-react';
import { createWithdrawalRequest } from '@/lib/firestore/withdrawals/write';
import { calculateWithdrawalBreakdown } from '@/lib/firestore/withdrawals/calculations';
import toast from 'react-hot-toast';

export default function WithdrawalRequestModal({ 
  isOpen, 
  onClose, 
  wallet, 
  sellerId,
  sellerCommission 
}) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [breakdown, setBreakdown] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minWithdrawal = 100;
  const maxWithdrawal = wallet?.availableBalance || 0;

  // Calculate breakdown when amount changes
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      try {
        const bd = calculateWithdrawalBreakdown(
          parseFloat(amount), 
          sellerCommission || 10
        );
        setBreakdown(bd);
      } catch (error) {
        setBreakdown(null);
      }
    } else {
      setBreakdown(null);
    }
  }, [amount, sellerCommission]);

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '₹0.00';
    return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestAmount = parseFloat(amount);

    // Validate
    if (!requestAmount || requestAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (requestAmount < minWithdrawal) {
      toast.error(`Minimum withdrawal amount is ${formatCurrency(minWithdrawal)}`);
      return;
    }

    if (requestAmount > maxWithdrawal) {
      toast.error(`Insufficient balance. Available: ${formatCurrency(maxWithdrawal)}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createWithdrawalRequest({
        sellerId,
        amount: requestAmount,
        note: note.trim()
      });

      if (result.success) {
        toast.success('Withdrawal request submitted successfully!');
        onClose();
        // Reset form
        setAmount('');
        setNote('');
        setBreakdown(null);
      } else {
        toast.error(result.error || 'Failed to submit request');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Withdrawal request error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetMax = () => {
    setAmount(maxWithdrawal.toString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
            Request Payout
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* Available Balance */}
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-1">Available Balance</p>
            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {formatCurrency(maxWithdrawal)}
            </p>
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Withdrawal Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                ₹
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min={minWithdrawal}
                max={maxWithdrawal}
                step="0.01"
                required
                className="w-full pl-8 pr-20 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleSetMax}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 rounded"
              >
                MAX
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Min: {formatCurrency(minWithdrawal)} • Max: {formatCurrency(maxWithdrawal)}
            </p>
          </div>

          {/* Breakdown */}
          {breakdown && (
            <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg space-y-2">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Breakdown</p>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Gross Amount</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {formatCurrency(breakdown.grossAmount)}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Commission ({breakdown.commissionRate}%)
                </span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  - {formatCurrency(breakdown.commissionAmount)}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">GST (18%)</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  - {formatCurrency(breakdown.gstOnCommission)}
                </span>
              </div>
              
              <div className="pt-2 border-t border-slate-200 dark:border-slate-600 flex justify-between">
                <span className="font-semibold text-slate-900 dark:text-white">You'll Receive</span>
                <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(breakdown.netPayable)}
                </span>
              </div>
            </div>
          )}

          {/* Note */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any additional information..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none"
            />
          </div>

          {/* Info */}
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Your withdrawal request will be processed by admin within 2-3 business days.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !amount || parseFloat(amount) < minWithdrawal}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
