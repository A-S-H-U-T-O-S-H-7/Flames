"use client";

import { getAdmin } from "@/lib/firestore/admins/read_server";
import { createNewAdmin, updateAdmin } from "@/lib/firestore/admins/write";
import { Button } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usePermissions } from "@/context/PermissionContext";
import RoleSelector from "../RoleManagement/RoleSelector";
import PermissionManager from "../RoleManagement/PermissionManager";
import { ROLES } from "@/lib/permissions/adminPermissions";

export default function Form() {
  const [data, setData] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { adminData, isSuperAdmin, isLoading: permissionLoading } = usePermissions();

  // Only super admins can create/edit admins
  if (!permissionLoading && !isSuperAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p>Only super admins can manage admin accounts.</p>
      </div>
    );
  }

  // Only super admins can create/edit admins
  if (!permissionLoading && !isSuperAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p>Only super admins can manage admin accounts.</p>
      </div>
    );
  }

  const fetchData = async () => {
    try {
      const res = await getAdmin({ id: id });
      if (!res) {
        toast.error("Admin Not Found!");
      } else {
        setData(res);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleData = (key, value) => {
    setData((prevData) => ({
      ...(prevData ?? {}),
      [key]: value,
    }));
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      // Ensure role and permissions are set
      if (!data?.role) {
        throw new Error("Role is required");
      }
      await createNewAdmin({ data, image });
      toast.success("Successfully Created");
      setData(null);
      setImage(null);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      // Ensure role and permissions are set
      if (!data?.role) {
        throw new Error("Role is required");
      }
      await updateAdmin({ data, image });
      toast.success("Successfully Updated");
      setData(null);
      setImage(null);
      router.push(`/admin/admins`);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-1 border border-[#22c7d5] py-6 flex-col gap-6 bg-white dark:bg-[#0e1726] dark:text-[#888ea8] rounded-xl p-5 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto transition-all duration-200 ease-in-out">
      <h1 className="font-semibold text-[#212529] dark:text-white text-center text-lg md:text-xl">
        {id ? "Update" : "Create"} Admin
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          id ? handleUpdate() : handleCreate();
        }}
        className="flex flex-col gap-4"
      >
        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <label htmlFor="Admin-image" className="text-gray-500 dark:text-[#888ea8] text-sm">
            Image <span className="text-red-500">*</span>
          </label>
          <div className="flex justify-center items-center border-2 border-dashed border-purple-500 dark:border-[#22c7d5] p-6 rounded-lg cursor-pointer w-full" onClick={() => document.getElementById('admin-image').click()}>
          {image ? (
  <img className="h-20 rounded-lg shadow-md" src={URL.createObjectURL(image)} alt="Preview" />
) : data?.imageURL ? (
  <img className="h-20 rounded-lg shadow-md" src={data.imageURL} alt="Preview" />
) : (
  <div className="flex flex-col items-center gap-2">
    <span className="text-4xl text-gray-400">+</span>
    <span className="text-sm text-gray-500 dark:text-gray-400 text-center">Upload Admin Image</span>
  </div>
)}
          </div>
          <input
            id="admin-image"
            name="admin-image"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="hidden"
          />
        </div>

        {/* Name Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="admin-name" className="text-gray-500 dark:text-[#888ea8] text-sm">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="admin-name"
            name="admin-name"
            type="text"
            placeholder="Enter Name"
            value={data?.name ?? ""}
            onChange={(e) => handleData("name", e.target.value)}
            className="border border-purple-500 dark:border-[#22c7d5] px-4 py-2 rounded-lg w-full focus:outline-none bg-white dark:bg-[#1e2737] text-black dark:text-white transition-all duration-200 ease-in-out"
          />
        </div>
        {/* Email Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="admin-email" className="text-gray-500 dark:text-[#888ea8] text-sm">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="admin-email"
            name="admin-email"
            type="email"
            placeholder="Enter Email"
            value={data?.email ?? ""}
            onChange={(e) => handleData("email", e.target.value)}
            className="border border-purple-500 dark:border-[#22c7d5] px-4 py-2 rounded-lg w-full focus:outline-none bg-white dark:bg-[#1e2737] text-black dark:text-white transition-all duration-200 ease-in-out"
          />
        </div>

        {/* Role Selection */}
        <RoleSelector
          selectedRole={data?.role}
          onRoleChange={(role) => handleData("role", role)}
          disabled={isLoading}
          currentUserRole={adminData?.role}
        />

        {/* Permission Management */}
        {data?.role && (
          <PermissionManager
            selectedRole={data.role}
            permissions={data?.permissions}
            onPermissionsChange={(permissions) => handleData("permissions", permissions)}
            disabled={isLoading}
            currentUserRole={adminData?.role}
          />
        )}

        {/* Submit Button */}
        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          type="submit"
          className="bg-[#22c7d5] text-white font-semibold py-2 mt-4 px-4 rounded-lg hover:bg-[#1aa5b5] w-full"
        >
          {id ? "Update" : "Create"}
        </Button>
      </form>
    </div>
  );
}
