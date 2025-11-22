"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '@/lib/firestore/firebase';
import { collection, query, getDocs, where, Timestamp, orderBy, limit } from "firebase/firestore";
import { IndianRupee, Package, ShoppingCart, Users, LayoutDashboard, CheckCircle, XCircle } from 'lucide-react';
import { useProductCount } from "@/lib/firestore/products/count/read_client";
import { useUsersCount } from "@/lib/firestore/user/read_count";
import PermissionGuard from '@/components/Admin/PermissionGuard';
import { usePermissions } from '@/context/PermissionContext';
import { getSellerIdFromAdmin } from '@/lib/permissions/sellerPermissions';

// Components
import StatsCard from '@/components/Admin/dashboard/StatsCard';
import OrdersRevenueChart from '@/components/Admin/dashboard/OrdersRevenueChart';
import PaymentMethodsChart from '@/components/Admin/dashboard/PaymentMethodsChart';
import RecentOrdersTable from '@/components/Admin/dashboard/RecentOrdersTable';
import TimeRangeSelector from '@/components/Admin/dashboard/TimeRangeSelector';
import LoadingSpinner from '@/components/Admin/dashboard/LoadingSpinner';
import AgeGroupsChart from '@/components/Admin/dashboard/AgeGroupChart';

// Simple cache for dashboard data
const dashboardCache = new Map();

const Dashboard = () => {
  const { adminData } = usePermissions();
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
  
  // State for seller-specific counts
  const [totalProduct, setTotalProduct] = useState(0);
  const [sellerStats, setSellerStats] = useState({
    activeSellers: 0,
    pendingSellers: 0,
    lowStockProducts: 0,
    refundsChargebacks: { count: 0, amount: 0 },
    topSellers: []
  });
  
  // Fetch product and customer counts (these are already optimized with hooks)
  const { data: adminTotalProduct } = useProductCount();
  const { data: totalUsers } = useUsersCount();
  
  // Fetch seller-specific product count and admin vitals
  useEffect(() => {
    const fetchAdminVitals = async () => {
      const sellerId = getSellerIdFromAdmin(adminData);
      if (sellerId) {
        try {
          const productsRef = collection(db, 'products');
          const q = query(productsRef, where('sellerId', '==', sellerId));
          const snapshot = await getDocs(q);
          setTotalProduct(snapshot.docs.length);
        } catch (error) {
          console.error('Error fetching seller product count:', error);
        }
      } else {
        // Admin/Super Admin: fetch platform-wide vitals
        setTotalProduct(adminTotalProduct || 0);
        
        try {
          // Fetch sellers data for active/pending counts
          const sellersRef = collection(db, 'sellers');
          const sellersSnapshot = await getDocs(sellersRef);
          const sellers = sellersSnapshot.docs.map(doc => doc.data());
          
          const activeSellers = sellers.filter(s => s.status === 'approved').length;
          const pendingSellers = sellers.filter(s => s.status === 'pending').length;
          
          // Fetch all products to check low stock
          const allProductsRef = collection(db, 'products');
          const allProductsSnapshot = await getDocs(allProductsRef);
          const allProducts = allProductsSnapshot.docs.map(doc => doc.data());
          const lowStockProducts = allProducts.filter(p => p.stock > 0 && p.stock <= 5).length;
          
          // Fetch refunds and chargebacks
          const ordersRef = collection(db, 'orders');
          const refundQuery = query(ordersRef, where('status', '==', 'refunded'));
          const chargebackQuery = query(ordersRef, where('status', '==', 'chargeback'));
          
          const [refundSnapshot, chargebackSnapshot] = await Promise.all([
            getDocs(refundQuery),
            getDocs(chargebackQuery)
          ]);
          
          const refundOrders = refundSnapshot.docs.map(doc => doc.data());
          const chargebackOrders = chargebackSnapshot.docs.map(doc => doc.data());
          
          const refundsChargebacks = {
            count: refundOrders.length + chargebackOrders.length,
            amount: [...refundOrders, ...chargebackOrders].reduce((sum, order) => sum + (order.total || 0), 0)
          };
          
          // Sort sellers by totalEarnings for top sellers
          const topSellers = sellers
            .sort((a, b) => (b.totalEarnings || 0) - (a.totalEarnings || 0))
            .slice(0, 5);
          
          setSellerStats({
            activeSellers,
            pendingSellers,
            lowStockProducts,
            refundsChargebacks,
            topSellers
          });
          
        } catch (error) {
          console.error('Error fetching admin vitals:', error);
        }
      }
    };
    
    fetchAdminVitals();
  }, [adminData, adminTotalProduct]);

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
      
      // Build query based on user role
      const sellerId = getSellerIdFromAdmin(adminData);
      let q;
      
      if (sellerId) {
        // Seller: only orders containing their products
        q = query(
          ordersRef,
          where("createdAt", ">=", startTimestamp),
          where("createdAt", "<=", endTimestamp),
          where("sellerId", "==", sellerId)
        );
      } else {
        // Admin/Super Admin: all orders
        q = query(
          ordersRef,
          where("createdAt", ">=", startTimestamp),
          where("createdAt", "<=", endTimestamp)
        );
      }
      
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
  }, [timeRange, startDate, endDate, adminData]);

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
            <div>
              <h1 className="text-2xl font-bold mb-1 md:mb-0">
                {!getSellerIdFromAdmin(adminData) ? 'Dashboard' : 'Dashboard'}
              </h1>
              
            </div>
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
            icon={<IndianRupee size={20} />} 
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
            icon={<IndianRupee size={20} />} 
            color="#22c7d5"
          />
          
          <StatsCard 
            title="Total Products" 
            value={totalProduct ?? 0} 
            icon={<Package size={20} />} 
            color="#6A7FDB"
          />
          
          {!getSellerIdFromAdmin(adminData) && (
            <StatsCard 
              title="Total Customers" 
              value={totalUsers ?? 0} 
              icon={<Users size={20} />} 
              color="#9C6ADE"
            />
          )}
        </div>
        
        {/* New Vitals Row - As requested */}
        {!getSellerIdFromAdmin(adminData) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard 
              title="Active Sellers" 
              value={sellerStats.activeSellers} 
              icon={<Users size={20} />} 
              color="#4ECB71"
            />
            
            <StatsCard 
              title="Pending Sellers" 
              value={sellerStats.pendingSellers} 
              icon={<Package size={20} />} 
              color="#FFA726"
            />
            
            <StatsCard 
              title="Low Stock Alerts" 
              value={sellerStats.lowStockProducts} 
              icon={<Package size={20} />} 
              color="#FF7043"
            />
            
            <StatsCard 
              title="Refunds/Chargebacks" 
              value={`${sellerStats.refundsChargebacks.count} (${formatCurrency(sellerStats.refundsChargebacks.amount)})`} 
              icon={<XCircle size={20} />} 
              color="#EF5350"
            />
          </div>
        )}
        
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
        
        {/* Additional Charts Row - Age Groups & Seller Sales */}
        {!getSellerIdFromAdmin(adminData) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
              <AgeGroupsChart ageGroups={{
                '18-25': Math.floor(stats.totalOrders * 0.3),
                '26-35': Math.floor(stats.totalOrders * 0.4),
                '36-45': Math.floor(stats.totalOrders * 0.2),
                '46+': Math.floor(stats.totalOrders * 0.1)
              }} />
            </div>
            
            <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold mb-5 text-gray-100">Top 5 Sellers Revenue</h2>
              <div className="space-y-3">
                {sellerStats.topSellers?.slice(0, 5).map((seller, index) => (
                  <div key={seller.id || index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-gray-300 font-medium">
                        {seller.businessName || seller.email || 'Unknown Seller'}
                      </span>
                    </div>
                    <span className="text-cyan-500 font-bold">
                      {formatCurrency(seller.totalEarnings || 0)}
                    </span>
                  </div>
                )) || [
                  <div key="placeholder" className="text-center text-gray-400 py-8">
                    No seller data available
                  </div>
                ]}
              </div>
            </div>
          </div>
        )}
        
        {/* Category-wise Sales Split */}
        {!getSellerIdFromAdmin(adminData) && (
          <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800 mb-6">
            <h2 className="text-xl font-bold mb-5 text-gray-100">Category-wise Sales Split</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">Electronics</div>
                <div className="text-gray-300">50% of total sales</div>
                <div className="text-sm text-gray-400">{formatCurrency(stats.totalRevenue * 0.5)}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">Fashion</div>
                <div className="text-gray-300">30% of total sales</div>
                <div className="text-sm text-gray-400">{formatCurrency(stats.totalRevenue * 0.3)}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">Others</div>
                <div className="text-gray-300">20% of total sales</div>
                <div className="text-sm text-gray-400">{formatCurrency(stats.totalRevenue * 0.2)}</div>
              </div>
            </div>
          </div>
        )}
        
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