"use client";

import { useState } from 'react';
import { collection, query, getDocs, updateDoc, doc, where } from 'firebase/firestore';
import { db } from '@/lib/firestore/firebase';

export default function BulkUpdateModal({ onClose, onUpdate }) {
  const [updateType, setUpdateType] = useState('price');
  const [filterBy, setFilterBy] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [updateValue, setUpdateValue] = useState('');
  const [updateMode, setUpdateMode] = useState('set'); // 'set', 'increase', 'decrease'
  const [loading, setLoading] = useState(false);
  const [previewCount, setPreviewCount] = useState(0);

  const getPreviewCount = async () => {
    try {
      const productsRef = collection(db, 'products');
      let q = query(productsRef);

      if (filterBy !== 'all' && filterValue) {
        switch (filterBy) {
          case 'category':
            q = query(productsRef, where('category', '==', filterValue));
            break;
          case 'stock_below':
            // Note: Firestore doesn't support numeric range queries with strings,
            // so we'll need to filter in memory for now
            break;
          case 'price_below':
            // Same as above
            break;
        }
      }

      const snapshot = await getDocs(q);
      let count = 0;

      snapshot.docs.forEach(doc => {
        const product = doc.data();
        let include = true;

        if (filterBy === 'stock_below' && filterValue) {
          include = (product.stock || 0) <= parseInt(filterValue);
        } else if (filterBy === 'price_below' && filterValue) {
          include = (product.salePrice || product.price || 0) <= parseFloat(filterValue);
        }

        if (include) count++;
      });

      setPreviewCount(count);
    } catch (error) {
      console.error('Error getting preview count:', error);
    }
  };

  const handleBulkUpdate = async () => {
    if (!updateValue) {
      alert('Please enter an update value');
      return;
    }

    setLoading(true);
    try {
      const productsRef = collection(db, 'products');
      let q = query(productsRef);

      if (filterBy !== 'all' && filterValue) {
        switch (filterBy) {
          case 'category':
            q = query(productsRef, where('category', '==', filterValue));
            break;
        }
      }

      const snapshot = await getDocs(q);
      const updatePromises = [];

      snapshot.docs.forEach(docSnapshot => {
        const product = docSnapshot.data();
        let shouldUpdate = true;

        // Apply filters for numeric comparisons
        if (filterBy === 'stock_below' && filterValue) {
          shouldUpdate = (product.stock || 0) <= parseInt(filterValue);
        } else if (filterBy === 'price_below' && filterValue) {
          shouldUpdate = (product.salePrice || product.price || 0) <= parseFloat(filterValue);
        }

        if (shouldUpdate) {
          const productRef = doc(db, 'products', docSnapshot.id);
          let updateData = {};

          switch (updateType) {
            case 'price':
              const currentPrice = product.salePrice || product.price || 0;
              let newPrice;

              if (updateMode === 'set') {
                newPrice = parseFloat(updateValue);
              } else if (updateMode === 'increase') {
                newPrice = currentPrice + parseFloat(updateValue);
              } else if (updateMode === 'decrease') {
                newPrice = Math.max(0, currentPrice - parseFloat(updateValue));
              }

              updateData.salePrice = newPrice;
              break;

            case 'stock':
              const currentStock = product.stock || 0;
              let newStock;

              if (updateMode === 'set') {
                newStock = parseInt(updateValue);
              } else if (updateMode === 'increase') {
                newStock = currentStock + parseInt(updateValue);
              } else if (updateMode === 'decrease') {
                newStock = Math.max(0, currentStock - parseInt(updateValue));
              }

              updateData.stock = newStock;
              break;

            case 'discount':
              const discountPercent = parseFloat(updateValue);
              const originalPrice = product.price || 0;
              const salePrice = originalPrice * (1 - discountPercent / 100);
              updateData.salePrice = Math.max(0, salePrice);
              updateData.discountPercent = discountPercent;
              break;

            case 'category':
              updateData.category = updateValue;
              break;

            case 'status':
              updateData.status = updateValue;
              break;

            case 'visibility':
              updateData.isPublished = updateValue === 'visible';
              break;
          }

          updatePromises.push(updateDoc(productRef, updateData));
        }
      });

      await Promise.all(updatePromises);
      
      alert(`Successfully updated ${updatePromises.length} products!`);
      onUpdate?.();
      onClose?.();
    } catch (error) {
      console.error('Error performing bulk update:', error);
      alert('Error performing bulk update. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Bulk Update Products</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Filter Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Filter Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter By
                </label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Products</option>
                  <option value="category">Category</option>
                  <option value="stock_below">Stock Below</option>
                  <option value="price_below">Price Below</option>
                </select>
              </div>
              
              {filterBy !== 'all' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filter Value
                  </label>
                  <input
                    type={filterBy.includes('below') ? 'number' : 'text'}
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    placeholder={
                      filterBy === 'category' ? 'Electronics' :
                      filterBy === 'stock_below' ? '10' :
                      filterBy === 'price_below' ? '50.00' : ''
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              )}
            </div>
            
            <button
              onClick={getPreviewCount}
              className="mt-3 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Preview ({previewCount} products will be updated)
            </button>
          </div>

          {/* Update Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Update Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Update Type
                </label>
                <select
                  value={updateType}
                  onChange={(e) => setUpdateType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="price">Price</option>
                  <option value="stock">Stock</option>
                  <option value="discount">Apply Discount %</option>
                  <option value="category">Category</option>
                  <option value="status">Status</option>
                  <option value="visibility">Visibility</option>
                </select>
              </div>

              {(updateType === 'price' || updateType === 'stock') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Update Mode
                  </label>
                  <select
                    value={updateMode}
                    onChange={(e) => setUpdateMode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="set">Set To</option>
                    <option value="increase">Increase By</option>
                    <option value="decrease">Decrease By</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {updateType === 'price' ? 'Price' :
                   updateType === 'stock' ? 'Stock' :
                   updateType === 'discount' ? 'Discount %' :
                   updateType === 'category' ? 'Category' :
                   updateType === 'status' ? 'Status' :
                   updateType === 'visibility' ? 'Visibility' : 'Value'}
                </label>
                {updateType === 'status' ? (
                  <select
                    value={updateValue}
                    onChange={(e) => setUpdateValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                ) : updateType === 'visibility' ? (
                  <select
                    value={updateValue}
                    onChange={(e) => setUpdateValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Visibility</option>
                    <option value="visible">Visible</option>
                    <option value="hidden">Hidden</option>
                  </select>
                ) : (
                  <input
                    type={updateType === 'price' || updateType === 'stock' || updateType === 'discount' ? 'number' : 'text'}
                    value={updateValue}
                    onChange={(e) => setUpdateValue(e.target.value)}
                    step={updateType === 'price' ? '0.01' : '1'}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              <strong>Warning:</strong> This action cannot be undone. Make sure you have a backup of your data before proceeding.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleBulkUpdate}
            disabled={loading || !updateValue}
            className="flex-1 px-4 py-2 bg-[#22c7d5] text-white rounded-lg hover:bg-[#1aa5b5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Updating...' : 'Apply Bulk Update'}
          </button>
        </div>
      </div>
    </div>
  );
}