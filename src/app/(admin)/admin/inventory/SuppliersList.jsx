"use client";

import { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firestore/firebase';

export default function SuppliersList() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const suppliersRef = collection(db, 'suppliers');
      const snapshot = await getDocs(suppliersRef);
      
      const suppliersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setSuppliers(suppliersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setLoading(false);
    }
  };

  const addSupplier = async (supplierData) => {
    try {
      const suppliersRef = collection(db, 'suppliers');
      const docRef = await addDoc(suppliersRef, {
        ...supplierData,
        createdAt: new Date(),
        status: 'active'
      });
      
      setSuppliers([...suppliers, { id: docRef.id, ...supplierData }]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  const updateSupplier = async (supplierId, updateData) => {
    try {
      const supplierRef = doc(db, 'suppliers', supplierId);
      await updateDoc(supplierRef, updateData);
      
      setSuppliers(suppliers.map(supplier => 
        supplier.id === supplierId ? { ...supplier, ...updateData } : supplier
      ));
      setEditingSupplier(null);
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  const deleteSupplier = async (supplierId) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await deleteDoc(doc(db, 'suppliers', supplierId));
        setSuppliers(suppliers.filter(supplier => supplier.id !== supplierId));
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'suspended': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
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
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Suppliers</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#22c7d5] text-white rounded-lg hover:bg-[#1aa5b5] transition-colors"
        >
          Add Supplier
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Company</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Contact</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Products</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Rating</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Status</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-4 px-2">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{supplier.companyName}</div>
                    <div className="text-sm text-gray-500">{supplier.address}</div>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{supplier.contactName}</div>
                    <div className="text-sm text-gray-500">{supplier.email}</div>
                    <div className="text-sm text-gray-500">{supplier.phone}</div>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {supplier.productCategories?.join(', ') || 'N/A'}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
                      {supplier.rating || 'N/A'}/5
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(supplier.status)}`}>
                    {supplier.status}
                  </span>
                </td>
                <td className="py-4 px-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingSupplier(supplier)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSupplier(supplier.id)}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {suppliers.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No suppliers found.
          </div>
        )}
      </div>

      {/* Add/Edit Supplier Modal */}
      {(showAddModal || editingSupplier) && (
        <SupplierModal
          supplier={editingSupplier}
          onClose={() => {
            setShowAddModal(false);
            setEditingSupplier(null);
          }}
          onSave={(data) => {
            if (editingSupplier) {
              updateSupplier(editingSupplier.id, data);
            } else {
              addSupplier(data);
            }
          }}
        />
      )}
    </div>
  );
}

function SupplierModal({ supplier, onClose, onSave }) {
  const [formData, setFormData] = useState({
    companyName: supplier?.companyName || '',
    contactName: supplier?.contactName || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
    productCategories: supplier?.productCategories?.join(', ') || '',
    paymentTerms: supplier?.paymentTerms || '',
    notes: supplier?.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      productCategories: formData.productCategories.split(',').map(cat => cat.trim()).filter(Boolean)
    };
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 w-full max-w-lg mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {supplier ? 'Edit Supplier' : 'Add Supplier'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Name
            </label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Categories (comma separated)
            </label>
            <input
              type="text"
              value={formData.productCategories}
              onChange={(e) => setFormData({ ...formData, productCategories: e.target.value })}
              placeholder="Electronics, Clothing, Home & Garden"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#22c7d5] text-white rounded-lg hover:bg-[#1aa5b5] transition-colors"
            >
              {supplier ? 'Update' : 'Add'} Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}