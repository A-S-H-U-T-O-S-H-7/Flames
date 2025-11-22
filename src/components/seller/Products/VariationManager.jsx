// components/seller/products/VariationManager.jsx - UPDATED (Compact)
'use client'

import { useState, useMemo } from 'react'
import { Plus, Trash2, Copy, Package, AlertCircle } from 'lucide-react'
import { getCategoryTemplate, generateVariations, calculateTotalStock } from '@/utils/productVariations'

export default function VariationManager({ formData, onFormDataChange }) {
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  
  const categoryTemplate = useMemo(() => 
    getCategoryTemplate(formData.category), 
    [formData.category]
  )

  // Initialize selected sizes and colors when category changes
  useMemo(() => {
    if (categoryTemplate) {
      setSelectedSizes([])
      setSelectedColors([])
    }
  }, [categoryTemplate])

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  const handleColorToggle = (color) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    )
  }

  const handleGenerateVariations = () => {
    if (selectedSizes.length === 0 || selectedColors.length === 0) {
      alert('Please select at least one size and one color')
      return
    }

    const newVariations = generateVariations(
      selectedSizes,
      selectedColors,
      formData.price,
      formData.salePrice
    )

    onFormDataChange({
      ...formData,
      variations: newVariations
    })
  }

  const handleVariationChange = (variationId, field, value) => {
    const updatedVariations = formData.variations.map(variation =>
      variation.id === variationId
        ? { ...variation, [field]: value }
        : variation
    )

    onFormDataChange({
      ...formData,
      variations: updatedVariations
    })
  }

  const handleDeleteVariation = (variationId) => {
    const updatedVariations = formData.variations.filter(
      variation => variation.id !== variationId
    )

    onFormDataChange({
      ...formData,
      variations: updatedVariations
    })
  }

  const handleBulkUpdate = (field, value) => {
    const updatedVariations = formData.variations.map(variation => ({
      ...variation,
      [field]: value
    }))

    onFormDataChange({
      ...formData,
      variations: updatedVariations
    })
  }

  const handleDuplicateVariation = (variation) => {
    const newVariation = {
      ...variation,
      id: `${variation.size}-${variation.color}-${Date.now()}`,
      sku: `${variation.sku}-copy`
    }

    onFormDataChange({
      ...formData,
      variations: [...formData.variations, newVariation]
    })
  }

  const totalStock = calculateTotalStock(formData.variations)

  if (!categoryTemplate) {
    return (
      <div className="text-center text-slate-500 dark:text-slate-400 py-8">
        <Package size={32} className="mx-auto mb-3 opacity-50" />
        <p className="text-sm">Select a category to manage variations</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Variation Generator */}
      {formData.variations.length === 0 && (
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700/50">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">
            Create Variations
          </h3>
          
          {/* Sizes Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Sizes <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categoryTemplate.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    selectedSizes.includes(size)
                      ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg scale-105'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:scale-105'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Colors <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categoryTemplate.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorToggle(color)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 capitalize ${
                    selectedColors.includes(color)
                      ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg scale-105'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:scale-105'
                  }`}
                >
                  {color.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateVariations}
            disabled={selectedSizes.length === 0 || selectedColors.length === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
          >
            <Plus size={16} />
            Generate {selectedSizes.length * selectedColors.length} Variations
          </button>
        </div>
      )}

      {/* Variations List */}
      {formData.variations.length > 0 && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {formData.variations.length} variants
            </span>
            <span className={`text-sm font-semibold ${
              totalStock === 0 
                ? 'text-red-600 dark:text-red-400' 
                : totalStock < 10 
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-green-600 dark:text-green-400'
            }`}>
              {totalStock} units total
            </span>
          </div>

          {/* Variations Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                    Size
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                    Color
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                    Price
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                    Stock
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {formData.variations.map((variation) => (
                  <VariationRow
                    key={variation.id}
                    variation={variation}
                    onChange={handleVariationChange}
                    onDelete={handleDeleteVariation}
                    onDuplicate={handleDuplicateVariation}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// Variation Row Component - Compact
function VariationRow({ variation, onChange, onDelete, onDuplicate }) {
  const getStockColor = (stock) => {
    if (stock === 0) return 'text-red-600 dark:text-red-400'
    if (stock < 10) return 'text-orange-600 dark:text-orange-400'
    return 'text-green-600 dark:text-green-400'
  }

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
      {/* Size */}
      <td className="px-3 py-2">
        <input
          type="text"
          value={variation.size}
          onChange={(e) => onChange(variation.id, 'size', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Size"
        />
      </td>

      {/* Color */}
      <td className="px-3 py-2">
        <input
          type="text"
          value={variation.color}
          onChange={(e) => onChange(variation.id, 'color', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Color"
        />
      </td>

      {/* Price */}
      <td className="px-3 py-2">
        <div className="flex gap-1">
          <input
            type="number"
            value={variation.price}
            onChange={(e) => onChange(variation.id, 'price', parseFloat(e.target.value) || 0)}
            className="w-16 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            min="0"
            step="0.01"
          />
          <input
            type="number"
            value={variation.salePrice}
            onChange={(e) => onChange(variation.id, 'salePrice', parseFloat(e.target.value) || 0)}
            className="w-16 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            min="0"
            step="0.01"
          />
        </div>
      </td>

      {/* Stock */}
      <td className="px-3 py-2">
        <input
          type="number"
          value={variation.stock}
          onChange={(e) => onChange(variation.id, 'stock', parseInt(e.target.value) || 0)}
          className={`w-16 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${getStockColor(variation.stock)}`}
          min="0"
        />
      </td>

      {/* Actions */}
      <td className="px-3 py-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onDuplicate(variation)}
            className="p-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover:scale-110"
            title="Duplicate"
          >
            <Copy size={12} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(variation.id)}
            className="p-1 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 hover:scale-110"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </td>
    </tr>
  )
}