"use client";

import { useUsers } from "@/lib/firestore/user/read";
import { Avatar, Button, CircularProgress } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function ListView() {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);

  useEffect(() => {
    setLastSnapDocList([]);
  }, [pageLimit]);

  const { data: users, error, isLoading, lastSnapDoc } = useUsers({
    pageLimit,
    lastSnapDoc: lastSnapDocList?.length === 0 ? null : lastSnapDocList[lastSnapDocList?.length - 1],
  });

  const handleNextPage = () => {
    setLastSnapDocList([...lastSnapDocList, lastSnapDoc]);
  };

  const handlePrePage = () => {
    setLastSnapDocList(lastSnapDocList.slice(0, -1));
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
    <div className="flex-1 flex flex-col gap-4 bg-white dark:bg-[#0e1726] rounded-xl p-4 border border-purple-500/30 dark:border-[#22c7d5] shadow-sm transition-all duration-200">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1e2737]">
                <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300 rounded-l-lg">
                  #
                </th>
                <th className="font-semibold px-4 py-3 text-center text-gray-600 dark:text-gray-300">
                  Photo
                </th>
                <th className="font-semibold px-4 py-3 text-left text-gray-600 dark:text-gray-300">
                  Name
                </th>
                <th className="font-semibold px-4 py-3 text-left text-gray-600 dark:text-gray-300 rounded-r-lg">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {users?.map((item, index) => (
                <Row
                  key={item?.id || index}
                  item={item}
                  index={index + lastSnapDocList?.length * pageLimit}
                />
              ))}
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
          isDisabled={isLoading || users?.length === 0}
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

function Row({ item, index }) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-[#1e2737] transition-colors">
      <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">
        {index + 1}
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-center">
          <Avatar 
            src={item?.photoURL} 
            className="h-10 w-10 rounded-lg shadow-sm"
            alt={item?.displayName || 'User avatar'}
          />
        </div>
      </td>
      <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
        {item?.displayName}
      </td>
      <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
        {item?.email}
      </td>
    </tr>
  );
}