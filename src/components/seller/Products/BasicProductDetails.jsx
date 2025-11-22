// components/seller/products/BasicProductDetails.jsx - UPDATED
'use client'

import { useBrands } from '@/lib/firestore/brands/read'
import { useCategories } from '@/lib/firestore/categories/read'

export default function BasicProductDetails({ formData, onInputChange, onCategoryChange }) {
  const { data: brands } = useBrands()
  const { data: categories } = useCategories()

  const inputClasses = "w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
  const labelClasses = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <label htmlFor="title" className={labelClasses}>
          Product Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder="Enter product title"
          className={inputClasses}
          required
        />
      </div>

      {/* Short Description */}
      <div>
        <label htmlFor="shortDescription" className={labelClasses}>
          Short Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="shortDescription"
          value={formData.shortDescription}
          onChange={(e) => onInputChange('shortDescription', e.target.value)}
          placeholder="Brief description that appears in product listings"
          rows={2}
          className={inputClasses}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label htmlFor="category" className={labelClasses}>
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={inputClasses}
            required
          >
            <option value="">Select Category</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label htmlFor="brandId" className={labelClasses}>
            Brand <span className="text-red-500">*</span>
          </label>
          <select
            id="brandId"
            value={formData.brandId}
            onChange={(e) => onInputChange('brandId', e.target.value)}
            className={inputClasses}
            required
          >
            <option value="">Select Brand</option>
            {brands?.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Price */}
        <div>
          <label htmlFor="price" className={labelClasses}>
            Regular Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) => onInputChange('price', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className={inputClasses}
            required
          />
        </div>

        {/* Sale Price */}
        <div>
          <label htmlFor="salePrice" className={labelClasses}>
            Sale Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="salePrice"
            value={formData.salePrice}
            onChange={(e) => onInputChange('salePrice', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className={inputClasses}
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label htmlFor="stock" className={labelClasses}>
            Total Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="stock"
            value={formData.stock}
            onChange={(e) => onInputChange('stock', parseInt(e.target.value) || 0)}
            placeholder="0"
            min="0"
            className={inputClasses}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SKU */}
        <div>
          <label htmlFor="sku" className={labelClasses}>
            Product SKU <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="sku"
            value={formData.sku}
            onChange={(e) => onInputChange('sku', e.target.value)}
            placeholder="PRODUCT-SKU-001"
            className={inputClasses}
            required
          />
        </div>

        {/* Features */}
        <div className="flex items-center gap-6 pt-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => onInputChange('isFeatured', e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                formData.isFeatured 
                  ? 'bg-teal-500 border-teal-500' 
                  : 'bg-white border-slate-400 group-hover:border-teal-500'
              }`}>
                {formData.isFeatured && (
                  <svg className="w-3 h-3 text-white mx-auto mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-teal-600 transition-colors">
              Featured
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.isNewArrival}
                onChange={(e) => onInputChange('isNewArrival', e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                formData.isNewArrival 
                  ? 'bg-teal-500 border-teal-500' 
                  : 'bg-white border-slate-400 group-hover:border-teal-500'
              }`}>
                {formData.isNewArrival && (
                  <svg className="w-3 h-3 text-white mx-auto mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-teal-600 transition-colors">
              New Arrival
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}