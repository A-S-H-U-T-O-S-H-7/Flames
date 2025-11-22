// components/sellers/products/ProductViewModal.jsx
'use client'

import { useEffect, useState } from 'react'
import { X, Package, Edit2, Star, ShoppingBag, Tag, Layers, DollarSign, TrendingDown, Box } from 'lucide-react'
import { useProduct } from '@/lib/firestore/products/read'
import { useCategoryNames } from '@/hooks/useCategoryNames'
import { useBrandNames } from '@/hooks/useBrandNames'

export default function ProductViewModal({ productId, isOpen, onClose, onEdit }) {
  const [isVisible, setIsVisible] = useState(false)
  const { data: product, isLoading } = useProduct({ productId })
  const { getCategoryName } = useCategoryNames()
    const { getBrandName } = useBrandNames()

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setTimeout(() => setIsVisible(false), 300)
    }
  }, [isOpen])

  if (!isVisible && !isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950' }
    if (stock < 10) return { label: 'Low Stock', color: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950' }
    return { label: 'In Stock', color: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950' }
  }

  const getStockColor = (stock) => {
    if (stock === 0) return 'text-red-600 dark:text-red-400'
    if (stock < 10) return 'text-orange-600 dark:text-orange-400'
    return 'text-green-600 dark:text-green-400'
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-5xl max-h-[90vh] overflow-hidden transform transition-transform duration-300 ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg shadow-md">
              <Package className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Product Details
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                View product information
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(productId)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Edit2 size={16} />
              Edit
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-88px)]">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
          ) : !product ? (
            <div className="text-center p-8">
              <Package className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Product Not Found
              </h3>
            </div>
          ) : (
            <div className="p-6 space-y-5">
              {/* Product Header with Image */}
              <div className="flex items-start gap-5 pb-5 border-b border-slate-200 dark:border-slate-700">
                <img
                  src={product.featureImageURL || '/api/placeholder/200/200'}
                  alt={product.title}
                  className="w-28 h-28 rounded-xl object-cover bg-slate-200 dark:bg-slate-600 shadow-lg border-2 border-slate-200 dark:border-slate-700"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white pr-4">
                      {product.title}
                    </h1>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {product.isFeatured && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-sm">
                          <Star size={10} className="mr-1" fill="white" />
                          Featured
                        </span>
                      )}
                      {product.isNewArrival && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white shadow-sm">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                  {product.shortDescription && (
                    <p className="text-slate-600 dark:text-slate-400 mb-3 text-sm leading-relaxed">
                      {product.shortDescription}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg">
                      <Tag size={14} className="text-slate-500 dark:text-slate-400" />
                      <span className="text-slate-700 dark:text-slate-300">
                        SKU: <code className="font-mono font-semibold">{product.sku}</code>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg">
                      <ShoppingBag size={14} className="text-slate-500 dark:text-slate-400" />
                      <span className="text-slate-700 dark:text-slate-300">
                        Seller: <code className="font-mono font-semibold">{product.sellerSku}</code>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category, Brand, Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                      <Tag className="text-white" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mb-0.5 font-medium">Category</p>
                      <p className="text-sm font-bold text-blue-900 dark:text-white capitalize">
                        {getCategoryName(product.category)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                      <Box className="text-white" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-purple-700 dark:text-purple-300 mb-0.5 font-medium">Brand</p>
                      <p className="text-sm font-bold text-purple-900 dark:text-white">
                        {getBrandName(product.brandId)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-500 dark:bg-slate-600 rounded-lg shadow-sm">
                      <Layers className="text-white" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-0.5 font-medium">Status</p>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStockStatus(product.stock).color}`}>
                        {getStockStatus(product.stock).label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory - Compact Grid */}
              <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <DollarSign size={20} className="text-teal-500" />
                  Pricing & Inventory
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">Regular Price</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">₹{product.price}</p>
                  </div>

                  <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg p-3.5 shadow-md">
                    <p className="text-xs text-teal-50 mb-1.5 flex items-center gap-1 font-medium">
                      <TrendingDown size={12} />
                      Sale Price
                    </p>
                    <p className="text-lg font-bold text-white">₹{product.salePrice || product.price}</p>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">Discount</p>
                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0}%
                    </p>
                  </div>

                  <div className={`rounded-lg p-3.5 shadow-sm ${
                    product.stock === 0 
                      ? 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border border-red-200 dark:border-red-800' 
                      : product.stock < 10 
                        ? 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border border-orange-200 dark:border-orange-800'
                        : 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800'
                  }`}>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mb-1.5 font-medium">Stock</p>
                    <p className={`text-lg font-bold ${getStockColor(product.stock)}`}>
                      {product.stock}
                      <span className="text-xs font-normal ml-1">units</span>
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">Orders</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {product.orders || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Variations */}
              {product.variations && product.variations.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Layers size={18} className="text-purple-500" />
                    Variations ({product.variations.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.variations.map((variation, index) => (
                      <div key={index} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3.5 border border-slate-200 dark:border-slate-600 hover:border-teal-300 dark:hover:border-teal-600 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {variation.name}
                          </span>
                          <span className={`text-sm font-medium ${getStockColor(variation.stock)}`}>
                            {variation.stock} in stock
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-teal-600 dark:text-teal-400">₹{variation.price}</span>
                          <code className="font-mono text-xs bg-slate-200 dark:bg-slate-600 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                            {variation.sku}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                    Product Description
                  </h3>
                  <div 
                    className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4 border border-slate-200 dark:border-slate-600"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}

              {/* Gallery Images */}
              {product.imageList && product.imageList.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                    Gallery Images ({product.imageList.length})
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {product.imageList.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg bg-slate-200 dark:bg-slate-600 shadow-sm border-2 border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all cursor-pointer hover:scale-105"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}