"use client";

import { useState } from 'react';
import { ImageIcon, AlertCircle } from 'lucide-react';

export default function OptimizedImage({ 
  src, 
  alt, 
  className = "", 
  fallbackSrc = null,
  showLoader = true 
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    
    // Try fallback if available
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsLoading(true);
      setHasError(false);
    }
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
        <div className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500">
          <AlertCircle size={20} />
          <span className="text-xs">Failed to load</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Loading Skeleton */}
      {isLoading && showLoader && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse ${className}`}>
          <ImageIcon className="text-gray-400 dark:text-gray-500" size={20} />
        </div>
      )}
      
      {/* Actual Image */}
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy" // Native lazy loading
      />
    </div>
  );
}