"use client";

import { useProducts } from "@/lib/firestore/products/read";
import { deleteProduct } from "@/lib/firestore/products/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductSearchFilter from "./ProductSearchFilter";

export default function ListView() {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    setLastSnapDocList([]);
  }, [pageLimit]);

  const {
    data: products,
    error,
    isLoading,
    lastSnapDoc,
  } = useProducts({
    pageLimit,
    lastSnapDoc: lastSnapDocList?.length === 0 ? null : lastSnapDocList[lastSnapDocList?.length - 1],
  });

  useEffect(() => {
    if (products) {
      let result = [...products];
      
      // Apply search filter
      if (searchTerm) {
        const lowercasedSearch = searchTerm.toLowerCase();
        result = result.filter(item => 
          item?.title?.toLowerCase().includes(lowercasedSearch)
        );
      }
      
      // Apply status filter
      if (activeFilters.status) {
        if (activeFilters.status === 'available') {
          result = result.filter(item => (item?.stock - (item?.orders ?? 0)) > 0);
        } else if (activeFilters.status === 'outOfStock') {
          result = result.filter(item => (item?.stock - (item?.orders ?? 0)) <= 0);
        }
      }
      
      // Apply featured filter
      if (activeFilters.featured) {
        if (activeFilters.featured === 'featured') {
          result = result.filter(item => item?.isFeatured);
        } else if (activeFilters.featured === 'notFeatured') {
          result = result.filter(item => !item?.isFeatured);
        }
      }
      
      // Apply new arrival filter
      if (activeFilters.newArrival) {
        if (activeFilters.newArrival === 'newArrival') {
          result = result.filter(item => item?.isNewArrival);
        } else if (activeFilters.newArrival === 'notNewArrival') {
          result = result.filter(item => !item?.isNewArrival);
        }
      }
      
      // Apply category filter
      if (activeFilters.categoryId) {
        result = result.filter(item => item?.categoryId === activeFilters.categoryId);
      }
      
      // Apply brand filter
      if (activeFilters.brandId) {
        result = result.filter(item => item?.brandId === activeFilters.brandId);
      }
      
      // Apply color filter
      if (activeFilters.color) {
        result = result.filter(item => item?.color === activeFilters.color);
      }
      
      // Apply occasion filter
      if (activeFilters.occasion) {
        result = result.filter(item => item?.occasion === activeFilters.occasion);
      }
      
      // Apply price range filter
      if (activeFilters.priceRange) {
        if (activeFilters.priceRange.min) {
          result = result.filter(item => item?.salePrice >= Number(activeFilters.priceRange.min));
        }
        if (activeFilters.priceRange.max) {
          result = result.filter(item => item?.salePrice <= Number(activeFilters.priceRange.max));
        }
      }
      
      // Apply stock filter
      if (activeFilters.stock) {
        if (activeFilters.stock.min) {
          result = result.filter(item => item?.stock >= Number(activeFilters.stock.min));
        }
        if (activeFilters.stock.max) {
          result = result.filter(item => item?.stock <= Number(activeFilters.stock.max));
        }
      }
      
      setFilteredProducts(result);
    }
  }, [products, searchTerm, activeFilters]);

  const handleNextPage = () => {
    setLastSnapDocList([...lastSnapDocList, lastSnapDoc]);
  };

  const handlePrePage = () => {
    setLastSnapDocList(lastSnapDocList.slice(0, -1));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (filters) => {
    setActiveFilters(filters);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress size="lg" color="primary" />
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
    <div className="flex flex-col gap-4">
      <ProductSearchFilter onSearch={handleSearch} onFilter={handleFilter} />
      
      <div className="flex-1 flex flex-col gap-4 bg-white dark:bg-[#0e1726] rounded-xl p-4 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm transition-all duration-200">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[800px]"> {/* Set minimum width for the table container */}
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#1e2737]">
                  <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300 rounded-l-lg">#</th>
                  <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300">Image</th>
                  <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300">Title</th>
                  <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300">Price</th>
                  <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300">Stock</th>
                  <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300">Orders</th>
                  <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300">Status</th>
                  <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300 rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredProducts?.map((item, index) => (
                  <Row
                    key={item?.id}
                    item={item}
                    index={index + lastSnapDocList?.length * pageLimit}
                  />
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                      No products found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

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
            isDisabled={isLoading || products?.length === 0}
            onClick={handleNextPage}
            size="sm"
            variant="bordered"
            className="w-full sm:w-auto flex items-center gap-1 border rounded-lg border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ item, index }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;
    
    setIsDeleting(true);
    try {
      await deleteProduct({ id: item?.id });
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsDeleting(false);
  };

  const handleUpdate = () => {
    router.push(`/admin/products/form?id=${item?.id}`);
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-[#1e2737] transition-colors">
      <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">
        {index + 1}
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex justify-center">
          <img
            className="h-10 w-10 rounded-lg object-cover shadow-sm"
            src={item?.featureImageURL}
            alt={item?.title}
          />
        </div>
      </td>
      <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-200">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {item?.title}
          <div className="flex gap-1 flex-wrap">
            {item?.isFeatured && (
              <span className="px-2 py-0.5 text-xs font-medium text-white bg-gradient-to-r from-[#22c7d5] to-[#1aa5b5] rounded-full">
                Featured
              </span>
            )}
            {item?.isNewArrival && (
              <span className="px-2 py-0.5 text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                New
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-200">
        <div className="flex flex-row items-center justify-center gap-2">
          {item?.salePrice < item?.price && (
            <>
              <span className="text-sm text-gray-400 line-through">₹{item?.price}</span>
              <span className="text-gray-400">|</span>
            </>
          )}
          <span className="font-medium">₹{item?.salePrice}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-200">
        {item?.stock}
      </td>
      <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-200">
        {item?.orders ?? 0}
      </td>
      <td className="px-4 py-3 text-center">
        {item?.stock  > 0 ? (
          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30 rounded-lg">
            Available
          </span>
        ) : (
          <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30 rounded-lg">
            Out of Stock
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-center items-center gap-2">
          <Button
            onClick={handleUpdate}
            isDisabled={isDeleting}
            isIconOnly
            size="sm"
            className="bg-blue-500 flex justify-center hover:bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <Edit2 size={14} />
          </Button>
          <Button
            onClick={handleDelete}
            isLoading={isDeleting}
            isDisabled={isDeleting}
            isIconOnly
            size="sm"
            className="bg-red-500 hover:bg-red-600 flex justify-center text-white rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </td>
    </tr>
  );
}