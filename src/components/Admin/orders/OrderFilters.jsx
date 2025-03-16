import React, { useState } from 'react';
import { Search, FileDown, ChevronDown, X, Calendar, AlertCircle } from 'lucide-react';

export function OrderFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  clearFilters,
  exportToCSV,
  brandFilter,
  setBrandFilter,
  brands,
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDateRange, setTempDateRange] = useState({ from: dateRange.from, to: dateRange.to });
  const [showExportConfirm, setShowExportConfirm] = useState(false);

  const handleApplyDateFilter = () => {
    setDateRange(tempDateRange);
    setShowDatePicker(false);
  };

  const handleExportConfirm = () => {
    exportToCSV();
    setShowExportConfirm(false);
  };

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
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="in transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <ChevronDown size={16} />
          </div>
        </div>

        

        {/* Date Range - Button to open popup */}
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(true)}
            className="flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-sm transition-colors border border-gray-600"
          >
            <Calendar size={16} className="mr-2" />
            <span>
              {dateRange.from || dateRange.to
                ? `${dateRange.from || 'Any'} to ${dateRange.to || 'Any'}`
                : 'Select Date Range'}
            </span>
          </button>

          {/* Date Range Popup */}
          {showDatePicker && (
            <div className="absolute z-10 mt-2 p-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700 w-72">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-medium">Date Range</h3>
                <button onClick={() => setShowDatePicker(false)} className="text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-gray-400 text-sm mb-1">From</label>
                  <input
                    type="date"
                    className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                    value={tempDateRange.from}
                    onChange={(e) => setTempDateRange({ ...tempDateRange, from: e.target.value })}
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-gray-400 text-sm mb-1">To</label>
                  <input
                    type="date"
                    className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                    value={tempDateRange.to}
                    onChange={(e) => setTempDateRange({ ...tempDateRange, to: e.target.value })}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => {
                      setTempDateRange({ from: '', to: '' });
                      setDateRange({ from: '', to: '' });
                      setShowDatePicker(false);
                    }}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-white text-sm"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleApplyDateFilter}
                    className="px-3 py-1 bg-[#22c7d5] hover:bg-[#1ea8b4] rounded text-white text-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
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
            onClick={() => setShowExportConfirm(true)}
            className="flex items-center px-3 py-2 bg-[#22c7d5] hover:bg-[#1ea8b4] rounded-md text-white text-sm transition-colors w-full md:w-auto"
          >
            <FileDown size={14} className="mr-1" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Export Confirmation Modal */}
      {showExportConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden w-full max-w-md border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white flex items-center">
                <AlertCircle className="text-[#22c7d5] mr-2" size={20} />
                Export Orders
              </h3>
            </div>
            
            <div className="p-4">
              <p className="text-gray-300 mb-4">
                Are you sure you want to export {searchTerm || statusFilter !== "all" || dateRange.from || dateRange.to || brandFilter !== "all" ? "filtered" : "all"} orders to CSV?
              </p>
              
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setShowExportConfirm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExportConfirm}
                  className="px-4 py-2 bg-[#22c7d5] hover:bg-[#1ea8b4] rounded text-white"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}