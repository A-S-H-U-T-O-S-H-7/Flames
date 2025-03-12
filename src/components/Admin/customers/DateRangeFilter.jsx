// DateRangeFilter.jsx
import { useState } from "react";

const DateRangeFilter = ({ dateRange, setDateRange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStartDateChange = (e) => {
    const startDate = e.target.value ? new Date(e.target.value) : null;
    setDateRange(prev => ({ ...prev, startDate }));
  };

  const handleEndDateChange = (e) => {
    const endDate = e.target.value ? new Date(e.target.value) : null;
    setDateRange(prev => ({ ...prev, endDate }));
  };

  const clearDateFilter = () => {
    setDateRange({ startDate: null, endDate: null });
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-[#1e2737] rounded-lg p-3 transition-all duration-300">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center text-gray-700 dark:text-gray-300 font-medium"
      >
        <span>Date Range Filter</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div 
        className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Start Date
          </label>
          <input
            type="date"
            value={formatDateForInput(dateRange.startDate)}
            onChange={handleStartDateChange}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0e1726] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#22c7d5] transition-all duration-300"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
            End Date
          </label>
          <input
            type="date"
            value={formatDateForInput(dateRange.endDate)}
            onChange={handleEndDateChange}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0e1726] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#22c7d5] transition-all duration-300"
          />
        </div>
        
        {(dateRange.startDate || dateRange.endDate) && (
          <button
            onClick={clearDateFilter}
            className="text-sm text-[#22c7d5] hover:text-[#1ea8b5] transition-colors col-span-full text-right"
          >
            Clear filter
          </button>
        )}
      </div>
    </div>
  );
};

export default DateRangeFilter;