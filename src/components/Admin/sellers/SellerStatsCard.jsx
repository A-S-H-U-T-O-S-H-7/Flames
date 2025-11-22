"use client";

import { useState, useEffect } from 'react';
import { getSellerStats } from '@/lib/firestore/sellers/admin';
import { Store, Users, CheckCircle, AlertTriangle, IndianRupee, Percent } from 'lucide-react';

export default function SellerStatsCards() {
  const [stats, setStats] = useState({
    totalSellers: 0,
    activeSellers: 0,
    pendingSellers: 0,
    suspendedSellers: 0,
    totalCommissionEarned: 0,
    averageCommission: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const sellerStats = await getSellerStats();
        setStats(sellerStats);
      } catch (error) {
        console.error('Error fetching seller stats:', error);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-[#0e1726] rounded-xl p-6 border border-gray-700 animate-pulse">
            <div className="h-8 bg-gray-600 rounded mb-2"></div>
            <div className="h-6 bg-gray-600 rounded mb-1"></div>
            <div className="h-4 bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      <StatsCard
        title="Total Sellers"
        value={stats.totalSellers}
        icon={<Store className="w-6 h-6" />}
        color="from-blue-500 to-blue-600"
        description="Registered sellers"
      />
      
      <StatsCard
        title="Active Sellers"
        value={stats.activeSellers}
        icon={<CheckCircle className="w-6 h-6" />}
        color="from-green-500 to-green-600"
        description="Approved & selling"
      />
      
      <StatsCard
        title="Pending Approval"
        value={stats.pendingSellers}
        icon={<AlertTriangle className="w-6 h-6" />}
        color="from-yellow-500 to-yellow-600"
        description="Awaiting verification"
      />
      
      <StatsCard
        title="Commission Earned"
        value={formatCurrency(stats.totalCommissionEarned)}
        icon={<IndianRupee className="w-6 h-6" />}
        color="from-purple-500 to-purple-600"
        description="Platform earnings"
      />
      
      <StatsCard
        title="Avg Commission"
        value={`${stats.averageCommission.toFixed(1)}%`}
        icon={<Percent className="w-6 h-6" />}
        color="from-indigo-500 to-indigo-600"
        description="Average rate"
      />
      
      <StatsCard
        title="Suspended"
        value={stats.suspendedSellers}
        icon={<Users className="w-6 h-6" />}
        color="from-red-500 to-red-600"
        description="Inactive sellers"
      />
    </div>
  );
}

function StatsCard({ title, value, icon, color, description }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white`}>
      <div className="flex items-center justify-between mb-4">
        <div className="opacity-80">{icon}</div>
      </div>
      <div>
        <h3 className="text-sm font-medium opacity-90 mb-1">{title}</h3>
        <p className="text-2xl font-bold mb-1">{value}</p>
        <p className="text-xs opacity-75">{description}</p>
      </div>
    </div>
  );
}