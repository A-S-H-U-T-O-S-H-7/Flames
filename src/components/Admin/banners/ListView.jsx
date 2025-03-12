"use client";

import { useBanners } from "@/lib/firestore/banners/read";
import { deleteBanner } from "@/lib/firestore/banners/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Import our new components
import SearchInput from "../SearchInput";
import FilterSelect from "../FilterSelect";
import SortButton from "../SortButton";
import { Clock, Edit2, Trash2 } from "lucide-react";

export default function ListView() {
  const { data: banners, error, isLoading } = useBanners();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBannerType, setSelectedBannerType] = useState("all");
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

  // Apply filters and sorting whenever banners, search query, selected type, or sort order changes
  useEffect(() => {
    if (!banners) return;
    
    let filtered = [...banners];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(banner => 
        banner?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        banner?.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        banner?.buttontext?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply banner type filter
    if (selectedBannerType !== "all") {
      filtered = filtered.filter(banner => 
        banner?.bannerType === selectedBannerType
      );
    }
    
    // Sort by creation time
    filtered.sort((a, b) => {
      const timeA = a?.createdAt?.toDate?.() || new Date(a?.createdAt || 0);
      const timeB = b?.createdAt?.toDate?.() || new Date(b?.createdAt || 0);
      
      return sortOrder === "desc" 
        ? timeB - timeA  // Newest first
        : timeA - timeB; // Oldest first
    });
    
    setFilteredBanners(filtered);
  }, [banners, searchQuery, selectedBannerType, sortOrder]);

  // Extract unique banner types for the dropdown
  const bannerTypes = banners ? 
    ["all", ...new Set(banners.map(banner => banner?.bannerType).filter(Boolean))] : 
    ["all"];

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <CircularProgress size="lg" />
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-4 p-5 bg-white dark:bg-[#1e2737] rounded-xl shadow-lg">
      {/* Header with title, search, filter and sort */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Banners
          <span className="ml-2 px-1 rounded-md text-xs border font-normal text-gray-500 dark:text-gray-400">
            {filteredBanners?.length ?? 0} items
          </span>
        </h1>
        
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          {/* Search input component */}
          <SearchInput 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search banners..."
            className="w-full sm:w-64"
          />
          
          {/* Banner type filter component */}
          <FilterSelect 
            value={selectedBannerType}
            onChange={setSelectedBannerType}
            options={bannerTypes}
            defaultOptionLabel="All Types"
            className="w-full sm:w-48"
          />
          
          {/* Sort order button component */}
          <SortButton 
            sortOrder={sortOrder}
            onToggle={toggleSortOrder}
            className="w-full sm:w-auto"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#22c7d5] text-white">
              <th className="px-4 py-3 text-left" style={{ width: "5%" }}>SN</th>
              <th className="px-4 py-3 text-center" style={{ width: "10%" }}>Image</th>
              <th className="px-4 py-3 text-left" style={{ width: "15%" }}>Title</th>
              <th className="px-4 py-3 text-left" style={{ width: "20%" }}>Sub Title</th>
              <th className="px-4 py-3 text-left" style={{ width: "10%" }}>Banner Type</th>
              <th className="px-4 py-3 text-left" style={{ width: "10%" }}>Button text</th>
              <th className="px-4 py-3 text-center" style={{ width: "15%" }}>Date & Time</th>
              <th className="px-4 py-3 text-center" style={{ width: "15%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBanners?.length > 0 ? (
              filteredBanners.map((item, index) => (
                <Row index={index} item={item} key={item?.id} />
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {searchQuery || selectedBannerType !== "all" ? 
                    "No banners match your search criteria" : 
                    "No banners found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Row component remains the same
function Row({ item, index }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;

    setIsDeleting(true);
    try {
      await deleteBanner({ id: item?.id });
      toast.success("Banner deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Error deleting banner.");
    }
    setIsDeleting(false);
  };

  const handleUpdate = () => {
    router.push(`/admin/banners?id=${item?.id}`);
  };

  // Format date and time
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    // Format: MM/DD/YY h:MMam/pm
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{index + 1}</td>
      <td className="px-4 py-3 text-center">
        <div className="flex justify-center">
          <img className="h-12 w-12 object-cover rounded-md shadow" src={item?.imageURL} alt="Banner" />
        </div>
      </td>
      <td className="px-4 py-3 text-gray-800 dark:text-gray-200 truncate max-w-[150px]" title={item?.title}>{item?.title}</td>
      <td className="px-4 py-3 text-gray-800 dark:text-gray-200 truncate max-w-[200px]" title={item?.subtitle}>{item?.subtitle}</td>
      <td className="px-4 py-3 text-gray-800 font-bold dark:text-green-600">{item?.bannerType}</td>
      <td className="px-4 py-3 text-gray-800 dark:text-gray-200 truncate max-w-[100px]" title={item?.buttontext}>{item?.buttontext}</td>
      <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-200">
        <div className="flex items-center justify-center gap-1">
          <Clock size={14} className="text-gray-400" />
          <span>{formatDateTime(item?.createdAt)}</span>
        </div>
      </td>
      <td className="px-4 py-3 flex justify-center gap-3">
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
      </td>
    </tr>
  );
}