// components/seller/payments/PaymentRow.jsx
'use client'

export default function PaymentRow({ payment, index }) {
  const cellBase = "px-4 py-4 border-r"
  const cellBorder = "border-emerald-300/40 dark:border-emerald-600/40"
  const cellStyle = `${cellBase} ${cellBorder}`
  
  const textPrimary = "text-slate-900 dark:text-gray-100"
  const textSecondary = "text-slate-700 dark:text-gray-200"
  const textAccent = "text-emerald-600 dark:text-emerald-400"

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'collected':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400'
    }
  }

  // Payment method colors
  const getPaymentColor = (paymentMode) => {
    return paymentMode === 'cod' 
      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  }

  // Status text
  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Paid'
      case 'collected': return 'Collected'
      case 'pending': return 'Pending'
      case 'failed': return 'Failed'
      default: return status
    }
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return { date: 'N/A', time: 'N/A' }
    
    // Handle Firestore timestamp and regular date
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    
    return {
      date: date.toLocaleDateString('en-IN'), // Indian format
      time: date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  }

  const { date, time } = formatDateTime(payment.timestampCreate)

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
          {payment.orderId}
        </code>
      </td>

      {/* Transaction ID */}
      <td className={cellStyle}>
        <code className={`text-xs font-mono ${textSecondary} bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded`}>
          {payment.transactionId}
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
            {payment.customerName}
          </div>
        
        </div>
      </td>

      {/* Amount */}
      <td className={cellStyle}>
        <span className={`text-sm font-bold ${textAccent}`}>
          ₹{payment.grossAmount?.toFixed(2) || '0.00'}
        </span>
      </td>

      {/* Payment Method */}
      <td className={cellStyle}>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPaymentColor(payment.paymentMode)}`}>
          {payment.paymentMethod}
        </span>
      </td>

      {/* Status */}
      <td className={cellStyle}>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(payment.status)}`}>
          {getStatusText(payment.status)}
        </span>
      </td>
    </tr>
  )
}