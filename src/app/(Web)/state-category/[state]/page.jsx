// app/state-category/[state-category]/page.jsx
"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import StateListedProducts from '@/components/StateListedProduts';

const Page = () => {
  const params = useParams();
  const state = params.state; // Fix: Use correct parameter name

  // Capitalize state name properly
  const capitalizedState = state?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div>
      <h1 className="text-2xl text-center bg-gray-50 font-heading font-medium text-gray-800 max-w-7xl mx-auto px-[10px] md:px-[30px] py-4">
        {capitalizedState} Collection
      </h1>
      <StateListedProducts state={state} />
    </div>
  );
};

export default Page;