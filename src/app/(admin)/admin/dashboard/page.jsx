"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '@/lib/firestore/firebase';
import { collection, query, getDocs, where, Timestamp, orderBy, limit } from "firebase/firestore";
import { DollarSign, Package, ShoppingCart, Users, LayoutDashboard, CheckCircle, XCircle } from 'lucide-react';
import { useProductCount } from "@/lib/firestore/products/count/read_client";
import { useUsersCount } from "@/lib/firestore/user/read_count";
import PermissionGuard from '@/components/Admin/PermissionGuard';

// Components
import StatsCard from '@/components/Admin/dashboard/StatsCard';
import OrdersRevenueChart from '@/components/Admin/dashboard/OrdersRevenueChart';
import PaymentMethodsChart from '@/components/Admin/dashboard/PaymentMethodsChart';
import RecentOrdersTable from '@/components/Admin/dashboard/RecentOrdersTable';
import TimeRangeSelector from '@/components/Admin/dashboard/TimeRangeSelector';
import LoadingSpinner from '@/components/Admin/dashboard/LoadingSpinner';

// Simple cache for dashboard data
const dashboardCache = new Map();

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalProductsSold: 0,
    paymentMethods: { cod: 0, prepaid: 0 },
    recentOrders: [],
    dailyOrders: [],
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const [timeRange, setTimeRange] = useState('7d');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  // Fetch product and customer counts (these are already optimized with hooks)
  const { data: totalProduct } = useProductCount();
  const { data: totalUsers } = useUsersCount();

  // Create cache key for current query
  const getCacheKey = useCallback(() => {
    return `${timeRange}-${startDate?.getTime()}-${endDate?.getTime()}`;
  }, [timeRange, startDate, endDate]);

  // Optimized date range calculation
  const getDateRange = useMemo(() => {
    let queryStartDate = new Date();
    let queryEndDate = new Date();
    
    if (timeRange === 'custom' && startDate && endDate) {
      queryStartDate = startDate;
      queryEndDate = endDate;
    } else {
      switch(timeRange) {
        case '7d':
          queryStartDate.setDate(queryEndDate.getDate() - 7);
          break;
        case '30d':
          queryStartDate.setDate(queryEndDate.getDate() - 30);
          break;
        case '90d':
          queryStartDate.setDate(queryEndDate.getDate() - 90);
          break;
        default:
          queryStartDate.setDate(queryEndDate.getDate() - 7);
      }
    }
    
    return {
      start: Timestamp.fromDate(queryStartDate),
      end: Timestamp.fromDate(queryEndDate)
    };
  }, [timeRange, startDate, endDate]);

  const fetchOrdersData = async (startTimestamp, endTimestamp) => {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("createdAt", ">=", startTimestamp),
        where("createdAt", "<=", endTimestamp)
      );
      const querySnapshot = await getDocs(q);
      
      let orders = [];
      let totalRevenue = 0;
      let totalProductCount = 0;
      let codCount = 0;
      let prepaidCount = 0;
      let dailyOrdersMap = {};
      let deliveredCount = 0;
      let cancelledCount = 0;
      let productPurchases = {};
      
      querySnapshot.forEach((doc) => {
        const order = doc.data();
        orders.push(order);
        
        totalRevenue += order.total || 0;
        
        const productCount = order.line_items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
        totalProductCount += productCount;
        
        // Track payment methods
        if (order.paymentMode === 'cod') {
          codCount++;
        } else if (order.paymentMode === 'prepaid') {
          prepaidCount++;
        }
        
        // Track order status
        if (order.status === 'delivered') {
          deliveredCount++;
        } else if (order.status === 'cancelled') {
          cancelledCount++;
        }
        
        // Track products for trending analysis
        order.line_items?.forEach(item => {
          const productId = item.product_id;
          if (!productPurchases[productId]) {
            productPurchases[productId] = {
              id: productId,
              name: item.title || 'Unknown Product',
              qty: 0,
              revenue: 0
            };
          }
          productPurchases[productId].qty += item.quantity || 1;
          productPurchases[productId].revenue += (item.price || 0) * (item.quantity || 1);
        });
        
        // Daily order tracking for charts
        const orderDate = order.createdAt?.toDate();
        if (orderDate) {
          const dateString = orderDate.toISOString().split('T')[0];
          if (!dailyOrdersMap[dateString]) {
            dailyOrdersMap[dateString] = {
              date: dateString,
              orders: 0,
              revenue: 0,
              delivered: 0,
              cancelled: 0
            };
          }
          dailyOrdersMap[dateString].orders += 1;
          dailyOrdersMap[dateString].revenue += order.total || 0;
          
          if (order.status === 'delivered') {
            dailyOrdersMap[dateString].delivered += 1;
          } else if (order.status === 'cancelled') {
            dailyOrdersMap[dateString].cancelled += 1;
          }
        }
      });
      
      const dailyOrders = Object.values(dailyOrdersMap).sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
      
      const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
      
      return {
        totalOrders: orders.length,
        totalRevenue,
        averageOrderValue,
        totalProductsSold: totalProductCount,
        paymentMethods: { cod: codCount, prepaid: prepaidCount },
        recentOrders: orders
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
          .slice(0, 5),
        dailyOrders,
        deliveredOrders: deliveredCount,
        cancelledOrders: cancelledCount,
      };
    } catch (error) {
      console.error("Error fetching orders data:", error);
      throw error;
    }
  };

  const fetchData = async () => {
    const cacheKey = getCacheKey();
    
    // Check cache first
    if (dashboardCache.has(cacheKey)) {
      const cachedData = dashboardCache.get(cacheKey);
      setStats(cachedData);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { start: startTimestamp, end: endTimestamp } = getDateRange;
      
      // Only fetch orders data - removed expensive reviews and users queries
      const ordersData = await fetchOrdersData(startTimestamp, endTimestamp);
      
      // Cache the results for 5 minutes
      dashboardCache.set(cacheKey, ordersData);
      setTimeout(() => {
        dashboardCache.delete(cacheKey);
      }, 5 * 60 * 1000); // 5 minutes cache
      
      setStats(ordersData);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange, startDate, endDate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  if (loading) {
    return (
      <PermissionGuard requiredPermission="dashboard">
        <div className="flex items-center justify-center h-screen bg-[#1e2737]">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-gray-400 mt-4">Loading dashboard data...</p>
          </div>
        </div>
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard requiredPermission="dashboard">
      <div className="p-4 md:p-6 mx-auto bg-[#1e2737] text-gray-100 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center">
            <LayoutDashboard className="text-[#22c7d5] mr-2" size={24} />
            <h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>
          </div>
        
          <TimeRangeSelector 
            timeRange={timeRange} 
            setTimeRange={setTimeRange}
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>
        
        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard 
            title="Total Orders" 
            value={stats.totalOrders} 
            icon={<ShoppingCart size={20} />} 
            color="#FF6B6B"
          />
          
          <StatsCard 
            title="Total Revenue" 
            value={formatCurrency(stats.totalRevenue)} 
            icon={<DollarSign size={20} />} 
            color="#4ECB71"
          />
          
          <StatsCard 
            title="Delivered Orders" 
            value={stats.deliveredOrders} 
            icon={<CheckCircle size={20} />} 
            color="#00C853"
          />
          
          <StatsCard 
            title="Cancelled Orders" 
            value={stats.cancelledOrders} 
            icon={<XCircle size={20} />} 
            color="#FF5252"
          />
        </div>
        
        {/* Second Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard 
            title="Products Sold" 
            value={stats.totalProductsSold} 
            icon={<Package size={20} />} 
            color="#FFD166"
          />
          
          <StatsCard 
            title="Avg. Order Value" 
            value={formatCurrency(stats.averageOrderValue)} 
            icon={<DollarSign size={20} />} 
            color="#22c7d5"
          />
          
          <StatsCard 
            title="Total Products" 
            value={totalProduct ?? 0} 
            icon={<Package size={20} />} 
            color="#6A7FDB"
          />
          
          <StatsCard 
            title="Total Customers" 
            value={totalUsers ?? 0} 
            icon={<Users size={20} />} 
            color="#9C6ADE"
          />
        </div>
        
        {/* Order & Revenue Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          <div className="md:col-span-8">
            <OrdersRevenueChart 
              dailyOrders={stats.dailyOrders} 
              formatCurrency={formatCurrency} 
            />
          </div>
          
          <div className="md:col-span-4">
            <PaymentMethodsChart paymentMethods={stats.paymentMethods} />
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="mb-6">
          <RecentOrdersTable 
            recentOrders={stats.recentOrders} 
            formatCurrency={formatCurrency} 
          />
        </div>
      </div>
    </PermissionGuard>
  );
};

export default Dashboard;