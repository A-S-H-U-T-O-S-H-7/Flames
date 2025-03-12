import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#1e2737]">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22c7d5] border-t-transparent mx-auto"></div>
        <p className="mt-4 text-white">Loading dashboard data...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;