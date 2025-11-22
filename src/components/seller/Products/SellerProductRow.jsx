// components/seller/products/ProductRow.jsx
'use client'

import { Edit2, Trash2, Eye, Star } from 'lucide-react'
import { useCategoryNames } from '@/hooks/useCategoryNames'
import { useState, useRef, useEffect } from 'react'

export default function ProductRow({ product, index, onEdit, onDelete, onView }) {
  const { getCategoryName } = useCategoryNames()
  
  // Lazy loading states
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const imageRef = useRef(null)
  const observerRef = useRef(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!product?.featureImageURL || !imageRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Image is in viewport, start loading
            const img = new Image();
            img.src = product.featureImageURL;
            img.onload = () => setImageLoaded(true);
            img.onerror = () => setImageError(true);
            
            // Stop observing once we've started loading
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.1 
      }
    );

    observer.observe(imageRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [product?.featureImageURL]);

  const cellBase = "px-4 py-4 border-r"
  const cellBorder = "border-emerald-300/40 dark:border-emerald-600/40"
  const cellStyle = `${cellBase} ${cellBorder}`
  
  const textPrimary = "text-slate-900 dark:text-gray-100"
  const textSecondary = "text-slate-700 dark:text-gray-200"
  const textAccent = "text-emerald-600 dark:text-emerald-400"

  const getStockColor = (stock) => {
    if (stock === 0) return 'text-red-600 dark:text-red-400'
    if (stock < 10) return 'text-orange-600 dark:text-orange-400'
    return 'text-green-600 dark:text-green-400'
  }

  return (
    <tr className={`border-b transition-all duration-200 hover:shadow-lg ${
      "border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-slate-700/50"
    } ${
      index % 2 === 0
        ? "bg-slate-100/60 dark:bg-slate-800/30"
        : "bg-white dark:bg-slate-800/10"
    }`}>
      
      {/* SR No */}
      <td className={cellStyle}>
        <span className={`font-medium ${textPrimary}`}>
          {index + 1}
        </span>
      </td>

      {/* Product Image with Lazy Loading */}
      <td className={cellStyle}>
        <div className="flex justify-center">
          <div 
            ref={imageRef}
            className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-600 shadow-sm relative"
          >
            {/* Loading Skeleton */}
            {!imageLoaded && !imageError && (
              <div className="w-full h-full bg-slate-300 dark:bg-slate-500 animate-pulse" />
            )}
            
            {/* Error State */}
            {imageError && (
              <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-600">
                <Package size={20} className="text-slate-400" />
              </div>
            )}
            
            {/* Actual Image */}
            {imageLoaded && !imageError && (
              <img
                src={product.featureImageURL}
                alt={product.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={() => setImageError(true)}
              />
            )}
          </div>
        </div>
      </td>

      {/* Rest of the cells remain exactly the same */}
      {/* Product Name */}
      <td className={cellStyle}>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className={`text-sm font-medium ${textPrimary} truncate`}>
              {product.title}
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {product.isFeatured && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400">
                <Star size={10} className="mr-1" />
                Featured
              </span>
            )}
            {product.isNewArrival && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                New
              </span>
            )}
          </div>
        </div>
      </td>

      {/* SKU */}
      <td className={cellStyle}>
        <code className={`text-xs font-mono ${textSecondary} bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded`}>
          {product.sku}
        </code>
      </td>

      {/* Seller SKU */}
      <td className={cellStyle}>
        <code className={`text-xs font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 px-2 py-1 rounded border border-cyan-200 dark:border-cyan-700`}>
          {product.sellerSku}
        </code>
      </td>

      {/* Category */}
      <td className={cellStyle}>
        <span className={`text-sm font-medium capitalize ${textSecondary}`}>
          {getCategoryName(product.category)}
        </span>
      </td>

      {/* Price (Combined Regular + Sale) */}
      <td className={cellStyle}>
        <div className="flex flex-col gap-1">
          <span className={`text-xs font-medium line-through ${textSecondary} opacity-70`}>
            ₹{product.price}
          </span>
          <span className={`text-sm font-bold ${textAccent}`}>
            ₹{product.salePrice}
          </span>
        </div>
      </td>

      {/* Stock */}
      <td className={cellStyle}>
        <span className={`text-sm font-medium ${getStockColor(product.stock)}`}>
          {product.stock} units
        </span>
        {product.variations && product.variations.length > 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {product.variations.length} variants
          </p>
        )}
      </td>

      {/* Orders */}
      <td className={cellStyle}>
        <span className={`text-sm font-bold ${textPrimary}`}>
          {product.orders || 0}
        </span>
      </td>

      {/* Status */}
      <td className={cellStyle}>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
          product.stock > 0 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {product.stock > 0 ? 'active' : 'out of stock'}
        </span>
      </td>

      {/* Actions */}
      <td className={cellBase}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(product.id)}
            className="p-2 text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 rounded-lg transition-colors duration-200 border border-purple-700 dark:border-purple-600 shadow-sm"
            title="View Product"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(product.id)}
            className="p-2 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-lg transition-colors duration-200 border border-blue-700 dark:border-blue-600 shadow-sm"
            title="Edit Product"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 rounded-lg transition-colors duration-200 border border-red-700 dark:border-red-600 shadow-sm"
            title="Delete Product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}