// components/shared/Pagination.jsx
'use client'

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = "",
  showItemsCount = true,
  itemLabel = "items"
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 ${className}`}>
      
      {showItemsCount && (
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Showing <span className="font-medium">{startItem}-{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> {itemLabel}
        </div>
      )}

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-teal-600 dark:hover:text-teal-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              page === currentPage
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg'
                : page === '...'
                  ? 'text-slate-400 cursor-default'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-teal-600 dark:hover:text-teal-300'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-teal-600 dark:hover:text-teal-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;