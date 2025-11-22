"use client";

import { useState } from 'react';

export default function ShippingRates() {
  const [rates, setRates] = useState([
    {
      id: 1,
      name: 'Standard Shipping',
      type: 'flat_rate',
      conditions: {
        minWeight: 0,
        maxWeight: 5,
        minValue: 0,
        maxValue: 50
      },
      cost: 5.99,
      zone: 'Local',
      partner: 'USPS',
      deliveryTime: '3-5 days',
      status: 'active'
    },
    {
      id: 2,
      name: 'Express Shipping',
      type: 'weight_based',
      conditions: {
        minWeight: 0,
        maxWeight: 10,
        minValue: 25,
        maxValue: 999999
      },
      cost: 12.99,
      zone: 'Regional',
      partner: 'FedEx',
      deliveryTime: '1-2 days',
      status: 'active'
    },
    {
      id: 3,
      name: 'Free Shipping',
      type: 'conditional',
      conditions: {
        minWeight: 0,
        maxWeight: 20,
        minValue: 75,
        maxValue: 999999
      },
      cost: 0.00,
      zone: 'National',
      partner: 'UPS',
      deliveryTime: '4-7 days',
      status: 'active'
    },
    {
      id: 4,
      name: 'International Express',
      type: 'distance_based',
      conditions: {
        minWeight: 0,
        maxWeight: 15,
        minValue: 100,
        maxValue: 999999
      },
      cost: 35.99,
      zone: 'International',
      partner: 'DHL',
      deliveryTime: '5-10 days',
      status: 'inactive'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  };

  const getTypeColor = (type) => {
    const colors = {
      'flat_rate': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'weight_based': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'conditional': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'distance_based': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const toggleRateStatus = (rateId) => {
    setRates(rates.map(rate => 
      rate.id === rateId 
        ? { ...rate, status: rate.status === 'active' ? 'inactive' : 'active' }
        : rate
    ));
  };

  return (
    <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Shipping Rates</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#22c7d5] text-white rounded-lg hover:bg-[#1aa5b5] transition-colors"
        >
          Add Rate
        </button>
      </div>

      <div className="space-y-4">
        {rates.map((rate) => (
          <div key={rate.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{rate.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(rate.type)}`}>
                    {rate.type.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(rate.status)}`}>
                    {rate.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {rate.zone} • {rate.partner} • {rate.deliveryTime}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {rate.cost === 0 ? 'FREE' : `$${rate.cost}`}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleRateStatus(rate.id)}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      rate.status === 'active'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {rate.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Weight Range
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {rate.conditions.minWeight}kg - {rate.conditions.maxWeight}kg
                </p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Order Value
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  ${rate.conditions.minValue} - ${rate.conditions.maxValue === 999999 ? '∞' : rate.conditions.maxValue}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Zone
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{rate.zone}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Partner
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{rate.partner}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rates.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No shipping rates configured.
        </div>
      )}

      {/* Rate Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Rates</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{rates.length}</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Rates</div>
          <div className="text-2xl font-bold text-green-600">{rates.filter(r => r.status === 'active').length}</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Cost</div>
          <div className="text-2xl font-bold text-blue-600">
            ${rates.length > 0 ? (rates.reduce((sum, r) => sum + r.cost, 0) / rates.length).toFixed(2) : '0.00'}
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Free Shipping</div>
          <div className="text-2xl font-bold text-purple-600">{rates.filter(r => r.cost === 0).length}</div>
        </div>
      </div>

      {/* Rate Types Legend */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Rate Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
              Flat Rate
            </span>
            <span className="text-gray-600 dark:text-gray-400">Fixed cost</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
              Weight Based
            </span>
            <span className="text-gray-600 dark:text-gray-400">By weight</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              Conditional
            </span>
            <span className="text-gray-600 dark:text-gray-400">If conditions met</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
              Distance Based
            </span>
            <span className="text-gray-600 dark:text-gray-400">By distance</span>
          </div>
        </div>
      </div>

      {/* Add Rate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Add Shipping Rate</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Add shipping rate form coming soon...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}