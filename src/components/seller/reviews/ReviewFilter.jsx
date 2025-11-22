"use client";

import { Search, X } from "lucide-react";

export default function ReviewFilters({
  searchQuery,
  setSearchQuery,
  selectedRating,
  setSelectedRating,
  onClearFilters,
  onPageReset
}) {
  const hasActiveFilters = searchQuery || selectedRating !== "all";

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    onPageReset();
  };

  const handleRatingChange = (value) => {
    setSelectedRating(value);
    onPageReset();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-emerald-300 dark:border-emerald-600/50 p-4 sm:p-6 mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Search Reviews
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by user or message..."
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>
          </div>
          
          {/* Rating Filter */}
          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Filter by Rating
            </label>
            <select
              value={selectedRating}
              onChange={(e) => handleRatingChange(e.target.value)}
              className="w-full px-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm appearance-none cursor-pointer"
            >
              <option value="all">All Ratings</option>
              <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
              <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
              <option value="3">⭐⭐⭐ (3 Stars)</option>
              <option value="2">⭐⭐ (2 Stars)</option>
              <option value="1">⭐ (1 Star)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters - Separate Row on Mobile */}
        {hasActiveFilters && (
          <div className="flex justify-start sm:justify-end">
            <button
              onClick={onClearFilters}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors duration-200 flex items-center gap-2 border border-slate-300 dark:border-slate-600"
            >
              <X size={16} />
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );}