// components/seller/faqs/SellerFAQs.jsx
"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useFaqs } from '@/lib/firestore/faqs/read';
import Link from 'next/link';

function SellerFAQs() {
  const [openFaq, setOpenFaq] = useState(null);
  const { data: allFaqs, isLoading, error } = useFaqs();

  // Filter only seller FAQs
  const sellerFaqs = allFaqs?.filter(faq => faq.faqType === 'seller') || [];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>Failed to load FAQs. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (sellerFaqs.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>
        </div>
        <div className="text-center py-8">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400">
            No FAQs available at the moment.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
            Check back later or contact support for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
          <HelpCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h3>
      </div>
      
      <div className="space-y-4">
        {sellerFaqs.map((faq, index) => (
          <div 
            key={faq.id} 
            className="border border-emerald-200 dark:border-cyan-600 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex items-center justify-between p-4 text-left bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              <span className="font-medium text-slate-900 dark:text-white pr-4">
                {faq.faq}
              </span>
              {openFaq === index ? (
                <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
              )}
            </button>
            
            {openFaq === index && (
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-600">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {faq.answer}
                </p>
                {faq.timestampUpdate && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Last updated: {faq.timestampUpdate.toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      
    </div>
  );
}

export default SellerFAQs;