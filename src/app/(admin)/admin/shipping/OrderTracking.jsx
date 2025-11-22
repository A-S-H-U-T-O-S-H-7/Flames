"use client";

import { useState } from 'react';

export default function OrderTracking() {
  const [orders, setOrders] = useState([
    {
      id: 'ORD12345',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      items: 3,
      totalAmount: 89.97,
      shippingAddress: '123 Main St, Los Angeles, CA 90210',
      trackingNumber: '1Z999AA1234567890',
      carrier: 'UPS',
      status: 'in_transit',
      estimatedDelivery: '2024-01-20',
      shippedDate: '2024-01-18',
      trackingEvents: [
        { date: '2024-01-18 09:00', status: 'Order Shipped', location: 'Los Angeles, CA', description: 'Package departed facility' },
        { date: '2024-01-18 15:30', status: 'In Transit', location: 'Phoenix, AZ', description: 'Package in transit' },
        { date: '2024-01-19 08:15', status: 'In Transit', location: 'Denver, CO', description: 'Package in transit' }
      ]
    },
    {
      id: 'ORD12346',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      items: 1,
      totalAmount: 149.99,
      shippingAddress: '456 Oak Ave, New York, NY 10001',
      trackingNumber: '9405511899563123456789',
      carrier: 'USPS',
      status: 'delivered',
      estimatedDelivery: '2024-01-19',
      deliveredDate: '2024-01-19',
      shippedDate: '2024-01-17',
      trackingEvents: [
        { date: '2024-01-17 10:00', status: 'Order Shipped', location: 'Newark, NJ', description: 'Package shipped from fulfillment center' },
        { date: '2024-01-18 14:20', status: 'Out for Delivery', location: 'New York, NY', description: 'Package out for delivery' },
        { date: '2024-01-19 11:45', status: 'Delivered', location: 'New York, NY', description: 'Package delivered to customer' }
      ]
    },
    {
      id: 'ORD12347',
      customerName: 'Mike Johnson',
      customerEmail: 'mike@example.com',
      items: 2,
      totalAmount: 234.50,
      shippingAddress: '789 Pine Rd, Miami, FL 33101',
      trackingNumber: '1Z999BB9876543210',
      carrier: 'FedEx',
      status: 'pending_pickup',
      estimatedDelivery: '2024-01-22',
      shippedDate: null,
      trackingEvents: [
        { date: '2024-01-19 16:00', status: 'Label Created', location: 'Miami, FL', description: 'Shipping label created' }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status) => {
    const colors = {
      'pending_pickup': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'picked_up': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'in_transit': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'out_for_delivery': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'delivered': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'exception': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const getCarrierColor = (carrier) => {
    const colors = {
      'UPS': 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
      'FedEx': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
      'USPS': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'DHL': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return colors[carrier] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Order Tracking</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search orders, customers, or tracking numbers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22c7d5] focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending_pickup">Pending Pickup</option>
            <option value="picked_up">Picked Up</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="exception">Exception</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            {/* Order Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Order #{order.id}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCarrierColor(order.carrier)}`}>
                    {order.carrier}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.customerName} • {order.items} items • ${order.totalAmount}
                </p>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                  {order.trackingNumber}
                </div>
                <div className="text-xs text-gray-500">
                  {order.status === 'delivered' && order.deliveredDate 
                    ? `Delivered: ${order.deliveredDate}`
                    : `Est. Delivery: ${order.estimatedDelivery}`}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shipping Address</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{order.shippingAddress}</p>
            </div>

            {/* Tracking Timeline */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tracking Events</h4>
              <div className="space-y-3">
                {order.trackingEvents.map((event, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      index === 0 
                        ? 'bg-[#22c7d5]' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {event.status}
                          </p>
                          <p className="text-xs text-gray-500">
                            {event.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {event.date}
                          </p>
                          <p className="text-xs text-gray-500">
                            {event.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                View Order
              </button>
              <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                Update Status
              </button>
              <button className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors">
                Contact Customer
              </button>
              <a
                href={`https://www.ups.com/track?tracknum=${order.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
              >
                Track External
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {searchTerm || statusFilter !== 'all' 
            ? 'No orders found matching your criteria.'
            : 'No orders to track.'
          }
        </div>
      )}

      {/* Tracking Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">In Transit</div>
          <div className="text-2xl font-bold text-purple-600">{orders.filter(o => o.status === 'in_transit').length}</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Out for Delivery</div>
          <div className="text-2xl font-bold text-orange-600">{orders.filter(o => o.status === 'out_for_delivery').length}</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Delivered</div>
          <div className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending Pickup</div>
          <div className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending_pickup').length}</div>
        </div>
      </div>
    </div>
  );
}