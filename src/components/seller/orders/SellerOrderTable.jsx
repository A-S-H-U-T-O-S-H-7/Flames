// components/seller/orders/OrdersTable.jsx
'use client'

import { Package } from 'lucide-react'
import OrderRow from './SellerOrderRow'
import Pagination from '../Pangination'

export default function OrdersTable({ 
  orders, 
  loading, 
  onView, 
  onEdit, 
  onCancel,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage 
}) {
  const tableHeaders = [
    { label: "SR. No", width: "60px" },
    { label: "Order ID", width: "120px" },
    { label: "Date/Time", width: "120px" },
    { label: "Customer", width: "140px" },
    { label: "Address", width: "160px" },
    { label: "Products", width: "180px" },
    { label: "Total", width: "100px" },
    { label: "Payment", width: "100px" },
    { label: "Status", width: "100px" },
    { label: "Actions", width: "140px" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl shadow-2xl border-2 overflow-hidden bg-white dark:bg-slate-800 border-emerald-300 dark:border-emerald-600/50 shadow-emerald-500/10 dark:shadow-emerald-900/20">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max" style={{ minWidth: "1600px" }}>
          <thead className="border-b-2 bg-gradient-to-r from-emerald-100 via-teal-100 to-emerald-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 border-emerald-400 dark:border-emerald-500/60 shadow-sm">
            <tr>
              {tableHeaders.map((header, index) => (
                <th 
                  key={index}
                  className="px-4 py-5 text-left text-sm font-semibold tracking-wider text-emerald-900 dark:text-emerald-100 border-emerald-400/60 dark:border-emerald-600/60"
                  style={{ minWidth: header.width }}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={tableHeaders.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                    <Package size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium">No orders found</p>
                    <p className="mt-1 text-sm">Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  index={index}
                  onView={onView}
                  onEdit={onEdit}
                  onCancel={onCancel}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  )
}