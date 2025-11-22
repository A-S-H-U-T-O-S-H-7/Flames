"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PermissionGuard from '@/components/Admin/PermissionGuard';
import { getSellerAnalytics } from '@/lib/firestore/sellers/admin';
import {
  Store,
  ShoppingCart,
  Banknote,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Ban
} from 'lucide-react';

export default function SellerDetailsPage() {
  const { sellerId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        console.log("Fetching analytics for sellerId:", sellerId);
        const data = await getSellerAnalytics(sellerId);
        console.log("Analytics data received:", data);
        console.log("Seller data:", data.seller);
        setAnalytics(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(err.message);
      }
      setLoading(false);
    };

    if (sellerId) {
      fetchAnalytics();
    }
  }, [sellerId]);

  if (loading) {
    return (
      <PermissionGuard requiredPermission="sellers">
        <div className="p-4 md:p-6 bg-[#1e2737] min-h-screen">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-600 rounded mb-6 w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-600 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </PermissionGuard>
    );
  }

  if (error) {
    return (
      <PermissionGuard requiredPermission="sellers">
        <div className="p-4 md:p-6 bg-[#1e2737] min-h-screen">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-red-400 mb-2">Error Loading Seller</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </PermissionGuard>
    );
  }

  if (!analytics || !analytics.seller) {
    return (
      <PermissionGuard requiredPermission="sellers">
        <div className="p-4 md:p-6 bg-[#1e2737] min-h-screen">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-white mb-2">Seller Not Found</h3>
            <p className="text-gray-400">The requested seller could not be found.</p>
          </div>
        </div>
      </PermissionGuard>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'suspended':
        return <Ban className="w-5 h-5 text-gray-400" />;
      default:
        return <Store className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-900/30 text-green-400';
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-400';
      case 'rejected':
        return 'bg-red-900/30 text-red-400';
      case 'suspended':
        return 'bg-gray-900/30 text-gray-400';
      default:
        return 'bg-blue-900/30 text-blue-400';
    }
  };

  return (
    <PermissionGuard requiredPermission="sellers">
      <div className="p-4 md:p-6 bg-[#1e2737] min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#22c7d5] to-purple-500 rounded-full flex items-center justify-center">
                <Store className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {analytics.seller.businessInfo?.businessName || analytics.seller.businessName || 'Unknown Business'}
                </h1>
                <p className="text-gray-400">Seller ID: {sellerId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(analytics.seller.status)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(analytics.seller.status)}`}>
                {analytics.seller.status || 'pending'}
              </span>
            </div>
          </div>
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Email:</span>
              <p className="text-white">{analytics.seller.personalInfo?.email || analytics.seller.email || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-400">Phone:</span>
              <p className="text-white">{analytics.seller.personalInfo?.phone || analytics.seller.phone || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-400">Business Type:</span>
              <p className="text-white">{analytics.seller.businessInfo?.businessType || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-400">Commission:</span>
              <p className="text-white">{analytics.seller.commission ?? analytics.seller.bankDetails?.platformFee ?? 10}%</p>
            </div>
            <div>
              <span className="text-gray-400">Joined:</span>
              <p className="text-white">
                {analytics.seller.timestampCreate?.toDate?.()?.toLocaleDateString() || 
                 analytics.seller.createdAt?.toDate?.()?.toLocaleDateString() || 
                 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="opacity-80"><ShoppingCart className="w-6 h-6" /></div>
            </div>
            <div>
              <h3 className="text-sm font-medium opacity-90 mb-1">Total Orders</h3>
              <p className="text-2xl font-bold">{analytics.totalOrders}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="opacity-80"><Banknote className="w-6 h-6" /></div>
            </div>
            <div>
              <h3 className="text-sm font-medium opacity-90 mb-1">Total Revenue</h3>
              <p className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="opacity-80"><TrendingUp className="w-6 h-6" /></div>
            </div>
            <div>
              <h3 className="text-sm font-medium opacity-90 mb-1">Commission Earned</h3>
              <p className="text-2xl font-bold">{formatCurrency(analytics.commissionEarned)}</p>
            </div>
          </div>
        </div>

        {/* Charts and Details Row */}
        <div className="mb-8">
          {/* Order Status Breakdown */}
          <div className="bg-[#0e1726] rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Order Status</h3>
            <div className="space-y-3">
              {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 capitalize">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'delivered' ? 'bg-green-500' :
                      status === 'shipped' ? 'bg-blue-500' :
                      status === 'processing' ? 'bg-yellow-500' :
                      status === 'pending' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}></div>
                    <span className="text-gray-300">{status}</span>
                  </div>
                  <span className="text-white font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-[#0e1726] rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1e2737] rounded-lg">
                  <th className="font-semibold px-4 py-3 text-left text-gray-300">Order ID</th>
                  <th className="font-semibold px-4 py-3 text-center text-gray-300">Amount</th>
                  <th className="font-semibold px-4 py-3 text-center text-gray-300">Status</th>
                  <th className="font-semibold px-4 py-3 text-center text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {analytics.orders?.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-[#1e2737] transition-colors">
                    <td className="px-4 py-3 text-white font-mono text-sm">
                      #{order.id?.slice(-8)}
                    </td>
                    <td className="px-4 py-3 text-center text-white font-medium">
                      {formatCurrency(order.total || 0)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-300 text-sm">
                      {order.timestampCreate?.toDate().toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {analytics.orders?.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No orders yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
