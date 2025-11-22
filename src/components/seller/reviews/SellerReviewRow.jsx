"use client";

import { useProduct } from "@/lib/firestore/products/read";
import { Rating } from "@mui/material";
import { Avatar } from "@nextui-org/react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function SellerReviewRow({ item, index, onEdit }) {
  const { data: product } = useProduct({ productId: item?.productId });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!item?.reviewPhotoURL || !imageRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Image is in viewport, start loading
            const img = new Image();
            img.src = item.reviewPhotoURL;
            img.onload = () => setImageLoaded(true);
            img.onerror = () => setImageError(true);
            
            // Stop observing once we've started loading
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1 
      }
    );

    observer.observe(imageRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [item?.reviewPhotoURL]);

  // Format date and time from Firestore timestamp
  const formatDateTime = (timestamp) => {
    if (!timestamp || !timestamp.seconds) {
      return "N/A";
    }
    
    const date = new Date(timestamp.seconds * 1000);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice('-2');
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    return `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
  };

  const cellBase = "px-4 py-4 border-r";
  const cellBorder = "border-emerald-300/40 dark:border-emerald-600/40";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  const textPrimary = "text-slate-900 dark:text-gray-100";
  const textSecondary = "text-slate-700 dark:text-gray-200";
  const textAccent = "text-emerald-600 dark:text-emerald-400";

  return (
    <tr className={`border-b transition-all duration-200 hover:shadow-lg ${
      "border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-slate-700/50"
    } ${
      index % 2 === 0
        ? "bg-slate-100/60 dark:bg-slate-800/30"
        : "bg-white dark:bg-slate-800/10"
    }`}>
      
      {/* SR No */}
      <td className={cellStyle}>
        <span className={`font-medium ${textPrimary}`}>
          {index + 1}
        </span>
      </td>

      {/* Date & Time */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {formatDateTime(item?.timestamp)}
        </span>
      </td>

      {/* User */}
      <td className={cellStyle}>
        <div className="flex items-center gap-2">
          <Avatar src={item?.photoURL} className="h-8 w-8" />
          <span className={`text-sm ${textPrimary}`}>{item?.displayName}</span>
        </div>
      </td>

      {/* Review Image with Lazy Loading */}
      <td className={cellStyle}>
        {item?.reviewPhotoURL ? (
          <div 
            ref={imageRef}
            className="w-12 h-12 mx-auto relative rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700"
          >
            {/* Loading Skeleton */}
            {!imageLoaded && !imageError && (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-600 animate-pulse" />
            )}
            
            {/* Error State */}
            {imageError && (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs text-slate-400">Error</span>
              </div>
            )}
            
            {/* Actual Image */}
            {imageLoaded && !imageError && (
              <img
                src={item.reviewPhotoURL}
                alt="Review"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={() => setImageError(true)}
              />
            )}
          </div>
        ) : (
          <div className="text-center text-slate-400 dark:text-slate-500 text-sm">-</div>
        )}
      </td>

      {/* Product */}
      <td className={cellStyle}>
        <Link 
          href={`/product-details/${item?.productId}`}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
        >
          <span className="text-sm font-medium truncate max-w-[150px]">
            {product?.title}
          </span>
          <ExternalLink size={14} />
        </Link>
      </td>

      {/* Rating */}
      <td className={cellStyle}>
        <div className="flex justify-center">
          <Rating value={item?.rating} readOnly size="small" />
        </div>
      </td>

      {/* Review */}
      <td className={cellStyle}>
        <p className={`text-sm line-clamp-2 ${textSecondary}`}>
          {item?.message}
        </p>
        {item?.sellerReply && (
          <div className="mt-2 p-2 rounded-md bg-emerald-50 dark:bg-slate-700/40 border border-emerald-200 dark:border-emerald-700">
            <span className={`block text-xs font-semibold ${textAccent}`}>Seller Reply</span>
            <p className={`text-sm mt-1 ${textSecondary} line-clamp-2`}>{item.sellerReply}</p>
          </div>
        )}
      </td>

      {/* Actions */}
      <td className={cellBase}>
        <div className="flex items-center justify-center">
          <button
            onClick={() => onEdit(item)}
            className="px-4 py-2 text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm flex items-center gap-2"
            title="Reply to Review"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Reply
          </button>
        </div>
      </td>
    </tr>
  );
}