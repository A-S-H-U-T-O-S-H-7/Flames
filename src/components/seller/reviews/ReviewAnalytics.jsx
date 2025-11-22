"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ReviewAnalytics({ analytics, isLoading }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    totalReviews,
    averageRating,
    reviewedProducts,
    positivePercentage,
    negativePercentage,
    neutralPercentage,
    ratingDistribution
  } = analytics || {};

  if (isLoading) {
    return (
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-xl p-4 sm:p-5 border border-teal-400 dark:border-teal-500">
              <div className="animate-pulse">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
                <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-4 sm:p-5 border border-teal-400 dark:border-teal-500">
          <div className="animate-pulse h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: "Average Rating",
      value: averageRating || 0,
      display: `${averageRating || 0}/5`,
      gradient: "from-amber-50 via-amber-100 to-amber-200 dark:from-amber-900/30 dark:via-amber-800/30 dark:to-amber-700/30",
      textColor: "text-amber-700 dark:text-amber-400"
    },
    {
      label: "Total Reviews",
      value: totalReviews || 0,
      display: (totalReviews || 0).toLocaleString(),
      gradient: "from-blue-50 via-blue-100 to-blue-200 dark:from-blue-900/30 dark:via-blue-800/30 dark:to-blue-700/30",
      textColor: "text-blue-700 dark:text-blue-400"
    },
    {
      label: "Products",
      value: reviewedProducts || 0,
      display: (reviewedProducts || 0).toLocaleString(),
      gradient: "from-emerald-50 via-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:via-emerald-800/30 dark:to-emerald-700/30",
      textColor: "text-emerald-700 dark:text-emerald-400"
    },
    {
      label: "Positive",
      value: positivePercentage || 0,
      display: `${positivePercentage || 0}%`,
      gradient: "from-teal-50 via-teal-100 to-teal-200 dark:from-teal-900/30 dark:via-teal-800/30 dark:to-teal-700/30",
      textColor: "text-teal-700 dark:text-teal-400"
    },
    {
      label: "Negative",
      value: negativePercentage || 0,
      display: `${negativePercentage || 0}%`,
      gradient: "from-rose-50 via-rose-100 to-rose-200 dark:from-rose-900/30 dark:via-rose-800/30 dark:to-rose-700/30",
      textColor: "text-rose-700 dark:text-rose-400"
    }
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-br ${metric.gradient} rounded-xl p-4 sm:p-5 border border-teal-400 dark:border-teal-500 shadow-sm hover:shadow-md transition-all duration-200`}
          >
            <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              {metric.label}
            </div>
            <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${metric.textColor}`}>
              {metric.display}
            </div>
          </div>
        ))}
      </div>

      {/* Rating Distribution - Collapsible */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-teal-400 dark:border-teal-500 shadow-sm overflow-hidden">
        {/* Header - Clickable */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">
            Rating Distribution
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {totalReviews || 0} reviews
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            )}
          </div>
        </button>

        {/* Expandable Content */}
        <div 
          className={`transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="px-4 sm:px-6 pb-5 pt-2">
            <div className="space-y-2.5">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingDistribution?.[rating] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 w-full sm:w-16">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {rating}
                      </span>
                      <span className="text-amber-500">⭐</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 sm:h-3">
                        <div 
                          className="bg-gradient-to-r from-teal-400 to-emerald-500 dark:from-teal-500 dark:to-emerald-600 h-2.5 sm:h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-right sm:w-24">
                      <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                        {count} <span className="text-slate-500 dark:text-slate-400">({percentage.toFixed(1)}%)</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 dark:bg-emerald-500"></div>
                  <span className="text-slate-600 dark:text-slate-400">
                    Positive: {positivePercentage || 0}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                  <span className="text-slate-600 dark:text-slate-400">
                    Neutral: {neutralPercentage || 0}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500"></div>
                  <span className="text-slate-600 dark:text-slate-400">
                    Negative: {negativePercentage || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}