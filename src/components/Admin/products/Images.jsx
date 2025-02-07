"use client";

import { Upload } from "lucide-react";

export default function Images({
  data,
  setFeatureImage,
  featureImage,
  imageList,
  setImageList,
}) {
  return (
    <section className="flex flex-col gap-3 bg-white dark:bg-[#0e1726] border border-purple-500 dark:border-[#22c7d5] p-4 rounded-xl transition-all duration-200">
      <h1 className="font-semibold text-[#212529] dark:text-white">Images</h1>
      
      {/* Feature Image */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-500 dark:text-[#888ea8] text-sm" htmlFor="product-feature-image">
          Feature Image <span className="text-red-500">*</span>
        </label>
        
        <div 
          className="border-2 border-dashed border-purple-500 dark:border-[#22c7d5] rounded-lg p-4 cursor-pointer hover:border-[#22c7d5] dark:hover:border-[#1aa5b5] transition-colors duration-200"
          onClick={() => document.getElementById('product-feature-image').click()}
        >
          {(data?.featureImageURL || featureImage) ? (
            <div className="flex flex-col items-center gap-2">
              <img
                className="h-20 w-auto object-cover rounded-lg shadow-md"
                src={featureImage ? URL.createObjectURL(featureImage) : data?.featureImageURL}
                alt="Feature"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">Click to change image</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Upload Feature Image</span>
            </div>
          )}
        </div>
        
        <input
          type="file"
          id="product-feature-image"
          className="hidden"
          onChange={(e) => {
            if (e.target.files.length > 0) {
              setFeatureImage(e.target.files[0]);
            }
          }}
          accept="image/*"
        />
      </div>

      {/* Product Images */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-500 dark:text-[#888ea8] text-sm" htmlFor="product-images">
          Product Images <span className="text-red-500">*</span>
        </label>
        
        <div 
          className="border-2 border-dashed border-purple-500 dark:border-[#22c7d5] rounded-lg p-4 cursor-pointer hover:border-[#22c7d5] dark:hover:border-[#1aa5b5] transition-colors duration-200"
          onClick={() => document.getElementById('product-images').click()}
        >
          {/* Image Preview Grid */}
          {(imageList?.length > 0 || data?.imageList?.length > 0) && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-3">
              {imageList?.length > 0 
                ? imageList.map((item, index) => (
                    <div key={index} className="relative group">
                      <img
                        className="w-full h-16 object-cover rounded-lg shadow-sm"
                        src={URL.createObjectURL(item)}
                        alt={`Product ${index + 1}`}
                      />
                    </div>
                  ))
                : data?.imageList?.map((item, index) => (
                    <div key={index} className="relative group">
                      <img
                        className="w-full h-16 object-cover rounded-lg shadow-sm"
                        src={item}
                        alt={`Product ${index + 1}`}
                      />
                    </div>
                  ))
              }
            </div>
          )}
          
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {imageList?.length > 0 || data?.imageList?.length > 0
                ? "Click to add more images"
                : "Upload Product Images"}
            </span>
            <span className="text-xs text-gray-400">
              You can select multiple images
            </span>
          </div>
        </div>

        <input
          type="file"
          id="product-images"
          className="hidden"
          multiple
          onChange={(e) => {
            const newFiles = Array.from(e.target.files);
            setImageList(newFiles);
          }}
          accept="image/*"
        />
      </div>
    </section>
  );
}