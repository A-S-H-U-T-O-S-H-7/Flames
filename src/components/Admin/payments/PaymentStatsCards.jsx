'use client';
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

export default function PaymentStatsCards({ stats }) {
  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue?.toLocaleString() || '0'}`,
      change: stats?.revenueChange || 0,
      icon: IndianRupee,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20 border-green-600/20',
    },
    {
      title: 'Pending Payments',
      value: `₹${stats?.pendingPayments?.toLocaleString() || '0'}`,
      change: stats?.pendingChange || 0,
      icon: Clock,
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20 border-orange-600/20',
    },
    {
      title: 'Completed Transactions',
      value: stats?.completedTransactions?.toLocaleString() || '0',
      change: stats?.transactionChange || 0,
      icon: CheckCircle,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20 border-blue-600/20',
    },
    {
      title: 'Failed Transactions',
      value: stats?.failedTransactions?.toLocaleString() || '0',
      change: stats?.failedChange || 0,
      icon: AlertCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-900/20 border-red-600/20',
    },
    {
      title: 'Total Payouts',
      value: `₹${stats?.totalPayouts?.toLocaleString() || '0'}`,
      change: stats?.payoutChange || 0,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20 border-purple-600/20',
    },
    {
      title: 'Platform Fees',
      value: `₹${stats?.platformFees?.toLocaleString() || '0'}`,
      change: stats?.feesChange || 0,
      icon: IndianRupee,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-900/20 border-indigo-600/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.change > 0;
        const isNegative = card.change < 0;

        return (
          <div key={index} className={`border rounded-lg p-6 ${card.bgColor}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-300 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-white mb-2">
                  {card.value}
                </p>
                {card.change !== 0 && (
                  <div className="flex items-center">
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    ) : isNegative ? (
                      <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                    ) : null}
                    <span
                      className={`text-sm ${
                        isPositive
                          ? 'text-green-400'
                          : isNegative
                          ? 'text-red-400'
                          : 'text-gray-400'
                      }`}
                    >
                      {isPositive ? '+' : ''}{card.change.toFixed(1)}%
                    </span>
                    <span className="text-sm text-gray-400 ml-1">
                      vs last month
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}