export default function SellersLoading() {
  return (
    <div className="p-4 md:p-6 bg-[#1e2737] min-h-screen">
      <div className="animate-pulse space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="space-y-2">
            <div className="h-8 bg-gray-600 rounded w-64"></div>
            <div className="h-4 bg-gray-600 rounded w-48"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-600 rounded-lg w-32"></div>
            <div className="h-10 bg-gray-600 rounded-lg w-32"></div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-600 rounded-2xl"></div>
          ))}
        </div>

        {/* Filter Bar Skeleton */}
        <div className="h-16 bg-gray-600 rounded-2xl"></div>

        {/* Table Skeleton */}
        <div className="bg-[#0e1726] rounded-2xl border border-gray-700 p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="h-12 w-12 bg-gray-600 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                </div>
                <div className="h-8 bg-gray-600 rounded w-20"></div>
                <div className="h-8 bg-gray-600 rounded w-16"></div>
                <div className="h-8 bg-gray-600 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}