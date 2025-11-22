"use client";

import { useState, useEffect } from 'react';

export default function ShippingStatsCards() {
  const [stats, setStats] = useState({
    totalShipments: 1247,
    pendingPickups: 32,
    inTransit: 156,
    delivered: 1089,
    averageDeliveryTime: 2.4,
    shippingCost: 12847.50,
    loading: false
  });

  const statsData = [
    {
      title: 'Total Shipments',
      value: stats.totalShipments.toLocaleString(),
      change: '+12.5%',
      positive: true,
      icon: '📦'
    },
    {
      title: 'Pending Pickups',
      value: stats.pendingPickups,
      change: '-8.2%',
      positive: false,
      icon: '⏳'
    },
    {
      title: 'In Transit',
      value: stats.inTransit,
      change: '+15.3%',
      positive: true,
      icon: '🚚'
    },
    {
      title: 'Delivered',
      value: stats.delivered.toLocaleString(),
      change: '+18.7%',
      positive: true,
      icon: '✅'
    },
    {
      title: 'Avg Delivery Time',
      value: `${stats.averageDeliveryTime} days`,
      change: '-0.3 days',
      positive: true,
      icon: '⚡'
    },
    {
      title: 'Shipping Costs',
      value: `$${stats.shippingCost.toLocaleString()}`,
      change: '+5.4%',
      positive: false,
      icon: '💰'
    }
  ];

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {statsData.map((stat, index) => (
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