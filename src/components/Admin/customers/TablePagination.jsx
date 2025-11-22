// TablePagination.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";

const TablePagination = ({ 
  pageLimit, 
  setPageLimit, 
  hasNext, 
  hasPrev, 
  isLoading, 
  onNextPage, 
  onPrevPage 
}) => {
  const handlePageLimitChange = (e) => {
    setPageLimit(Number(e.target.value));
  };
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pt-4 border-t border-gray-100 dark:border-gray-700">
      <button
        disabled={isLoading || !hasPrev}
        onClick={onPrevPage}
        className="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-2 text-sm border rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} /> Previous
      </button>

      <select
        value={pageLimit}
        onChange={handlePageLimitChange}
        className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#22c7d5] shadow-sm hover:shadow-md transition-all duration-300"
      >
        <option value={5}>5 per page</option>
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
        <option value={50}>50 per page</option>
        <option value={100}>100 per page</option>
      </select>

      <button
        disabled={isLoading || !hasNext}
        onClick={onNextPage}
        className="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-2 text-sm border rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default TablePagination;