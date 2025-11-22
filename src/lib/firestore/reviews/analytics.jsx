"use client";

import { collectionGroup, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import useSWR from "swr";

/**
 * Hook to get seller review analytics
 */
export const useReviewAnalytics = (sellerId = null) => {
  const fetcher = async ([, sellerId]) => {
    try {
      // Query all reviews
      const reviewsRef = collectionGroup(db, "reviews");
      let q = query(reviewsRef);
      
      // Filter by seller if provided
      if (sellerId) {
        q = query(reviewsRef, where("sellerId", "==", sellerId));
      }
      
      const snapshot = await getDocs(q);
      const reviews = snapshot.docs.map(doc => doc.data());
      
      return calculateAnalytics(reviews);
    } catch (error) {
      console.error('Error fetching review analytics:', error);
      throw error;
    }
  };

  const { data, error, isLoading } = useSWR(
    ['reviewAnalytics', sellerId],
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    analytics: data || getDefaultAnalytics(),
    error,
    isLoading
  };
};

/**
 * Calculate analytics from reviews data
 */
const calculateAnalytics = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return getDefaultAnalytics();
  }

  const totalReviews = reviews.length;
  
  // Calculate average rating
  const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
  const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;
  
  // Count unique products
  const uniqueProducts = new Set(reviews.map(review => review.productId)).size;
  
  // Count ratings by category
  const ratingCounts = {
    positive: reviews.filter(review => review.rating >= 4).length,
    neutral: reviews.filter(review => review.rating === 3).length,
    negative: reviews.filter(review => review.rating <= 2).length
  };
  
  // Calculate percentages
  const positivePercentage = totalReviews > 0 ? ((ratingCounts.positive / totalReviews) * 100).toFixed(1) : 0;
  const negativePercentage = totalReviews > 0 ? ((ratingCounts.negative / totalReviews) * 100).toFixed(1) : 0;
  const neutralPercentage = totalReviews > 0 ? ((ratingCounts.neutral / totalReviews) * 100).toFixed(1) : 0;

  return {
    totalReviews,
    averageRating: parseFloat(averageRating),
    reviewedProducts: uniqueProducts,
    positivePercentage: parseFloat(positivePercentage),
    negativePercentage: parseFloat(negativePercentage),
    neutralPercentage: parseFloat(neutralPercentage),
    ratingDistribution: {
      5: reviews.filter(review => review.rating === 5).length,
      4: reviews.filter(review => review.rating === 4).length,
      3: reviews.filter(review => review.rating === 3).length,
      2: reviews.filter(review => review.rating === 2).length,
      1: reviews.filter(review => review.rating === 1).length
    }
  };
};

const getDefaultAnalytics = () => ({
  totalReviews: 0,
  averageRating: 0,
  reviewedProducts: 0,
  positivePercentage: 0,
  negativePercentage: 0,
  neutralPercentage: 0,
  ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
});