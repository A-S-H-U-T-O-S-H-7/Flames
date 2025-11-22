"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SellersIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    router.push('/sellers/dashboard');
  }, [router]);

  return (
    <div className="p-6 bg-[#1e2737] min-h-screen">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-600 rounded mb-6 w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-600 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}