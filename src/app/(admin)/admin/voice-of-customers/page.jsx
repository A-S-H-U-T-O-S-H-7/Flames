"use client";

import { useSuggestions } from "@/lib/firestore/suggestions/read";
import { updateSuggestionStatus } from "@/lib/firestore/suggestions/write";
import { useState, useMemo, useEffect } from "react";
import { Button, CircularProgress } from "@nextui-org/react";
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "reviewed", label: "Reviewed" },
  { value: "implemented", label: "Implemented" },
  { value: "rejected", label: "Rejected" }
];

const TYPE_OPTIONS = [
  { value: "suggestion", label: "Suggestion" },
  { value: "feedback", label: "Feedback" },
  { value: "bug", label: "Bug Report" },
  { value: "feature", label: "Feature Request" }
];

export default function SuggestionsListView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [forceRefresh, setForceRefresh] = useState(0);
  
  const filters = useMemo(() => {
    const filterObj = {};
    if (statusFilter) filterObj.status = statusFilter;
    if (typeFilter) filterObj.type = typeFilter;
    return filterObj;
  }, [statusFilter, typeFilter]);
  
  const { suggestions, error, isLoading } = useSuggestions(filters, forceRefresh);

  // Calculate filtered and paginated data
  const filteredSuggestions = useMemo(() => {
    if (!suggestions) return [];
    
    return suggestions.filter(item => 
      item.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [suggestions, searchQuery]);
  
  const paginatedSuggestions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredSuggestions.slice(start, end);
  }, [filteredSuggestions, currentPage, pageSize]);
  
  const totalSuggestions = useMemo(() => filteredSuggestions.length, [filteredSuggestions]);
  const totalPages = useMemo(() => Math.ceil(totalSuggestions / pageSize) || 1, [totalSuggestions, pageSize]);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter, pageSize]);

  // Update status handler
  const handleStatusChange = async (id, newStatus, currentStatus) => {
    if (newStatus === currentStatus) return;
    
    try {
      await updateSuggestionStatus({ id, status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      setForceRefresh(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || "Error updating status");
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let rangeStart = Math.max(2, currentPage - 1);
      let rangeEnd = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        rangeEnd = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 2) {
        rangeStart = Math.max(2, totalPages - 3);
      }
      
      if (rangeStart > 2) {
        pages.push('...');
      }
      
      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
      }
      
      if (rangeEnd < totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "reviewed": return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      case "implemented": return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
      case "rejected": return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400";
    }
  };

  if (isLoading && !suggestions) {
    return (
      <div className="flex justify-center items-center h-32">
        <CircularProgress size="lg" className="text-[#22c7d5]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-6 p-5 bg-white dark:bg-[#0e1726] rounded-xl shadow-lg transition-all duration-200 ease-in-out">
      {/* Header with title, search, and filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Suggestions & Feedback
          <span className="ml-2 px-2 py-1 rounded-md text-xs border font-normal text-gray-500 dark:text-gray-400">
            {filteredSuggestions?.length ?? 0} items
          </span>
        </h1>
        
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#22c7d5] shadow-sm hover:shadow-md transition-shadow"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
          </div>
          
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-40 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#22c7d5] shadow-sm hover:shadow-md transition-shadow"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          
          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-40 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#22c7d5] shadow-sm hover:shadow-md transition-shadow"
          >
            <option value="">All Types</option>
            {TYPE_OPTIONS.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          
          {/* Clear filters button */}
          <Button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("");
              setTypeFilter("");
            }}
            size="sm"
            className="w-full sm:w-auto flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <X size={16} /> Clear
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#22c7d5] text-white">
              <th className="px-4 py-3 text-left rounded-l-lg">#</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Message</th>
              <th className="px-4 py-3 text-center">Type</th>
              <th className="px-4 py-3 text-center rounded-r-lg">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center">
                  <CircularProgress size="sm" className="text-[#22c7d5]" />
                </td>
              </tr>
            ) : paginatedSuggestions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {searchQuery || statusFilter || typeFilter ? 
                    "No suggestions match your search criteria" : 
                    "No suggestions found"}
                </td>
              </tr>
            ) : (
              paginatedSuggestions.map((item, index) => {
                // Format message for display (truncate if too long)
                const formattedMessage = item.message?.length > 80 
                  ? `${item.message.substring(0, 80)}...` 
                  : item.message || "No message";
                
                // Get type label
                const typeLabel = TYPE_OPTIONS.find(t => t.value === item.type)?.label || item.type || "Unknown";
                
                return (
                  <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                      <div className="font-medium">{item.displayName || "Anonymous"}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {item.email || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {item.phone || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                      <div className="max-w-xs truncate" title={item.message}>
                        {formattedMessage}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-[#22c7d5]/10 text-[#22c7d5] px-3 py-1 rounded-full text-sm font-medium">
                        {typeLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <select
                        value={item.status || "pending"}
                        onChange={(e) => handleStatusChange(item.id, e.target.value, item.status)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)} border focus:outline-none focus:border-[#22c7d5]`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option 
                            key={status.value} 
                            value={status.value}
                            className="bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-300"
                          >
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-gray-700 dark:text-gray-300">{paginatedSuggestions.length}</span> of <span className="font-medium text-gray-700 dark:text-gray-300">{totalSuggestions}</span> suggestions
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            isDisabled={isLoading || currentPage === 1}
            onClick={() => setCurrentPage(1)}
            size="sm"
            variant="bordered"
            className="flex items-center gap-1 border rounded-lg border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            First
          </Button>
          
          <Button
            isDisabled={isLoading || currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            size="sm"
            variant="bordered"
            className="flex items-center gap-1 border rounded-lg border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <ChevronLeft size={16} /> Previous
          </Button>

          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#22c7d5] shadow-sm hover:shadow-md transition-shadow"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>

          <Button
            isDisabled={isLoading || currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            size="sm"
            variant="bordered"
            className="flex items-center gap-1 border rounded-lg border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            Next <ChevronRight size={16} />
          </Button>
          
          <Button
            isDisabled={isLoading || currentPage >= totalPages}
            onClick={() => setCurrentPage(totalPages)}
            size="sm"
            variant="bordered"
            className="flex items-center gap-1 border rounded-lg border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}