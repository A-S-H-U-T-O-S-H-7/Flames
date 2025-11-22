"use client";

import { useState } from 'react';

export default function ShippingPartners() {
  const [partners, setPartners] = useState([
    {
      id: 1,
      name: 'FedEx',
      status: 'active',
      regions: ['US', 'International'],
      services: ['Express', 'Ground', 'Overnight'],
      rating: 4.5,
      costPerKg: 8.50,
      deliveryTime: '2-3 days',
      logo: '/fedex-logo.png'
    },
    {
      id: 2,
      name: 'UPS',
      status: 'active',
      regions: ['US', 'Canada', 'Europe'],
      services: ['Next Day', '2-Day', 'Ground'],
      rating: 4.3,
      costPerKg: 7.80,
      deliveryTime: '1-4 days',
      logo: '/ups-logo.png'
    },
    {
      id: 3,
      name: 'DHL',
      status: 'active',
      regions: ['International'],
      services: ['Express', 'Standard'],
      rating: 4.2,
      costPerKg: 12.30,
      deliveryTime: '3-5 days',
      logo: '/dhl-logo.png'
    },
    {
      id: 4,
      name: 'USPS',
      status: 'inactive',
      regions: ['US'],
      services: ['Priority', 'First Class'],
      rating: 3.8,
      costPerKg: 5.20,
      deliveryTime: '3-7 days',
      logo: '/usps-logo.png'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  };

  const togglePartnerStatus = (partnerId) => {
    setPartners(partners.map(partner => 
      partner.id === partnerId 
        ? { ...partner, status: partner.status === 'active' ? 'inactive' : 'active' }
        : partner
    ));
  };

  return (
    <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Shipping Partners</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#22c7d5] text-white rounded-lg hover:bg-[#1aa5b5] transition-colors"
        >
          Add Partner
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Partner</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Status</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Regions</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Services</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Rating</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Cost/kg</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Delivery Time</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold">{partner.name.slice(0, 2)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{partner.name}</div>
                      <div className="text-sm text-gray-500">Courier Service</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(partner.status)}`}>
                    {partner.status}
                  </span>
                </td>
                <td className="py-4 px-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {partner.regions.join(', ')}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {partner.services.join(', ')}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
                      {partner.rating}/5
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="font-medium text-gray-900 dark:text-white">
                    ₹{partner.costPerKg}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {partner.deliveryTime}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePartnerStatus(partner.id)}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        partner.status === 'active'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {partner.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                      Configure
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {partners.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No shipping partners found.
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Partners</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{partners.length}</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Partners</div>
          <div className="text-2xl font-bold text-green-600">{partners.filter(p => p.status === 'active').length}</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
          <div className="text-2xl font-bold text-yellow-600">
            {(partners.reduce((sum, p) => sum + p.rating, 0) / partners.length).toFixed(1)}★
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Cost/kg</div>
          <div className="text-2xl font-bold text-blue-600">
            ₹{(partners.reduce((sum, p) => sum + p.costPerKg, 0) / partners.length).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Add Partner Modal would go here */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Add Shipping Partner</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Add partner form coming soon...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}