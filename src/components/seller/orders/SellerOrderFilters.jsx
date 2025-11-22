// components/seller/orders/OrderFilters.jsx
'use client'

import { Search, Filter, X, Calendar, FileDown } from 'lucide-react'
import { useState } from 'react'

export default function OrderFilters({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  showFilters,
  onToggleFilters,
  onClearFilters,
  onExportCSV
}) {
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    })
  }

  const handleDateApply = () => {
    setShowDatePicker(false)
  }

  const handleDateClear = () => {
    onFilterChange({
      ...filters,
      dateFrom: '',
      dateTo: ''
    })
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-emerald-300 dark:border-emerald-600/50 p-4 sm:p-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search orders by ID, customer name, or address..."
            className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onToggleFilters}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-sm sm:text-base"
          >
            <Filter size={20} />
            Filters
          </button>
          
          <button
            onClick={onExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-sm sm:text-base"
          >
            <FileDown size={20} />
            Export
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Advanced Filters</h3>
            <div className="flex gap-2">
              <button
                onClick={onClearFilters}
                className="flex items-center gap-1 px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200"
              >
                <X size={16} />
                Clear All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="packed">Packed</option>
                <option value="shipped">Shipped</option>
                <option value="in transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Payment Mode
              </label>
              <select
                value={filters.paymentMode}
                onChange={(e) => handleFilterChange('paymentMode', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="all">All Payments</option>
                <option value="cod">COD</option>
                <option value="prepaid">Prepaid</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Date Range
              </label>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm flex items-center justify-between"
              >
                <span>
                  {filters.dateFrom || filters.dateTo 
                    ? `${filters.dateFrom || 'Start'} to ${filters.dateTo || 'End'}`
                    : 'Select Date Range'
                  }
                </span>
                <Calendar size={16} className="text-slate-400" />
              </button>

              {showDatePicker && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-700"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDateClear}
                        className="flex-1 px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleDateApply}
                        className="flex-1 px-2 py-1 text-xs bg-teal-500 text-white rounded hover:bg-teal-600"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}