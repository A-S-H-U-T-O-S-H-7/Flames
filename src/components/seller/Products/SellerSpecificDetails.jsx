// components/seller/products/SellerSpecificDetails.jsx - UPDATED
'use client'

export default function SellerSpecificDetails({ formData, onInputChange, onNestedChange }) {
  const inputClasses = "w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
  const labelClasses = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"

  return (
    <div className="space-y-6">
      {/* Seller SKU */}
      <div>
        <label htmlFor="sellerSku" className={labelClasses}>
          Seller SKU
        </label>
        <input
          type="text"
          id="sellerSku"
          value={formData.sellerSku}
          onChange={(e) => onInputChange('sellerSku', e.target.value)}
          placeholder="Your internal SKU"
          className={inputClasses}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Handling Time */}
        <div>
          <label htmlFor="handlingTime" className={labelClasses}>
            Handling Time (Days)
          </label>
          <input
            type="number"
            id="handlingTime"
            value={formData.handlingTime}
            onChange={(e) => onInputChange('handlingTime', parseInt(e.target.value) || 1)}
            min="1"
            max="30"
            className={inputClasses}
          />
        </div>

        {/* Shipping Profile */}
        <div>
          <label htmlFor="shippingProfile" className={labelClasses}>
            Shipping Profile
          </label>
          <select
            id="shippingProfile"
            value={formData.shippingProfile}
            onChange={(e) => onInputChange('shippingProfile', e.target.value)}
            className={inputClasses}
          >
            <option value="standard">Standard Shipping</option>
            <option value="express">Express Shipping</option>
            <option value="free">Free Shipping</option>
            <option value="custom">Custom Profile</option>
          </select>
        </div>
      </div>

      {/* Return Policy */}
      <div>
        <label htmlFor="returnPolicy" className={labelClasses}>
          Return Policy
        </label>
        <select
          id="returnPolicy"
          value={formData.returnPolicy}
          onChange={(e) => onInputChange('returnPolicy', e.target.value)}
          className={inputClasses}
        >
          <option value="seller">Seller Policy</option>
          <option value="platform">Platform Policy</option>
          <option value="no-returns">No Returns</option>
        </select>
      </div>

      {/* Warranty */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50">
        <label className="flex items-center gap-3 mb-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={formData.warranty.hasWarranty}
              onChange={(e) => onNestedChange('warranty', 'hasWarranty', e.target.checked)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
              formData.warranty.hasWarranty 
                ? 'bg-blue-500 border-blue-500' 
                : 'bg-white border-slate-400 group-hover:border-blue-500'
            }`}>
              {formData.warranty.hasWarranty && (
                <svg className="w-3 h-3 text-white mx-auto mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">
            Includes Warranty
          </span>
        </label>

        {formData.warranty.hasWarranty && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                Duration (Months)
              </label>
              <input
                type="number"
                value={formData.warranty.duration}
                onChange={(e) => onNestedChange('warranty', 'duration', parseInt(e.target.value) || 0)}
                min="1"
                max="60"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                Warranty Type
              </label>
              <select
                value={formData.warranty.type}
                onChange={(e) => onNestedChange('warranty', 'type', e.target.value)}
                className={inputClasses}
              >
                <option value="seller">Seller Warranty</option>
                <option value="manufacturer">Manufacturer Warranty</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}