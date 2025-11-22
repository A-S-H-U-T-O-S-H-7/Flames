"use client";

export default function PaymentStatsCards() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '₹125,430',
      change: '+12.5%',
      positive: true,
      icon: '💰'
    },
    {
      title: 'Pending Payments',
      value: '₹8,520',
      change: '-2.1%',
      positive: false,
      icon: '⏳'
    },
    {
      title: 'Completed Transactions',
      value: '1,247',
      change: '+8.3%',
      positive: true,
      icon: '✅'
    },
    {
      title: 'Platform Fees',
      value: '₹30,120',
      change: '+15.2%',
      positive: true,
      icon: '📊'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">{stat.icon}</span>
            <span className={`text-sm font-medium px-2 py-1 rounded ${
              stat.positive 
                ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20' 
                : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
            }`}>
              {stat.change}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {stat.title}
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}