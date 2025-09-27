"use client";

import { useAdmins } from "@/lib/firestore/admins/read";
import { deleteAdmin } from "@/lib/firestore/admins/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePermissions } from "@/context/PermissionContext";
import { getRoleDisplayName, getRoleColor, ROLES } from "@/lib/permissions/adminPermissions";
import PermissionGuard from "../PermissionGuard";

export default function ListView() {
  const { data: admins, error, isLoading } = useAdmins();
  const { isSuperAdmin } = usePermissions();

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
    <PermissionGuard requiredPermission="admins">
      <div className="flex-1 flex flex-col gap-4 p-5 bg-white dark:bg-[#1e2737] rounded-xl shadow-lg overflow-x-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Admin Management</h1>
          {isSuperAdmin() && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Create, edit, and manage admin accounts with role-based permissions
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden text-sm md:text-base">
            <thead>
              <tr className="bg-[#22c7d5] text-white">
                <th className="px-2 md:px-4 py-3 text-left">SN</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-2 md:px-4 py-3 text-center">Image</th>
                <th className="px-2 md:px-4 py-3 text-left">Details</th>
                <th className="px-2 md:px-4 py-3 text-center">Role & Access</th>
                <th className="px-2 md:px-4 py-3 text-center">Actions</th>
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
    </PermissionGuard>
  );
}

function Row({ item, index }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { isSuperAdmin, adminData } = usePermissions();
  const canModify = isSuperAdmin() && item?.email !== adminData?.email; // Can't modify own account

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
    if (canModify || item?.email === adminData?.email) {
      router.push(`/admin/admins?id=${item?.id}`);
    }
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

  return (
    <tr className="border-b flex-1 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-xs md:text-sm">
      <td className="px-2 md:px-4 py-3 text-gray-700 dark:text-gray-300">{index + 1}</td>
      <td>
        <h2 className="px-2 md:px-4 pt-3 text-gray-800 dark:text-gray-200">{formatDateTime(item?.timestampCreate)}</h2>
      </td>
      <td className="px-2 md:px-4 py-3 text-center">
        <div className="flex justify-center">
          <img className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-md shadow" src={item?.imageURL} alt="Admin" />
        </div>
      </td>
      
      <td>
        <h2 className="px-2 md:px-4 pt-3 text-gray-800 dark:text-gray-200">{item?.name}</h2>
        <h3 className="px-2 md:px-4 pb-3 text-xs md:text-sm text-gray-600 dark:text-gray-400">{item?.email}</h3>
      </td>
      
      <td className="px-2 md:px-4 py-3 text-center">
        <div className="flex flex-col items-center gap-1">
          <span 
            className={`px-2 py-1 text-xs rounded-full font-medium ${getRoleColor(item?.role)} cursor-help`}
            title={`Access to ${item?.permissions ? item.permissions.length : 0} admin pages`}
          >
            {getRoleDisplayName(item?.role || 'Unknown')}
          </span>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {item?.permissions ? `${item.permissions.length} pages` : '0 pages'}
          </div>
        </div>
      </td>
      
      <td className="px-2 md:px-4 py-3">
        <div className="flex justify-center gap-1 md:gap-2">
          <Button
            onClick={handleUpdate}
            isDisabled={isDeleting || (!canModify && item?.email !== adminData?.email)}
            isIconOnly
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-1 md:p-2 transition-all disabled:opacity-50"
            title="Edit Admin & Permissions"
          >
            <Edit2 size={14} />
          </Button>
          
          {canModify && (
            <Button
              onClick={handleDelete}
              isLoading={isDeleting}
              isDisabled={isDeleting}
              isIconOnly
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-1 md:p-2 transition-all"
              title="Delete Admin"
            >
              <Trash2 size={14} />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
