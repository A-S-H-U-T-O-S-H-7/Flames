"use client"
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firestore/firebase';
import { collection, query, getDocs, where, Timestamp, orderBy } from "firebase/firestore";
import { DollarSign, Package, ShoppingCart, Users, LayoutDashboard, CheckCircle, XCircle } from 'lucide-react';
import { useProductCount } from "@/lib/firestore/products/count/read_client";
import { useUsersCount } from "@/lib/firestore/user/read_count";

// Components
import StatsCard from '@/components/Admin/dashboard/StatsCard';
import OrdersRevenueChart from '@/components/Admin/dashboard/OrdersRevenueChart';
import PaymentMethodsChart from '@/components/Admin/dashboard/PaymentMethodsChart';
import RecentOrdersTable from '@/components/Admin/dashboard/RecentOrdersTable';
import TimeRangeSelector from '@/components/Admin/dashboard/TimeRangeSelector';
import LoadingSpinner from '@/components/Admin/dashboard/LoadingSpinner';
import ReviewsChart from '@/components/Admin/dashboard/ReviewChart';
import AgeGroupsChart from '@/components/Admin/dashboard/AgeGroupChart';
import TrendingProducts from '@/components/Admin/dashboard/TrendingProduct';

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
    reviewRatings: { positive: 0, negative: 0, reviews: [] },
    ageGroups: { '10-20': 0, '20-30': 0, '30-50': 0, '50+': 0 },
    trendingProducts: []
  });
  const [timeRange, setTimeRange] = useState('7d');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  // Fetch product and customer counts
  const { data: totalProduct } = useProductCount();
  const { data: totalUsers } = useUsersCount();

  useEffect(() => {
    fetchData();
  }, [timeRange, startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Calculate date range based on selected timeRange or custom dates
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
      
      const startTimestamp = Timestamp.fromDate(queryStartDate);
      const endTimestamp = Timestamp.fromDate(queryEndDate);
      
      // Query orders collection with date range
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
      
      // Fetch reviews from product collections
      // This is the updated part to correctly fetch reviews
      const productsRef = collection(db, "products");
      const productsSnapshot = await getDocs(productsRef);
      
      let positiveReviews = 0;
      let negativeReviews = 0;
      let reviewsData = [];
      
      // Loop through each product to get its reviews
      for (const productDoc of productsSnapshot.docs) {
        const productId = productDoc.id;
        const reviewsRef = collection(db, `products/${productId}/reviews`);
        const reviewsQuery = query(
          reviewsRef,
          orderBy("timestamp", "desc")
        );
        
        const reviewsSnapshot = await getDocs(reviewsQuery);
        
        reviewsSnapshot.forEach((doc) => {
          const review = doc.data();
          const reviewTimestamp = review.timestamp;
          
          // Skip if the review is outside our date range
          if (!reviewTimestamp || 
              reviewTimestamp < startTimestamp || 
              reviewTimestamp > endTimestamp) {
            return;
          }
          
          const rating = review.rating || 0;
          
          if (rating >= 3) {
            positiveReviews++;
          } else {
            negativeReviews++;
          }
          
          // Track daily reviews for charts
          const reviewDate = reviewTimestamp?.toDate();
          if (reviewDate) {
            const dateString = reviewDate.toISOString().split('T')[0];
            reviewsData.push({
              date: dateString,
              rating: rating,
              isPositive: rating >= 3
            });
          }
        });
      }
      
      // Query users collection to get age demographics
      // This is the updated part to correctly parse the dateOfBirth
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      
      let ageGroups = {
        '10-20': 0,
        '20-30': 0,
        '30-50': 0,
        '50+': 0
      };
      
      usersSnapshot.forEach((doc) => {
        const user = doc.data();
        // Handle dateOfBirth whether it's a timestamp or ISO string
        let birthDate;
        
        if (user.dateOfBirth) {
          if (user.dateOfBirth instanceof Timestamp) {
            birthDate = user.dateOfBirth.toDate();
          } else if (typeof user.dateOfBirth === 'string') {
            birthDate = new Date(user.dateOfBirth);
          } else if (user.dateOfBirth.seconds) {
            // Handle Firestore timestamp object
            birthDate = new Date(user.dateOfBirth.seconds * 1000);
          }
        }
        
        if (birthDate && !isNaN(birthDate.getTime())) { // Ensure valid date
          const age = new Date().getFullYear() - birthDate.getFullYear();
          
          if (age < 20) {
            ageGroups['10-20']++;
          } else if (age < 30) {
            ageGroups['20-30']++;
          } else if (age < 50) {
            ageGroups['30-50']++;
          } else {
            ageGroups['50+']++;
          }
        }
      });
      
      // Sort products by quantity sold to find trending products
      const trendingProducts = Object.values(productPurchases)
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5); // Get top 5 trending products
      
      const dailyOrders = Object.values(dailyOrdersMap).sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
      
      const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
      
      setStats({
        totalOrders: orders.length,
        totalRevenue,
        averageOrderValue,
        totalProductsSold: totalProductCount,
        paymentMethods: { cod: codCount, prepaid: prepaidCount },
        recentOrders: orders.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
        dailyOrders,
        deliveredOrders: deliveredCount,
        cancelledOrders: cancelledCount,
        reviewRatings: { 
          positive: positiveReviews, 
          negative: negativeReviews,
          reviews: reviewsData 
        },
        ageGroups,
        trendingProducts
      });
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

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
    return <LoadingSpinner />;
  }

  return (
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
          title="Products" 
          value={totalProduct ?? 0} 
          icon={<Package size={20} />} 
          color="#6A7FDB"
        />
        
        <StatsCard 
          title="Customers" 
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
      
      {/* Reviews & Age Group Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        <div className="md:col-span-6">
          <ReviewsChart reviewData={stats.reviewRatings} />
        </div>
        
        <div className="md:col-span-6">
          <AgeGroupsChart ageGroups={stats.ageGroups} />
        </div>
      </div>
      
      {/* Trending Products & Recent Orders Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        <div className="md:col-span-4">
          <TrendingProducts 
            products={stats.trendingProducts}
            formatCurrency={formatCurrency}
          />
        </div>
        
        <div className="md:col-span-8">
          <RecentOrdersTable 
            recentOrders={stats.recentOrders} 
            formatCurrency={formatCurrency} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;