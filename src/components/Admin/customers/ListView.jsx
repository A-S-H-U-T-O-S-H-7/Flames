// ListView.jsx
"use client";

import { useUsers } from "@/lib/firestore/user/read";
import { updateUser } from "@/lib/firestore/user/write";
import { useState, useEffect } from "react";
import UserTable from "./UserTable";
import DateRangeFilter from "./DateRangeFilter";
import TablePagination from "./TablePagination";
import SearchBar from "./SearchBar";

export default function ListView() {
  // Pagination state
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  

  // Reset pagination when page limit changes
  useEffect(() => {
    setLastSnapDocList([]);
  }, [pageLimit]);

  // Fetch users data
  const { 
    data: users, 
    error, 
    isLoading, 
    lastSnapDoc 
  } = useUsers({
    pageLimit,
    lastSnapDoc: lastSnapDocList?.length === 0 ? null : lastSnapDocList[lastSnapDocList?.length - 1],
  });

  // Apply filters whenever users, search query, or date range changes
  useEffect(() => {
    if (!users) return;
    
    let filtered = [...users];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user?.displayName?.toLowerCase().includes(query) ||
        user?.email?.toLowerCase().includes(query) ||
        user?.id?.toLowerCase().includes(query)
      );
    }
    
    // Apply date range filter
    if (dateRange.startDate && dateRange.endDate) {
      const startTimestamp = dateRange.startDate.getTime() / 1000;
      const endTimestamp = dateRange.endDate.getTime() / 1000;
      
      filtered = filtered.filter(user => {
        if (!user?.timestampCreate?.seconds) return false;
        return user.timestampCreate.seconds >= startTimestamp && 
               user.timestampCreate.seconds <= endTimestamp;
      });
    }
    
    setFilteredUsers(filtered);
  }, [users, searchQuery, dateRange]);

  // Pagination handlers
  const handleNextPage = () => {
    setLastSnapDocList([...lastSnapDocList, lastSnapDoc]);
  };

  const handlePrevPage = () => {
    setLastSnapDocList(lastSnapDocList.slice(0, -1));
  };



  // Handle loading and error states
  if (isLoading && lastSnapDocList.length === 0) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="flex-1 flex flex-col gap-4 bg-white dark:bg-[#0e1726] rounded-xl p-4 border no-scrollbar border-purple-500/30 dark:border-[#22c7d5] shadow-sm transition-all duration-300">
      {/* Header with title and count */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Customers
          <span className="ml-2 px-2 py-1 rounded-md text-xs border font-normal text-gray-500 dark:text-gray-400">
            {filteredUsers?.length ?? 0} users
          </span>
        </h1>

        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
      </div>
      
      {/* Date range filter */}
      <DateRangeFilter 
        dateRange={dateRange} 
        setDateRange={setDateRange} 
      />
      
      {/* User data table */}
      <UserTable 
        users={filteredUsers}
        isLoading={isLoading && lastSnapDocList.length > 0}
        searchQuery={searchQuery}
        pageOffset={lastSnapDocList?.length * pageLimit}
      />

      {/* Pagination controls */}
      <TablePagination 
        pageLimit={pageLimit}
        setPageLimit={setPageLimit}
        hasNext={users?.length > 0}
        hasPrev={lastSnapDocList?.length > 0}
        isLoading={isLoading}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />

    </div>
  );
}

// Helper components for loading and error states
const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-64">
    <div className="w-12 h-12 rounded-full border-4 border-t-[#22c7d5] border-r-transparent border-l-transparent border-b-transparent animate-spin"></div>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-lg">
    {message}
  </div>
);