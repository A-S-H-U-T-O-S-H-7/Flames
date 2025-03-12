// TablePagination.jsx
import { Button } from "@nextui-org/react";
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
      <Button
        isDisabled={isLoading || !hasPrev}
        onClick={onPrevPage}
        size="sm"
        variant="bordered"
        className="w-full sm:w-auto flex items-center gap-1 border rounded-lg border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <ChevronLeft size={16} /> Previous
      </Button>

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

      <Button
        isDisabled={isLoading || !hasNext}
        onClick={onNextPage}
        size="sm"
        variant="bordered"
        className="w-full sm:w-auto flex items-center gap-1 border rounded-lg border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
      >
        Next <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export default TablePagination;