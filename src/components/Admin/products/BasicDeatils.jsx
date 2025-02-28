"use client";

import { useBrands } from "@/lib/firestore/brands/read";
import { useCategories } from "@/lib/firestore/categories/read";
import { motion } from "framer-motion";

export default function BasicDetails({ data, handleData }) {
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();

  const inputClasses = "border border-purple-500 dark:border-[#22c7d5] px-4 py-2 rounded-lg w-full outline-none bg-white dark:bg-[#1e2737] text-black dark:text-white transition-all duration-200 ease-in-out focus:shadow-md focus:border-[#22c7d5] dark:focus:border-[#1aa5b5]";
  const labelClasses = "text-gray-500 dark:text-[#888ea8] text-sm transition-all duration-200";

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col gap-4 bg-white dark:bg-[#0e1726] rounded-xl p-6 border border-purple-500 dark:border-[#22c7d5] shadow-lg transition-all duration-200 ease-in-out"
    >
      <h1 className="font-semibold text-[#212529] dark:text-white text-xl">Basic Details</h1>

      <div className="grid gap-6">
        <motion.div 
          className="flex flex-col gap-2"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <label className={labelClasses} htmlFor="product-title">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Title"
            id="product-title"
            value={data?.title ?? ""}
            onChange={(e) => handleData("title", e.target.value)}
            className={inputClasses}
            required
          />
        </motion.div>

        <motion.div 
          className="flex flex-col gap-2"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <label className={labelClasses} htmlFor="product-short-description">
            Short Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Short Description"
            id="product-short-description"
            value={data?.shortDescription ?? ""}
            onChange={(e) => handleData("shortDescription", e.target.value)}
            className={inputClasses}
            required
          />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            className="flex flex-col gap-2"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <label className={labelClasses} htmlFor="product-brand">
              Brand <span className="text-red-500">*</span>
            </label>
            <select
              id="product-brand"
              value={data?.brandId ?? ""}
              onChange={(e) => handleData("brandId", e.target.value)}
              className={inputClasses}
              required
            >
              <option value="">Select Brand</option>
              {brands?.map((item) => (
                <option value={item?.id} key={item?.id}>
                  {item?.name}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div 
            className="flex flex-col gap-2"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <label className={labelClasses} htmlFor="product-category">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="product-category"
              value={data?.categoryId ?? ""}
              onChange={(e) => handleData("categoryId", e.target.value)}
              className={inputClasses}
              required
            >
              <option value="">Select Category</option>
              {categories?.map((item) => (
                <option value={item?.id} key={item?.id}>
                  {item?.name}
                </option>
              ))}
            </select>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div 
            className="flex flex-col gap-2"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <label className={labelClasses} htmlFor="product-stock">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter Stock"
              id="product-stock"
              value={data?.stock ?? ""}
              onChange={(e) => handleData("stock", e.target.valueAsNumber)}
              className={inputClasses}
              required
            />
          </motion.div>

          <motion.div 
            className="flex flex-col gap-2"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <label className={labelClasses} htmlFor="product-price">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter Price"
              id="product-price"
              value={data?.price ?? ""}
              onChange={(e) => handleData("price", e.target.valueAsNumber)}
              className={inputClasses}
              required
            />
          </motion.div>

          <motion.div 
            className="flex flex-col gap-2"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <label className={labelClasses} htmlFor="product-sale-price">
              Sale Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter Sale Price"
              id="product-sale-price"
              value={data?.salePrice ?? ""}
              onChange={(e) => handleData("salePrice", e.target.valueAsNumber)}
              className={inputClasses}
              required
            />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
        <motion.div 
          className="flex flex-col gap-2"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <label className={labelClasses} htmlFor="product-is-featured">
            Is Featured Product <span className="text-red-500">*</span>
          </label>
          <select
            id="product-is-featured"
            value={data?.isFeatured ? "yes" : "no"}
            onChange={(e) => handleData("isFeatured", e.target.value === "yes")}
            className={inputClasses}
            required
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </motion.div>

        <motion.div 
          className="flex flex-col gap-2"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <label className={labelClasses} htmlFor="product-is-featured">
            Is New Arrival Product <span className="text-red-500">*</span>
          </label>
          <select
            id="product-is-newArrival"
            value={data?.isNewArrival ? "yes" : "no"}
            onChange={(e) => handleData("isNewArrival", e.target.value === "yes")}
            className={inputClasses}
            required
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
  <motion.div 
    className="flex flex-col gap-2"
    whileHover={{ scale: 1.01 }}
    transition={{ duration: 0.2 }}
  >
    <label className={labelClasses} htmlFor="product-color">
      Color <span className="text-red-500">*</span>
    </label>
    <select
      id="product-color"
      value={data?.color || ""}
      onChange={(e) => handleData("color", e.target.value)}
      className={inputClasses}
      
    >
      <option value="">Select Color</option>
      <option value="gold">Gold</option>
      <option value="silver">Silver</option>
      <option value="rose-gold">Rose Gold</option>
      <option value="white">White</option>
      <option value="pink">Pink</option>
      <option value="purple">Purple</option>
      <option value="red">Red</option>
      <option value="green">Green</option>
      <option value="blue">Blue</option>
      <option value="black">Black</option>
      <option value="multi">Multi-color</option>
    </select>
  </motion.div>

  <motion.div 
    className="flex flex-col gap-2"
    whileHover={{ scale: 1.01 }}
    transition={{ duration: 0.2 }}
  >
    <label className={labelClasses} htmlFor="product-occasion">
      Occasion <span className="text-red-500">*</span>
    </label>
    <select
      id="product-occasion"
      value={data?.occasion || ""}
      onChange={(e) => handleData("occasion", e.target.value)}
      className={inputClasses}
    >
      <option value="">Select Occasion</option>
      <option value="daily-wear">Daily Wear</option>
      <option value="casual-wear">Casual Wear</option>
      <option value="formal-wear">Formal Wear</option>
      <option value="office-wear">Office Wear</option>
      <option value="party-wear">Party Wear</option>
      <option value="wedding">Wedding</option>
      <option value="festive">Festive</option>
      <option value="gift">Gift</option>
    </select>
  </motion.div>
</div>
      </div>
    </motion.section>
  );
}