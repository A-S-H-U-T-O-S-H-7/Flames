"use client";
import React from 'react';
import { Eye, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateTime, getStatusColor } from './OrdersUtil';
import ChangeOrderStatus from './ChangeOrderStatus';

export function OrdersTable({
  filteredOrders,
  orders,
  sortConfig,
  handleSort,
  handleViewClick,
  handleEditClick,
  handleCancelOrder,
  updateOrderStatus,
  currentPage,
  pageSize,
  totalOrders,
  onNextPage,
  onPrevPage,
  onPageSizeChange
}) {
  return (
    <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              <th className="px-4 py-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
                S. No
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider cursor-pointer group" 
                  onClick={() => handleSort('createdAt')}>
                <div className="flex items-center space-x-1">
                  <span>Date/Time</span>
                  {sortConfig.key === 'createdAt' && (
                    <span className="text-indigo-400">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider cursor-pointer group" 
                  onClick={() => handleSort('userName')}>
                <div className="flex items-center space-x-1">
                  <span>Customer</span>
                  {sortConfig.key === 'userName' && (
                    <span className="text-indigo-400">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
                Address
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
                Products
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider cursor-pointer group" 
                  onClick={() => handleSort('status')}>
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {sortConfig.key === 'status' && (
                    <span className="text-indigo-400">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-6 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center py-8">
                    <svg className="w-12 h-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                    </svg>
                    <p className="text-gray-400 font-medium">No orders found matching your filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => {
                const { date, time } = formatDateTime(order.createdAt);
                // Calculate the real index based on the current page and page size
                const orderIndex = (currentPage - 1) * pageSize + index + 1;
                
                return (
                  <tr key={order.id} className="transition-colors duration-200 bg-gray-900 hover:bg-gray-800">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                      {orderIndex}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex flex-col">
                        <span>{date}</span>
                        <span className="text-xs text-gray-500">{time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-indigo-200 font-medium">
                      {order.address?.fullName|| "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-300">
                      <div className="max-w-xs truncate">
                        {order.address?.city}, {order.address?.pincode || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-300">
                      <div className="flex flex-col space-y-2 max-w-xs">
                        {order.line_items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-800 text-indigo-300 rounded-full text-xs">
                              {item.quantity}
                            </div>
                            <div className="ml-2 truncate">
                            <div 
  className="text-xs font-medium text-gray-200 truncate w-full sm:max-w-[120px] md:max-w-[150px] lg:max-w-[180px]" 
  title={item.product_data.name}
>
  {item.product_data.name}
</div>
                              <div className="text-xs text-gray-400">
                                ₹{item.price} × {item.quantity}
                              </div>
                            </div>
                          </div>
                        ))}
                        {order.line_items.length > 2 && (
                          <span className="text-xs text-indigo-400 font-medium">
                            +{order.line_items.length - 2} more items
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.paymentMode === 'cod' 
                          ? 'bg-purple-700 text-white border border-purple-800/30' 
                          : 'bg-green-800 text-green-300 border border-green-500/30'
                      }`}>
                        {order.paymentMode}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs">
                      <span className={`px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewClick(order)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-lg transition-all duration-200 transform hover:scale-105"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditClick(order)}
                          className="bg-amber-600 hover:bg-amber-700 text-white p-1.5 rounded-lg transition-all duration-200 transform hover:scale-105"
                          title="Edit Order"
                        >
                          <Edit size={16} />
                        </button>
                        <ChangeOrderStatus order={order} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-800 bg-gray-900 gap-4">
        <div>
          <p className="text-sm text-gray-400">
            Showing <span className="font-medium text-indigo-300">{filteredOrders.length}</span> of <span className="font-medium text-indigo-300">{totalOrders}</span> orders
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-300 focus:outline-none focus:border-indigo-500 shadow-sm hover:shadow-md transition-shadow"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>

          <nav className="relative z-0 inline-flex rounded-lg shadow-lg overflow-hidden" aria-label="Pagination">
            <button 
              onClick={onPrevPage}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors duration-200 border-r border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </button>
            <div className="relative inline-flex items-center px-3 py-2 bg-gray-800 text-sm font-medium text-indigo-300 border-r border-gray-700">
              Page {currentPage} of {Math.ceil(totalOrders / pageSize)}
            </div>
            <button 
              onClick={onNextPage}
              disabled={currentPage >= Math.ceil(totalOrders / pageSize)}
              className="relative inline-flex items-center px-3 py-2 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={16} className="ml-1" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}