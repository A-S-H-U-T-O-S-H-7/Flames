"use client";

import { useState } from 'react';
import { useSellerWallet } from '@/lib/firestore/wallet/read';
import { useSellerWithdrawals } from '@/lib/firestore/withdrawals/read';
import WalletCards from './WalletCards';
import WithdrawalRequestModal from './WithdrawalRequestModal';
import WithdrawalHistoryTable from './WithdrawalHistoryTable';

export default function PayoutPage({ seller }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sellerId = seller?.id || seller?.sellerId;
  const sellerCommission = seller?.commission || seller?.bankDetails?.platformFee || 10;

  // Fetch real-time wallet data
  const { wallet, isLoading: walletLoading, error: walletError } = useSellerWallet(sellerId);

  // Fetch real-time withdrawal requests
  const { withdrawals, isLoading: withdrawalsLoading, error: withdrawalsError } = useSellerWithdrawals({
    sellerId,
    status: null, 
    limitCount: 50
  });

  // Loading state
  if (walletLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (walletError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <p className="text-red-600 dark:text-red-400">Failed to load wallet data</p>
        <p className="text-sm text-red-500 dark:text-red-400 mt-1">{walletError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Wallet Cards */}
      <WalletCards 
        wallet={wallet} 
        onRequestPayout={() => setIsModalOpen(true)} 
      />

      {/* Withdrawal History */}
      <WithdrawalHistoryTable 
        withdrawals={withdrawals} 
        isLoading={withdrawalsLoading} 
      />

      {/* Withdrawal Request Modal */}
      <WithdrawalRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wallet={wallet}
        sellerId={sellerId}
        sellerCommission={sellerCommission}
      />
    </div>
  );
}