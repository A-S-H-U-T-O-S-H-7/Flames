"use client";

import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, updateDoc, doc, where } from 'firebase/firestore';
import { db } from '@/lib/firestore/firebase';
import { usePermissions } from '@/context/PermissionContext';
import { getSellerIdFromAdmin } from '@/lib/permissions/sellerPermissions';

export default function InventoryList() {
  const { adminData } = usePermissions();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        
        // Build query based on user role
        let q;
        const sellerId = getSellerIdFromAdmin(adminData);
        
        if (sellerId) {
          // Seller: only show their own products
          q = query(
            productsRef, 
            where('sellerId', '==', sellerId),
            orderBy('createdAt', 'desc')
          );
        } else {
          // Admin/Super Admin: show all products
          q = query(productsRef, orderBy('createdAt', 'desc'));
        }
        
        const snapshot = await getDocs(q);
        
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [adminData]);

  const updateStock = async (productId, newStock) => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, { stock: newStock });
      
      // Update local state
      setProducts(products.map(product => 
        product.id === productId ? { ...product, stock: newStock } : product
      ));
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const updatePrice = async (productId, newPrice) => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, { salePrice: newPrice });
      
      // Update local state
      setProducts(products.map(product => 
        product.id === productId ? { ...product, salePrice: newPrice } : product
      ));
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product => 
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle numerical values
      if (sortBy === 'stock' || sortBy === 'salePrice' || sortBy === 'price') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      }

      // Handle string values
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStockStatus = (stock, threshold = 10) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' };
    if (stock <= threshold) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' };
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
        <div className="animate-pulse space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Product Inventory</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="title">Sort by Name</option>
            <option value="stock">Sort by Stock</option>
            <option value="salePrice">Sort by Price</option>
            <option value="category">Sort by Category</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Product</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">SKU</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Category</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Stock</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Price</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Status</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock, product.lowStockThreshold);
              return (
                <tr key={product.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                        {product.featureImageURL && (
                          <img
                            src={product.featureImageURL}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white line-clamp-1">
                          {product.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {product.shortDescription}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {product.sku || 'N/A'}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {product.category || 'N/A'}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {product.stock || 0}
                      </span>
                      <button
                        onClick={() => {
                          const newStock = prompt('Enter new stock quantity:', product.stock || 0);
                          if (newStock !== null && !isNaN(newStock)) {
                            updateStock(product.id, parseInt(newStock));
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                        title="Update stock"
                      >
                        ✏️
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${(product.salePrice || product.price || 0).toFixed(2)}
                      </span>
                      <button
                        onClick={() => {
                          const newPrice = prompt('Enter new price:', product.salePrice || product.price || 0);
                          if (newPrice !== null && !isNaN(newPrice)) {
                            updatePrice(product.id, parseFloat(newPrice));
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                        title="Update price"
                      >
                        ✏️
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                      {stockStatus.label}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                        View
                      </button>
                      <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                        Reorder
                      </button>
                      <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors">
                        History
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No products found matching your search.' : 'No products found.'}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <div>
          Showing {filteredAndSortedProducts.length} of {products.length} products
        </div>
        <div>
          Total inventory value: ${filteredAndSortedProducts.reduce((total, product) => 
            total + ((product.stock || 0) * (product.salePrice || product.price || 0)), 0
          ).toFixed(2)}
        </div>
      </div>
    </div>
  );
}