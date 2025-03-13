"use client";

import { useCollections } from "@/lib/firestore/collections/read";
import { deleteCollection } from "@/lib/firestore/collections/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ListView() {
  const { data: collections, error, isLoading } = useCollections();

  if (isLoading) {
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Collections
        </h1>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#22c7d5] text-white">
              <th className="px-4 py-3 text-left rounded-l-lg">SN</th>
              <th className="px-4 py-3 text-center">Image</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-center">Products</th>
              <th className="px-4 py-3 text-center rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {collections?.map((item, index) => (
              <Row index={index} item={item} key={item?.id} />
            ))}
          </tbody>
        </table>
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
          {item?.products?.length}
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