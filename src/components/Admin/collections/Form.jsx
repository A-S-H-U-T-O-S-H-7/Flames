"use client";

import { getCollection } from "@/lib/firestore/collections/read_server";
import {
  createNewCollection,
  updateCollection,
} from "@/lib/firestore/collections/write";
import { useProduct, useProducts } from "@/lib/firestore/products/read";
import { Button } from "@nextui-org/react";
import { X, Upload } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Form() {
  const [data, setData] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: products } = useProducts({ pageLimit: 2000 });

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const fetchData = async () => {
    try {
      const res = await getCollection({ id: id });
      if (!res) {
        toast.error("Collection Not Found!");
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
    setData((preData) => {
      return {
        ...(preData ?? {}),
        [key]: value,
      };
    });
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await createNewCollection({ data: data, image: image });
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
      await updateCollection({ data: data, image: image });
      toast.success("Successfully Updated");
      setData(null);
      setImage(null);
      router.push(`/admin/collections`);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };
  
  return (
    <div className="flex border border-[#22c7d5] py-4 flex-col gap-6 bg-white dark:bg-[#0e1726] dark:text-[#888ea8] rounded-xl p-5 w-full md:w-[400px] transition-all duration-200 ease-in-out">
      <h1 className="font-semibold text-[#212529] dark:text-white text-xl">
        {id ? "Update" : "Create"} Collection
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
          <label htmlFor="collection-image" className="text-gray-500 dark:text-[#888ea8] text-sm">
            Image <span className="text-red-500">*</span>
          </label>
          <div 
            className="flex justify-center items-center border-2 border-dashed border-[#22c7d5] dark:border-[#22c7d5] p-6 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1e2737] transition-all"
            onClick={() => document.getElementById('collection-image').click()}
          >
            {image ? (
              <div className="flex flex-col items-center gap-2">
                <img className="h-24 w-auto rounded-lg shadow-md" src={URL.createObjectURL(image)} alt="Preview" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Click to change image</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload size={24} className="text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Upload Collection Image</span>
              </div>
            )}
          </div>
          <input
            id="collection-image"
            name="collection-image"
            type="file"
            onChange={(e) => e.target.files[0] && setImage(e.target.files[0])}
            className="hidden"
            accept="image/*"
          />
        </div>

        {/* Title Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="collection-title" className="text-gray-500 dark:text-[#888ea8] text-sm">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="collection-title"
            name="collection-title"
            type="text"
            placeholder="Enter Title"
            value={data?.title ?? ""}
            onChange={(e) => handleData("title", e.target.value)}
            className="border border-[#22c7d5] dark:border-[#22c7d5] px-4 py-2 rounded-lg w-full focus:outline-none bg-white dark:bg-[#1e2737] text-black dark:text-white transition-all duration-200 ease-in-out"
          />
        </div>

        {/* Sub Title Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="collection-sub-title" className="text-gray-500 dark:text-[#888ea8] text-sm">
            Sub Title <span className="text-red-500">*</span>
          </label>
          <input
            id="collection-sub-title"
            name="collection-sub-title"
            type="text"
            value={data?.subTitle ?? ""}
            onChange={(e) => handleData("subTitle", e.target.value)}
            placeholder="Enter Sub Title"
            className="border border-[#22c7d5] dark:border-[#22c7d5] px-4 py-2 rounded-lg w-full focus:outline-none bg-white dark:bg-[#1e2737] text-black dark:text-white transition-all duration-200 ease-in-out"
          />
        </div>

        {/* Selected Products */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-500 dark:text-[#888ea8] text-sm">
            Selected Products
          </label>
          <div className="flex flex-wrap gap-2">
            {data?.products?.map((productId) => (
              <ProductCard
                productId={productId}
                key={productId}
                setData={setData}
              />
            ))}
          </div>
        </div>

        {/* Product Selection */}
        <div className="flex flex-col gap-2">
          <label htmlFor="collection-products" className="text-gray-500 dark:text-[#888ea8] text-sm">
            Add Product <span className="text-red-500">*</span>
          </label>
          <select
            id="collection-products"
            name="collection-products"
            onChange={(e) => {
              if (e.target.value) {
                setData((prevData) => ({
                  ...prevData,
                  products: [...(prevData?.products ?? []), e.target.value],
                }));
              }
            }}
            className="border border-[#22c7d5] dark:border-[#22c7d5] px-4 py-2 rounded-lg w-full focus:outline-none bg-white dark:bg-[#1e2737] text-black dark:text-white transition-all duration-200 ease-in-out"
          >
            <option value="">Select Product</option>
            {products?.map((item) => (
              <option
                key={item.id}
                disabled={data?.products?.includes(item?.id)}
                value={item?.id}
              >
                {item?.title}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          type="submit"
          className="bg-[#22c7d5] text-white font-semibold py-2 mt-4 px-4 rounded-lg hover:bg-[#1aa5b5] transition-all duration-200 ease-in-out"
        >
          {id ? "Update" : "Create"}
        </Button>
      </form>
    </div>
  );
}

function ProductCard({ productId, setData }) {
  const { data: product } = useProduct({ productId: productId });
  return (
    <div className="flex items-center gap-2 bg-[#22c7d5] text-white px-4 py-1.5 rounded-full text-sm hover:bg-[#1aa5b5] transition-all duration-200 ease-in-out">
      <h2 className="max-w-[150px] truncate">{product?.title}</h2>
      <button
        onClick={(e) => {
          e.preventDefault();
          setData((prevData) => ({
            ...prevData,
            products: prevData?.products?.filter((item) => item !== productId) ?? [],
          }));
        }}
        className="hover:bg-white/20 rounded-full p-1 transition-all duration-200"
      >
        <X size={14} />
      </button>
    </div>
  );
}