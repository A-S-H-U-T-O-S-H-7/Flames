// components/seller/orders/OrderRow.jsx
'use client'

import { Eye, Edit2, Truck } from 'lucide-react'
import ChangeOrderStatus from './SellerChangeStatus'

export default function OrderRow({ order, index, onView, onEdit, onCancel }) {
  const cellBase = "px-4 py-4 border-r"
  const cellBorder = "border-emerald-300/40 dark:border-emerald-600/40"
  const cellStyle = `${cellBase} ${cellBorder}`
  
  const textPrimary = "text-slate-900 dark:text-gray-100"
  const textSecondary = "text-slate-700 dark:text-gray-200"
  const textAccent = "text-emerald-600 dark:text-emerald-400"

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'shipped':
      case 'in transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'packed':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400'
    }
  }

  const getPaymentColor = (paymentMode) => {
    return paymentMode === 'cod' 
      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return { date: 'N/A', time: 'N/A' }
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    }
  }

  const { date, time } = formatDateTime(order.createdAt)

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

      {/* Order ID */}
      <td className={cellStyle}>
        <code className={`text-xs font-mono ${textSecondary} bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded`}>
          {order.id}
        </code>
      </td>

      {/* Date/Time */}
      <td className={cellStyle}>
        <div className="min-w-0">
          <div className={`text-sm font-medium ${textPrimary}`}>
            {date}
          </div>
          <div className={`text-xs ${textSecondary}`}>
            {time}
          </div>
        </div>
      </td>

      {/* Customer */}
      <td className={cellStyle}>
        <div className="min-w-0">
          <div className={`text-sm font-medium ${textPrimary}`}>
            {order.address?.fullName || 'N/A'}
          </div>
          
        </div>
      </td>

      {/* Address */}
      <td className={cellStyle}>
        <div className="min-w-0 max-w-[200px]">
          <div className={`text-sm ${textSecondary} truncate`}>
            {order.address?.addressLine1 || 'N/A'}
          </div>
          <div className={`text-xs ${textSecondary} opacity-70`}>
            {order.address?.city}, {order.address?.pincode}
          </div>
        </div>
      </td>

      {/* Products */}
      <td className={cellStyle}>
        <div className="flex flex-col space-y-1 max-w-[180px]">
          {order.line_items?.slice(0, 2).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-xs font-medium">
                {item.quantity}
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 truncate flex-1">
                {item.product_data.name}
              </div>
            </div>
          ))}
          {order.line_items?.length > 2 && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              +{order.line_items.length - 2} more items
            </span>
          )}
        </div>
      </td>

      {/* Total Amount */}
      <td className={cellStyle}>
        <span className={`text-sm font-bold ${textAccent}`}>
          ₹{order.sellerTotal || order.total || 0}
        </span>
      </td>

      {/* Payment */}
      <td className={cellStyle}>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPaymentColor(order.paymentMode)}`}>
          {order.paymentMode}
        </span>
      </td>

      {/* Status */}
      <td className={cellStyle}>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </td>

      {/* Actions */}
      <td className={cellBase}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(order)}
            className="p-2 text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 rounded-lg transition-colors duration-200 border border-purple-700 dark:border-purple-600 shadow-sm"
            title="View Order"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(order)}
            className="p-2 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-lg transition-colors duration-200 border border-blue-700 dark:border-blue-600 shadow-sm"
            title="Edit Order"
          >
            <Edit2 size={16} />
          </button>
          <ChangeOrderStatus 
            order={order} 
            className="p-2 text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 rounded-lg transition-colors duration-200 border border-teal-700 dark:border-teal-600 shadow-sm"
          />
        </div>
      </td>
    </tr>
  )
}