"use client";

import { useCollections } from "@/lib/firestore/collections/read";
import { deleteCollection } from "@/lib/firestore/collections/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { Edit2, Trash2, Search, Filter, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Import our reusable components
import SearchInput from "../SearchInput";
import FilterSelect from "../FilterSelect";

export default function ListView() {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShowcased, setSelectedShowcased] = useState("all");
  const [filteredCollections, setFilteredCollections] = useState([]);

  // Reset pagination when page limit changes
  useEffect(() => {
    setLastSnapDocList([]);
  }, [pageLimit]);

  // Get collections with pagination
  const {
    data: collections,
    error,
    isLoading,
    lastSnapDoc,
  } = useCollections({
    pageLimit,
    lastSnapDoc: lastSnapDocList?.length === 0 ? null : lastSnapDocList[lastSnapDocList?.length - 1],
  });

  // Apply filters whenever collections, search query, or selected type changes
  useEffect(() => {
    if (!collections) return;
    
    let filtered = [...collections];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(collection => 
        collection?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        collection?.subTitle?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply showcased filter
    if (selectedShowcased !== "all") {
      filtered = filtered.filter(collection => 
        collection?.isShowcased === selectedShowcased
      );
    }
    
    setFilteredCollections(filtered);
  }, [collections, searchQuery, selectedShowcased]);

  // Pagination handlers
  const handleNextPage = () => {
    setLastSnapDocList([...lastSnapDocList, lastSnapDoc]);
  };

  const handlePrePage = () => {
    setLastSnapDocList(lastSnapDocList.slice(0, -1));
  };

  // Format date and time from Firestore timestamp
  const formatDateTime = (timestamp) => {
    if (!timestamp || !timestamp.seconds) {
      return "N/A";
    }
    
    // Convert Firestore timestamp to JavaScript Date
    const date = new Date(timestamp.seconds * 1000);
    
    // Format date in DD/MM/YY format
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    
    // Format time in h:MMam/pm format
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    return `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
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
    <div className="flex-1 flex flex-col gap-6 p-5 bg-white dark:bg-[#0e1726] rounded-xl shadow-lg transition-all duration-200 ease-in-out">
      {/* Header with title, search and filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Collections
          <span className="ml-2 px-1 rounded-md text-xs border font-normal text-gray-500 dark:text-gray-400">
            {filteredCollections?.length ?? 0} items
          </span>
        </h1>
        
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          {/* Search input component */}
          <SearchInput 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search collections..."
            className="w-full sm:w-64"
          />
          
          {/* Showcased filter component */}
          <FilterSelect 
            value={selectedShowcased}
            onChange={setSelectedShowcased}
            options={["all", "yes", "no"]}
            defaultOptionLabel="All Showcased"
            className="w-full sm:w-48"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#22c7d5] text-white">
              <th className="px-4 py-3 text-left rounded-l-lg">SN</th>
              <th className="px-4 py-3 text-center">Created At</th>
              <th className="px-4 py-3 text-center">Image</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-center">Products</th>
              <th className="px-4 py-3 text-center">Showcased</th>
              <th className="px-4 py-3 text-center rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {isLoading && lastSnapDocList.length > 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center">
                  <CircularProgress size="sm" className="text-[#22c7d5]" />
                </td>
              </tr>
            ) : filteredCollections?.length > 0 ? (
              filteredCollections.map((item, index) => (
                <Row 
                  key={item?.id} 
                  item={item} 
                  index={index} 
                  formatDateTime={formatDateTime} 
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {searchQuery || selectedShowcased !== "all" ? 
                    "No collections match your search criteria" : 
                    "No collections found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pt-4 border-t border-gray-100 dark:border-gray-700">
        <Button
          isDisabled={isLoading || lastSnapDocList?.length === 0}
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
        >
          <option value={3}>3 per page</option>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={100}>100 per page</option>
        </select>

        <Button
          isDisabled={isLoading || filteredCollections?.length === 0}
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

function Row({ item, index, formatDateTime }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;

    setIsDeleting(true);
    try {
      await deleteCollection({ id: item?.id });
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsDeleting(false);
  };

  const handleUpdate = () => {
    router.push(`/admin/collections?id=${item?.id}`);
  };

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
        {index + 1}
      </td>
      <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-200">
        <div className="flex items-center justify-center gap-1">
          {formatDateTime(item?.timestampCreate)}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-center">
          <img 
            className="h-12 w-12 object-cover rounded-md shadow" 
            src={item?.imageURL} 
            alt={item?.title}
          />
        </div>
      </td>
      <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
        <div className="font-medium">{item?.title}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {item?.subTitle}
        </div>
      </td>
      
      <td className="px-4 py-3 text-center">
        <span className="bg-[#22c7d5]/10 text-[#22c7d5] px-3 py-1 rounded-full text-sm font-medium">
          {item?.products?.length || 0}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          item?.isShowcased === "yes" 
            ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400" 
            : "bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400"
        }`}>
          {item?.isShowcased === "yes" ? "Yes" : "No"}
        </span>
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