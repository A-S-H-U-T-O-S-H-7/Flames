"use client";

import { Search } from "lucide-react";
import SellerReviewRow from "./SellerReviewRow";
import Pagination from "../Pangination";

export default function ReviewTable({
  reviews,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onEdit,
  isLoading
}) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReviews = reviews.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl shadow-2xl border-2 overflow-hidden bg-white dark:bg-slate-800 border-emerald-300 dark:border-emerald-600/50 shadow-emerald-500/10 dark:shadow-emerald-900/20">
      <div className="overflow-x-auto">
        <div className="min-w-[1400px]">
          <table className="w-full">
            <thead className="border-b-2 bg-gradient-to-r from-emerald-100 via-teal-100 to-emerald-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 border-emerald-400 dark:border-emerald-500/60 shadow-sm">
              <tr>
                <th className="px-4 py-5 text-left text-sm font-semibold tracking-wider text-emerald-900 dark:text-emerald-100 border-r border-emerald-400/60 dark:border-emerald-600/60">SR. No</th>
                <th className="px-4 py-5 text-left text-sm font-semibold tracking-wider text-emerald-900 dark:text-emerald-100 border-r border-emerald-400/60 dark:border-emerald-600/60">Date & Time</th>
                <th className="px-4 py-5 text-left text-sm font-semibold tracking-wider text-emerald-900 dark:text-emerald-100 border-r border-emerald-400/60 dark:border-emerald-600/60">User</th>
                <th className="px-4 py-5 text-left text-sm font-semibold tracking-wider text-emerald-900 dark:text-emerald-100 border-r border-emerald-400/60 dark:border-emerald-600/60">Review Image</th>
                <th className="px-4 py-5 text-left text-sm font-semibold tracking-wider text-emerald-900 dark:text-emerald-100 border-r border-emerald-400/60 dark:border-emerald-600/60">Product</th>
                <th className="px-4 py-5 text-left text-sm font-semibold tracking-wider text-emerald-900 dark:text-emerald-100 border-r border-emerald-400/60 dark:border-emerald-600/60">Rating</th>
                <th className="px-4 py-5 text-left text-sm font-semibold tracking-wider text-emerald-900 dark:text-emerald-100 border-r border-emerald-400/60 dark:border-emerald-600/60">Review</th>
                <th className="px-4 py-5 text-center text-sm font-semibold tracking-wider text-emerald-900 dark:text-emerald-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReviews?.length > 0 ? (
                currentReviews.map((item, index) => (
                  <SellerReviewRow
                    key={`${item?.productId}-${item?.uid}` || index}
                    item={item}
                    index={startIndex + index}
                    onEdit={onEdit}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                      <div className="mb-4 opacity-50">
                        <Search size={48} />
                      </div>
                      <p className="text-lg font-medium">No reviews found</p>
                      <p className="mt-1 text-sm">
                        No reviews match your current filters
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
}