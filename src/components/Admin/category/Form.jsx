"use client";

import { getCategory } from "@/lib/firestore/categories/read_server";
import { createNewCategory, updateCategory } from "@/lib/firestore/categories/write";
import { Button } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Form() {
  const [data, setData] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const fetchData = async () => {
    try {
      const res = await getCategory({ id: id });
      if (!res) {
        toast.error("Category Not Found!");
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
      await createNewCategory({ data, image });
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
      await updateCategory({ data, image });
      toast.success("Successfully Updated");
      setData(null);
      setImage(null);
      router.push(`/admin/categories`);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex border border-[#22c7d5] py-6 flex-col gap-6 bg-white dark:bg-[#0e1726] dark:text-[#888ea8] rounded-xl p-5 w-full md:w-[400px] transition-all duration-200 ease-in-out">
      <h1 className="font-semibold text-[#212529] dark:text-white">
        {id ? "Update" : "Create"} Category
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
          <label htmlFor="category-image" className="text-gray-500 dark:text-[#888ea8] text-sm">
            Image <span className="text-red-500">*</span>
          </label>
          <div className="flex justify-center items-center border-2 border-dashed border-purple-500 dark:border-[#22c7d5] p-6 rounded-lg cursor-pointer" onClick={() => document.getElementById('category-image').click()}>
            {image ? (
              <img className="h-20 rounded-lg shadow-md" src={URL.createObjectURL(image)} alt="Preview" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl text-gray-400">+</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Upload Category Image</span>
              </div>
            )}
          </div>
          <input
            id="category-image"
            name="category-image"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="hidden"
          />
        </div>

        {/* Name Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="category-name" className="text-gray-500 dark:text-[#888ea8] text-sm">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="category-name"
            name="category-name"
            type="text"
            placeholder="Enter Name"
            value={data?.name ?? ""}
            onChange={(e) => handleData("name", e.target.value)}
            className="border border-purple-500 dark:border-[#22c7d5] px-4 py-2 rounded-lg w-full focus:outline-none bg-white dark:bg-[#1e2737] text-black dark:text-white transition-all duration-200 ease-in-out"
          />
        </div>

        {/* Slug Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="category-slug" className="text-gray-500 dark:text-[#888ea8] text-sm">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="category-slug"
            name="category-slug"
            type="text"
            placeholder="Enter Slug"
            value={data?.slug ?? ""}
            onChange={(e) => handleData("slug", e.target.value)}
            className="border border-purple-500 dark:border-[#22c7d5] px-4 py-2 rounded-lg w-full focus:outline-none bg-white dark:bg-[#1e2737] text-black dark:text-white transition-all duration-200 ease-in-out"
          />
        </div>

        {/* Submit Button */}
        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          type="submit"
          className="bg-[#22c7d5] text-white font-semibold py-2 mt-4 px-4 rounded-lg hover:bg-[#1aa5b5] "
        >
          {id ? "Update" : "Create"}
        </Button>
      </form>
    </div>
  );
}