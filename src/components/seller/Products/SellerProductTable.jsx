// components/seller/products/ProductTable.jsx
'use client'

import { Package } from 'lucide-react'
import ProductRow from './SellerProductRow'

export default function ProductTable({ products, loading, onEdit, onDelete, onView }) {
  const tableHeaders = [
    { label: "SR. No", width: "60px" },
    { label: "Product Image", width: "60px" },
    { label: "Product Name", width: "220px" },
    { label: "SKU", width: "130px" },
    { label: "Seller SKU", width: "100px" },
    { label: "Category", width: "120px" },
    { label: "Price", width: "90px" },
    { label: "Stock", width: "100px" },
    { label: "Orders", width: "100px" },
    { label: "Status", width: "50px" },
    { label: "Actions", width: "160px" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max" style={{ minWidth: "1400px" }}>
        <thead className="border-b-2 bg-gradient-to-r from-emerald-100 via-teal-100 to-emerald-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 border-emerald-400 dark:border-emerald-500/60 shadow-sm">
          <tr>
            {tableHeaders.map((header, index) => (
              <th 
                key={index}
                className="px-4 py-5 text-left text-sm font-semibold  tracking-wider text-emerald-900 dark:text-emerald-100  border-emerald-400/60 dark:border-emerald-600/60"
                style={{ minWidth: header.width }}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={tableHeaders.length} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                  <Package size={48} className="mb-4 opacity-50" />
                  <p className="text-lg font-medium">No products found</p>
                  <p className="mt-1 text-sm">Try adjusting your search criteria</p>
                </div>
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <ProductRow
                key={product.id}
                product={product}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}