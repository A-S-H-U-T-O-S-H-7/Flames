"use client";

import { db } from "../firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getCountFromServer,
  collectionGroup 
} from "firebase/firestore";

/**
 * Get comprehensive seller statistics
 * @param {string} sellerId - The seller ID
 * @returns {Promise<Object>} Seller stats including orders, revenue, products, and reviews
 */
export async function getSellerStats(sellerId) {
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }

  try {
    // Fetch stats in parallel for better performance
    const [orderStats, productStats, reviewStats] = await Promise.all([
      getSellerOrderStats(sellerId),
      getSellerProductStats(sellerId),
      getSellerReviewStats(sellerId)
    ]);

    return {
      success: true,
      data: {
        totalOrders: orderStats.totalOrders,
        totalRevenue: orderStats.totalRevenue,
        totalProducts: productStats.totalProducts,
        avgRating: reviewStats.avgRating,
        totalReviews: reviewStats.totalReviews
      }
    };
  } catch (error) {
    console.error("Error fetching seller stats:", error);
    return {
      success: false,
      error: error.message,
      data: {
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        avgRating: 0,
        totalReviews: 0
      }
    };
  }
}

/**
 * Get seller's order statistics
 */
async function getSellerOrderStats(sellerId) {
  try {
    const ordersRef = collection(db, "sellerOrders", sellerId, "orders");
    const ordersQuery = query(ordersRef);
    const ordersSnapshot = await getDocs(ordersQuery);

    let totalRevenue = 0;
    let totalOrders = 0;

    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      totalOrders++;
      
      // Only count revenue from non-cancelled orders
      if (order.status !== "cancelled" && order.status !== "refunded") {
        totalRevenue += order.sellerTotal || order.total || 0;
      }
    });

    return {
      totalOrders,
      totalRevenue
    };
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return {
      totalOrders: 0,
      totalRevenue: 0
    };
  }
}

/**
 * Get seller's product statistics
 */
async function getSellerProductStats(sellerId) {
  try {
    const productsRef = collection(db, "products");
    const productsQuery = query(productsRef, where("sellerId", "==", sellerId));
    const countSnapshot = await getCountFromServer(productsQuery);

    return {
      totalProducts: countSnapshot.data().count
    };
  } catch (error) {
    console.error("Error fetching product stats:", error);
    return {
      totalProducts: 0
    };
  }
}

/**
 * Get seller's review statistics
 */
async function getSellerReviewStats(sellerId) {
  try {
    // Query all reviews using collectionGroup
    const reviewsRef = collectionGroup(db, "reviews");
    const reviewsQuery = query(reviewsRef, where("sellerId", "==", sellerId));
    const reviewsSnapshot = await getDocs(reviewsQuery);

    let totalRating = 0;
    let totalReviews = 0;

    reviewsSnapshot.forEach((doc) => {
      const review = doc.data();
      if (review.rating) {
        totalRating += review.rating;
        totalReviews++;
      }
    });

    const avgRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

    return {
      avgRating: parseFloat(avgRating),
      totalReviews
    };
  } catch (error) {
    console.error("Error fetching review stats:", error);
    return {
      avgRating: 0,
      totalReviews: 0
    };
  }
}
