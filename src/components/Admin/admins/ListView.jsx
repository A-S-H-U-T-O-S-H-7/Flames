"use client";

import { useAdmins } from "@/lib/firestore/admins/read";
import { deleteAdmin } from "@/lib/firestore/admins/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ListView() {
  const { data: admins, error, isLoading } = useAdmins();

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
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Admins</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#22c7d5] w-full text-white">
              <th className="px-4 py-3 text-left">SN</th>
              <th className="px-4 py-3 text-center">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins?.map((item, index) => (
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
      await deleteAdmin({ id: item?.id });
      toast.success("Admin deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Error deleting admin.");
    }
    setIsDeleting(false);
  };

  const handleUpdate = () => {
    router.push(`/admin/admins?id=${item?.id}`);
  };

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{index + 1}</td>
      <td className="px-4 py-3 text-center">
        <div className="flex justify-center">
          <img className="h-12 w-12 object-cover rounded-md shadow" src={item?.imageURL} alt="Admin" />
        </div>
      </td>
      <td>
        <h2 className="px-4 pt-3 text-gray-800 dark:text-gray-200">{item?.name}</h2>
        <h3 className="px-4 pb-3 text-sm text-gray-800 dark:text-gray-200"> {item?.email}</h3>
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
