"use client";

import { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firestore/firebase';

export default function InventoryStatsCards() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
    loading: true
  });

  useEffect(() => {
    const fetchInventoryStats = async () => {
      try {
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        
        let totalProducts = 0;
        let lowStock = 0;
        let outOfStock = 0;
        let totalValue = 0;

        snapshot.docs.forEach(doc => {
          const product = doc.data();
          totalProducts++;
          
          const stock = product.stock || 0;
          const price = product.salePrice || product.price || 0;
          
          if (stock === 0) {
            outOfStock++;
          } else if (stock <= (product.lowStockThreshold || 10)) {
            lowStock++;
          }
          
          totalValue += stock * price;
        });

        setStats({
          totalProducts,
          lowStock,
          outOfStock,
          totalValue,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching inventory stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchInventoryStats();
  }, []);

  const statsData = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      change: '+5.2%',
      positive: true,
      icon: '📦'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStock,
      change: '-2.1%',
      positive: false,
      icon: '⚠️'
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStock,
      change: '+1.3%',
      positive: false,
      icon: '🚫'
    },
    {
      title: 'Inventory Value',
      value: `$${stats.totalValue.toLocaleString()}`,
      change: '+8.7%',
      positive: true,
      icon: '💰'
    }
  ];

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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