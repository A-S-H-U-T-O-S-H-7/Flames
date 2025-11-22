"use client";

import { Wallet, TrendingUp, ArrowDownCircle, IndianRupee } from 'lucide-react';

export default function WalletCards({ wallet, onRequestPayout }) {
  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '₹0.00';
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const cards = [
    {
      title: 'Available Balance',
      value: wallet?.availableBalance || 0,
      icon: Wallet,
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-700',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      description: 'Ready to withdraw'
    },
    {
      title: 'Total Earnings',
      value: wallet?.totalEarnings || 0,
      icon: TrendingUp,
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700',
      iconColor: 'text-blue-600 dark:text-blue-400',
      description: 'From delivered orders'
    },
    {
      title: 'Total Withdrawn',
      value: wallet?.totalWithdrawn || 0,
      icon: ArrowDownCircle,
      bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
      borderColor: 'border-purple-200 dark:border-purple-700',
      iconColor: 'text-purple-600 dark:text-purple-400',
      description: 'Net amount received',
      noBorder: true // Remove top border for this card
    },
    {
      title: 'Lifetime Revenue',
      value: wallet?.lifetimeRevenue || 0,
      icon: IndianRupee, // Changed from DollarSign to IndianRupee
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
      borderColor: 'border-amber-200 dark:border-amber-700',
      iconColor: 'text-amber-600 dark:text-amber-400',
      description: 'All-time earnings'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Compact Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`relative rounded-2xl p-4 border ${card.bgColor} ${card.borderColor} shadow-sm hover:shadow-md transition-all duration-300 group backdrop-blur-sm`}
            >
              {/* Premium accent line - hidden for Total Withdrawn card */}
              {!card.noBorder && (
                <div className={`absolute top-0 left-0 w-full h-1 ${card.borderColor.replace('border-', 'bg-')} rounded-t-2xl`} />
              )}
              
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 truncate">
                    {card.title}
                  </p>
                  <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1 break-all">
                    {formatCurrency(card.value)}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {card.description}
                  </p>
                </div>
                <div className={`ml-3 p-2 rounded-lg ${card.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-4 h-4 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Request Payout Button */}
      {wallet && wallet.availableBalance > 0 && (
        <div className="flex justify-center md:justify-end pt-2">
          <button
            onClick={onRequestPayout}
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 text-sm"
          >
            <ArrowDownCircle className="w-4 h-4" />
            Request Payout
          </button>
        </div>
      )}

      {/* No Balance Message */}
      {wallet && wallet.availableBalance === 0 && (
        <div className="text-center py-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <Wallet className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">No balance available</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            Complete and deliver orders to earn money
          </p>
        </div>
      )}
    </div>
  );
}