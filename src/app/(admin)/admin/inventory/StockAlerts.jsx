"use client";

import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firestore/firebase';

export default function StockAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchStockAlerts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        
        const alertsData = [];

        snapshot.docs.forEach(doc => {
          const product = { id: doc.id, ...doc.data() };
          const stock = product.stock || 0;
          const threshold = product.lowStockThreshold || 10;

          if (stock === 0) {
            alertsData.push({
              ...product,
              alertType: 'out_of_stock',
              priority: 'high',
              message: 'Product is out of stock'
            });
          } else if (stock <= threshold) {
            alertsData.push({
              ...product,
              alertType: 'low_stock',
              priority: 'medium',
              message: `Only ${stock} units left`
            });
          }
        });

        // Sort by priority and stock level
        alertsData.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          }
          return (a.stock || 0) - (b.stock || 0);
        });

        setAlerts(alertsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock alerts:', error);
        setLoading(false);
      }
    };

    fetchStockAlerts();
  }, []);

  const updateStock = async (productId, newStock) => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, { stock: newStock });
      
      // Update local state
      setAlerts(alerts.map(alert => 
        alert.id === productId ? { ...alert, stock: newStock } : alert
      ));
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.alertType === filter;
  });

  const getAlertColor = (alertType) => {
    switch (alertType) {
      case 'out_of_stock': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Stock Alerts</h2>
        
        <div className="flex gap-2">
          {['all', 'out_of_stock', 'low_stock'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === filterType
                  ? 'bg-[#22c7d5] text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filterType.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                {alert.featureImageURL && (
                  <img
                    src={alert.featureImageURL}
                    alt={alert.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {alert.title}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  SKU: {alert.sku || 'N/A'} | Category: {alert.category || 'N/A'}
                </div>
                <div className="flex gap-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getAlertColor(alert.alertType)}`}>
                    {alert.alertType.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(alert.priority)}`}>
                    {alert.priority}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-semibold text-gray-900 dark:text-white">
                  Stock: {alert.stock || 0}
                </div>
                <div className="text-sm text-gray-500">
                  Threshold: {alert.lowStockThreshold || 10}
                </div>
                <div className="text-sm text-red-600 dark:text-red-400">
                  {alert.message}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newStock = prompt('Enter new stock quantity:', alert.stock || 0);
                    if (newStock !== null && !isNaN(newStock)) {
                      updateStock(alert.id, parseInt(newStock));
                    }
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Update Stock
                </button>
                <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors">
                  Reorder
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {filter === 'all' ? 'No stock alerts found.' : `No ${filter.replace('_', ' ')} alerts found.`}
          </div>
        )}
      </div>
    </div>
  );
}