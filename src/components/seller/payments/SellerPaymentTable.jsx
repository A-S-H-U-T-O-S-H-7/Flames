// components/seller/payments/PaymentsTable.jsx
'use client'

import { CreditCard } from 'lucide-react'
import PaymentRow from './SellerPaymentRow'
import Pagination from '../Pangination'

export default function PaymentsTable({ 
  payments, 
  loading, 
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}) {
  const tableHeaders = [
    { label: "SR. No", width: "60px" },
    { label: "Order ID", width: "120px" },
    { label: "Transaction ID", width: "140px" },
    { label: "Date/Time", width: "120px" },
    { label: "Customer", width: "140px" },
    { label: "Amount", width: "100px" },
    { label: "Method", width: "100px" },
    { label: "Status", width: "100px" },
  ]

  // Calculate total amount for current page
  const totalAmount = payments.reduce((sum, payment) => {
    return sum + (payment.grossAmount || 0);
  }, 0);

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
        <table className="w-full min-w-max" style={{ minWidth: "1000px" }}>
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
            {payments.length === 0 ? (
              <tr>
                <td colSpan={tableHeaders.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                    <CreditCard size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium">No payments found</p>
                    <p className="mt-1 text-sm">Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {/* Payment rows */}
                {payments.map((payment, index) => (
                  <PaymentRow
                    key={payment.id}
                    payment={payment}
                    index={index}
                  />
                ))}
                
                {/* Total row - only show if there are payments */}
                <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-700 dark:to-slate-600 border-t-2 border-emerald-300 dark:border-emerald-600">
                  <td 
                    colSpan={5} 
                    className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300 border-r border-emerald-300/40 dark:border-emerald-600/40"
                  >
                    Page Total:
                  </td>
                  <td className="px-4 py-3 border-r border-emerald-300/40 dark:border-emerald-600/40">
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </td>
                  <td colSpan={2} className="px-4 py-3 text-slate-500 dark:text-slate-400 text-sm">
                    {payments.length} payment{payments.length !== 1 ? 's' : ''} on this page
                  </td>
                </tr>
              </>
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