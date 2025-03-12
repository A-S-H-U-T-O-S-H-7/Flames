import React from 'react';
import { Search, FileDown, ChevronDown, X, Calendar } from 'lucide-react';

export function OrderFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  clearFilters,
  exportToCSV,
}) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 border border-gray-700">
      <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
        {/* Search */}
        <div className="relative flex-grow max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search Orders"
            className="pl-10 pr-3 py-2 w-full bg-gray-700 rounded-md text-white placeholder-gray-400 border border-gray-600 focus:ring-1 focus:ring-[#22c7d5] focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="w-full md:w-40 relative">
          <select
            className="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-white appearance-none focus:ring-1 focus:ring-[#22c7d5] focus:outline-none pr-8"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="transit">Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <ChevronDown size={16} />
          </div>
        </div>

        {/* Date Range - Responsive */}
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
          <div className="flex bg-gray-700 rounded-md border border-gray-600 overflow-hidden shadow-sm w-full md:w-auto">
            <div className="flex items-center justify-center px-3 bg-gray-600 text-gray-300">
              <Calendar size={16} />
            </div>
            <div className="flex flex-col md:flex-row items-center w-full md:w-auto divide-x divide-gray-600">
              <div className="relative px-2 group w-full md:w-auto">
                <span className="absolute top-0 left-2 text-xs text-gray-400 pt-1">From</span>
                <input
                  type="date"
                  className="pt-5 pb-2 w-full bg-transparent text-white focus:ring-0 focus:outline-none"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                />
              </div>
              <div className="relative px-2 group w-full md:w-auto">
                <span className="absolute top-0 left-2 text-xs text-gray-400 pt-1">To</span>
                <input
                  type="date"
                  className="pt-5 pb-2 w-full bg-transparent text-white focus:ring-0 focus:outline-none"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-2 w-full md:w-auto mt-3 md:mt-0 md:ml-auto justify-end">
          <button
            onClick={clearFilters}
            className="flex items-center px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white text-sm transition-colors w-full md:w-auto"
          >
            <X size={14} className="mr-1" />
            <span>Clear</span>
          </button>

          <button
            onClick={exportToCSV}
            className="flex items-center px-3 py-2 bg-[#22c7d5] hover:bg-[#1ea8b4] rounded-md text-white text-sm transition-colors w-full md:w-auto"
          >
            <FileDown size={14} className="mr-1" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}
