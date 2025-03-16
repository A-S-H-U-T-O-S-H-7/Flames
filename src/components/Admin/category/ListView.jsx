"use client";

import { useCategories } from "@/lib/firestore/categories/read";
import { deleteCategory } from "@/lib/firestore/categories/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { Edit2, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function ListView() {
  const [pageLimit, setPageLimit] = useState(5); // Changed default to 5
  const [lastSnapDocList, setLastSnapDocList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const tableRef = useRef(null);

  // Reset pagination when page limit changes
  useEffect(() => {
    setIsTransitioning(true);
    if (tableRef.current) {
      tableRef.current.style.opacity = '0';
      tableRef.current.style.transform = 'translateY(10px)';
    }
    
    const timer = setTimeout(() => {
      setLastSnapDocList([]);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [pageLimit]);

  // Get categories with pagination
  const {
    data: categories,
    error,
    isLoading,
    lastSnapDoc,
  } = useCategories({
    pageLimit,
    lastSnapDoc: lastSnapDocList?.length === 0 ? null : lastSnapDocList[lastSnapDocList?.length - 1],
  });

  // Apply search filter whenever categories or search query changes
  useEffect(() => {
    if (!categories) return;
    
    let filtered = [...categories];
    
    if (searchQuery) {
      filtered = filtered.filter(category => 
        category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredCategories(filtered);
    
    if (tableRef.current && isTransitioning) {
      setTimeout(() => {
        tableRef.current.style.opacity = '1';
        tableRef.current.style.transform = 'translateY(0)';
        setIsTransitioning(false);
      }, 50);
    }
  }, [categories, searchQuery]);

  const handleNextPage = () => {
    if (!lastSnapDoc) return;
    
    setIsTransitioning(true);
    if (tableRef.current) {
      tableRef.current.style.opacity = '0';
      tableRef.current.style.transform = 'translateY(10px)';
    }
    
    setTimeout(() => {
      setLastSnapDocList(prev => [...prev, lastSnapDoc]);
    }, 300);
  };

  const handlePrePage = () => {
    if (lastSnapDocList.length === 0) return;
    
    setIsTransitioning(true);
    if (tableRef.current) {
      tableRef.current.style.opacity = '0';
      tableRef.current.style.transform = 'translateY(10px)';
    }
    
    setTimeout(() => {
      setLastSnapDocList(prev => prev.slice(0, -1));
    }, 300);
  };

  if (isLoading && lastSnapDocList.length === 0) {
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
    <div className="flex-1 flex flex-col gap-6 p-5 bg-white dark:bg-[#1e2737] rounded-xl shadow-lg transition-all duration-200 ease-in-out">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Categories
          <span className="ml-2 px-1 rounded-md text-xs border font-normal text-gray-500 dark:text-gray-400">
            {filteredCategories?.length ?? 0} items
          </span>
        </h1>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#22c7d5] shadow-sm hover:shadow-md transition-shadow"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div 
        ref={tableRef} 
        className="overflow-x-auto transition-all duration-300 ease-in-out" 
        style={{ opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)' }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#22c7d5] text-white">
              <th className="px-4 py-3 text-left rounded-l-lg">SN</th>
              <th className="px-4 py-3 text-center">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-center rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {isLoading && lastSnapDocList.length > 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center">
                  <CircularProgress size="sm" className="text-[#22c7d5]" />
                </td>
              </tr>
            ) : filteredCategories?.length > 0 ? (
              filteredCategories.map((item, index) => (
                <Row 
                  key={item?.id} 
                  item={item} 
                  index={index} 
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {searchQuery ? 
                    "No categories match your search criteria" : 
                    "No categories found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pt-4 border-t border-gray-100 dark:border-gray-700">
        <Button
          isDisabled={isLoading || lastSnapDocList?.length === 0 || isTransitioning}
          onClick={handlePrePage}
          size="sm"
          variant="bordered"
          className="w-full sm:w-auto flex items-center gap-1 border rounded-lg border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <ChevronLeft size={16} /> Previous
        </Button>

        <select
          value={pageLimit}
          onChange={(e) => setPageLimit(Number(e.target.value))}
          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2737] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#22c7d5] shadow-sm hover:shadow-md transition-shadow"
          disabled={isTransitioning}
        >
          <option value={3}>3 per page</option>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={100}>100 per page</option>
        </select>

        <Button
          isDisabled={isLoading || filteredCategories?.length < pageLimit || !lastSnapDoc || isTransitioning}
          onClick={handleNextPage}
          size="sm"
          variant="bordered"
          className="w-full sm:w-auto flex items-center gap-1 border rounded-lg border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          Next <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}

function Row({ item, index}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;

    setIsDeleting(true);
    try {
      await deleteCategory({ id: item?.id });
      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Error deleting category.");
    }
    setIsDeleting(false);
  };

  const handleUpdate = () => {
    router.push(`/admin/categories?id=${item?.id}`);
  };


  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
        {index + 1}
      </td>
      
      <td className="px-4 py-3">
        <div className="flex justify-center">
          <img 
            className="h-12 w-12 object-cover rounded-md shadow" 
            src={item?.imageURL} 
            alt={item?.name}
          />
        </div>
      </td>
      <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
        {item?.name}
      </td>

      
      <td className="px-4 py-3">
        <div className="flex justify-center gap-3">
          <Button
            onClick={handleUpdate}
            isDisabled={isDeleting}
            isIconOnly
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 transition-all"
          >
            <Edit2 size={18} />
          </Button>
          <Button
            onClick={handleDelete}
            isLoading={isDeleting}
            isDisabled={isDeleting}
            isIconOnly
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 transition-all"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </td>
    </tr>
  );
}