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
  const [bannerImage, setBannerImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
const [bannerImagePreview, setBannerImagePreview] = useState(null);



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
        if (res.imageURL) {
          setImagePreview(res.imageURL);
        }
        
        if (res.bannerImageURL) {
          setBannerImagePreview(res.bannerImageURL);
        }
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
      await createNewCollection({ data: data, image: image, bannerImage: bannerImage });
      toast.success("Successfully Created");
      setData(null);
      setImage(null);
      setBannerImage(null);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      // If no new images were selected, we still have the old URLs in the data object
      await updateCollection({ 
        data: data, 
        image: image, 
        bannerImage: bannerImage 
      });
      toast.success("Successfully Updated");
      setData(null);
      setImage(null);
      setBannerImage(null);
      setImagePreview(null);
      setBannerImagePreview(null);
      router.push(`/admin/collections`);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };
  
  return (
    <div className="flex border border-purple-500 dark:border-[#22c7d5] py-4 flex-col gap-6 bg-white dark:bg-[#0e1726] dark:text-[#888ea8] rounded-xl p-5 w-full  transition-all duration-200 ease-in-out">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Upload */}
<div className="flex flex-col gap-2">
  <label htmlFor="collection-image" className="text-gray-500 dark:text-[#888ea8] text-sm">
    Image <span className="text-red-500">*</span>
  </label>
  <div 
    className="flex justify-center items-center border-2 border-dashed border-purple-500 dark:border-[#22c7d5] p-6 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1e2737] transition-all"
    onClick={() => document.getElementById('collection-image').click()}
  >
    {image ? (
      <div className="flex flex-col items-center gap-2">
        <img className="h-24 w-auto rounded-lg shadow-md" src={URL.createObjectURL(image)} alt="Preview" />
        <span className="text-sm text-gray-500 dark:text-gray-400">Click to change image</span>
      </div>
    ) : imagePreview ? (
      <div className="flex flex-col items-center gap-2">
        <img className="h-24 w-auto rounded-lg shadow-md" src={imagePreview} alt="Preview" />
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
    onChange={(e) => {
      if (e.target.files[0]) {
        setImage(e.target.files[0]);
        setImagePreview(null); // Clear the URL preview when a new file is selected
      }
    }}
    className="hidden"
    accept="image/*"
  />
</div>

{/* Banner Image Upload */}
<div className="flex flex-col gap-2">
  <label htmlFor="collection-banner-image" className="text-gray-500 dark:text-[#888ea8] text-sm">
    Banner Image <span className="text-red-500">*</span>
  </label>
  <div 
    className="flex justify-center items-center border-2 border-dashed border-purple-500 dark:border-[#22c7d5] p-6 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1e2737] transition-all"
    onClick={() => document.getElementById('collection-banner-image').click()}
  >
    {bannerImage ? (
      <div className="flex flex-col items-center gap-2">
        <img className="h-24 w-auto rounded-lg shadow-md" src={URL.createObjectURL(bannerImage)} alt="Banner Preview" />
        <span className="text-sm text-gray-500 dark:text-gray-400">Click to change banner image</span>
      </div>
    ) : bannerImagePreview ? (
      <div className="flex flex-col items-center gap-2">
        <img className="h-24 w-auto rounded-lg shadow-md" src={bannerImagePreview} alt="Banner Preview" />
        <span className="text-sm text-gray-500 dark:text-gray-400">Click to change banner image</span>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-2">
        <Upload size={24} className="text-gray-400" />
        <span className="text-sm text-gray-500 dark:text-gray-400">Upload Collection Banner Image</span>
      </div>
    )}
  </div>
  <input
    id="collection-banner-image"
    name="collection-banner-image"
    type="file"
    onChange={(e) => {
      if (e.target.files[0]) {
        setBannerImage(e.target.files[0]);
        setBannerImagePreview(null); // Clear the URL preview when a new file is selected
      }
    }}
    className="hidden"
    accept="image/*"
  />
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        {/* Color Code Input */}
<div className="flex flex-col gap-2">
  <label htmlFor="collection-color" className="text-gray-500 dark:text-[#888ea8] text-sm">
    Bg Color Code <span className="text-red-500">*</span>
  </label>
  <input
    id="collection-bgcolor"
    name="collection-bgcolor"
    type="text"
    placeholder="Enter Color Code (e.g., #ff5733)"
    value={data?.color ?? ""}
    onChange={(e) => handleData("color", e.target.value)}
    className="border border-[#22c7d5] dark:border-[#22c7d5] px-4 py-2 rounded-lg w-full focus:outline-none bg-white dark:bg-[#1e2737] text-black dark:text-white transition-all duration-200 ease-in-out"
  />
</div>


{/* Label Color Code Input */}
<div className="flex flex-col gap-2">
  <label htmlFor="collection-label-color" className="text-gray-500 dark:text-[#888ea8] text-sm">
    Label Color Code <span className="text-red-500">*</span>
  </label>
  <input
    id="collection-label-color"
    name="collection-label-color"
    type="text"
    placeholder="Enter Label Color Code (e.g., #ff5733)"
    value={data?.labelColor ?? ""}
    onChange={(e) => handleData("labelColor", e.target.value)}
    className="border border-[#22c7d5] dark:border-[#22c7d5] px-4 py-2 rounded-lg w-full focus:outline-none bg-white dark:bg-[#1e2737] text-black dark:text-white transition-all duration-200 ease-in-out"
  />
</div>

{/* Starting Price Color Code Input */}
<div className="flex flex-col gap-2">
  <label htmlFor="collection-price-color" className="text-gray-500 dark:text-[#888ea8] text-sm">
    Starting Price Color Code <span className="text-red-500">*</span>
  </label>
  <input
    id="collection-price-color"
    name="collection-price-color"
    type="text"
    placeholder="Enter Starting Price Color Code (e.g., #ff5733)"
    value={data?.priceColor ?? ""}
    onChange={(e) => handleData("priceColor", e.target.value)}
    className="border border-[#22c7d5] dark:border-[#22c7d5] px-4 py-2 rounded-lg w-full focus:outline-none bg-white dark:bg-[#1e2737] text-black dark:text-white transition-all duration-200 ease-in-out"
  />
</div>

{/* Is Showcased Dropdown */}
<div className="flex flex-col gap-2">
  <label htmlFor="collection-showcased" className="text-gray-500 dark:text-[#888ea8] text-sm">
    Is Showcased? <span className="text-red-500">*</span>
  </label>
  <select
    id="collection-showcased"
    name="collection-showcased"
    value={data?.isShowcased ?? ""}
    onChange={(e) => handleData("isShowcased", e.target.value)}
    className="border border-[#22c7d5] dark:border-[#22c7d5] px-4 py-2 rounded-lg w-full focus:outline-none bg-white dark:bg-[#1e2737] text-black dark:text-white transition-all duration-200 ease-in-out"
  >
    <option value="">Select</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </select>
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

        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          type="submit"
          className="bg-[#22c7d5] max-w-[200px] text-white font-semibold py-2 mt-4 px-4 rounded-lg hover:bg-[#1aa5b5] transition-all duration-200 ease-in-out"
        >
          {id ? "Update" : "Create"}
        </Button>
        </div>
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