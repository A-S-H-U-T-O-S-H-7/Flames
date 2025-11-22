"use client";

import { useState } from 'react';

export default function DeliveryZones() {
  const [zones, setZones] = useState([
    {
      id: 1,
      name: 'Zone 1 - Local',
      countries: ['United States'],
      states: ['California', 'Nevada', 'Arizona'],
      cities: ['Los Angeles', 'San Francisco', 'Las Vegas'],
      deliveryTime: '1-2 days',
      baseCost: 5.99,
      additionalCost: 2.50,
      status: 'active'
    },
    {
      id: 2,
      name: 'Zone 2 - Regional',
      countries: ['United States'],
      states: ['Texas', 'New York', 'Florida'],
      cities: ['Houston', 'New York City', 'Miami'],
      deliveryTime: '2-4 days',
      baseCost: 8.99,
      additionalCost: 3.50,
      status: 'active'
    },
    {
      id: 3,
      name: 'Zone 3 - National',
      countries: ['United States', 'Canada'],
      states: ['All US States', 'All Canadian Provinces'],
      cities: [],
      deliveryTime: '3-7 days',
      baseCost: 12.99,
      additionalCost: 4.00,
      status: 'active'
    },
    {
      id: 4,
      name: 'Zone 4 - International',
      countries: ['United Kingdom', 'Germany', 'France', 'Australia'],
      states: [],
      cities: [],
      deliveryTime: '7-14 days',
      baseCost: 25.99,
      additionalCost: 8.00,
      status: 'inactive'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  };

  const toggleZoneStatus = (zoneId) => {
    setZones(zones.map(zone => 
      zone.id === zoneId 
        ? { ...zone, status: zone.status === 'active' ? 'inactive' : 'active' }
        : zone
    ));
  };

  return (
    <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Delivery Zones</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#22c7d5] text-white rounded-lg hover:bg-[#1aa5b5] transition-colors"
        >
          Add Zone
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {zones.map((zone) => (
          <div key={zone.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{zone.name}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-2 ${getStatusColor(zone.status)}`}>
                  {zone.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleZoneStatus(zone.id)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    zone.status === 'active'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {zone.status === 'active' ? 'Disable' : 'Enable'}
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                  Edit
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Countries</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {zone.countries.length > 0 ? zone.countries.join(', ') : 'Not specified'}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">States/Provinces</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {zone.states.length > 0 ? zone.states.slice(0, 2).join(', ') + (zone.states.length > 2 ? ` +${zone.states.length - 2} more` : '') : 'All states'}
                </p>
              </div>

              {zone.cities.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cities</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {zone.cities.slice(0, 2).join(', ')}{zone.cities.length > 2 ? ` +${zone.cities.length - 2} more` : ''}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Time</h4>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{zone.deliveryTime}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Cost</h4>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">${zone.baseCost}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Cost per kg</h4>
                <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">${zone.additionalCost}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {zones.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No delivery zones configured.
        </div>
      )}

      {/* Zone Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Zones</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{zones.length}</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Zones</div>
          <div className="text-2xl font-bold text-green-600">{zones.filter(z => z.status === 'active').length}</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Base Cost</div>
          <div className="text-2xl font-bold text-blue-600">
            ${zones.length > 0 ? (zones.reduce((sum, z) => sum + z.baseCost, 0) / zones.length).toFixed(2) : '0.00'}
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Countries Covered</div>
          <div className="text-2xl font-bold text-purple-600">
            {[...new Set(zones.flatMap(z => z.countries))].length}
          </div>
        </div>
      </div>

      {/* Add Zone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Add Delivery Zone</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Add zone form coming soon...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}