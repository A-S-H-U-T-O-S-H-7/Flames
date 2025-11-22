"use client";

export default function EmptyState({ filters }) {
  const hasActiveFilters = filters.status !== 'all' || filters.type !== 'all';

  return (
    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="text-6xl mb-4">🔔</div>
      
      {hasActiveFilters ? (
        <>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No matching notifications
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Try adjusting your filters to see more results.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No notifications yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            You'll see order updates, customer reviews, and important announcements here once they come in.
          </p>
        </>
      )}
    </div>
  );
}