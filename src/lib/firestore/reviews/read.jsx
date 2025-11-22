"use client";

import { db } from "../firebase";
import {
  collection,
  collectionGroup,
  onSnapshot,
  orderBy,
  query, limit, startAfter,
  where
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useReviews({ productId }) {
  const { data, error } = useSWRSubscription(
    [`products/${productId}/reviews`],
    ([path], { next }) => {
      const ref = query(collection(db, path), orderBy("timestamp", "desc"));
      const unsub = onSnapshot(
        ref,
        (snapshot) =>
          next(
            null,
            snapshot.docs.length === 0
              ? null
              : snapshot.docs.map((snap) => snap.data())
          ),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );
  if (error) {
    console.log(error?.message);
  }

  return { data, error: error?.message, isLoading: data === undefined };
}

export function useAllReview() {
  const { data, error } = useSWRSubscription(
    ["reviews"],
    ([path], { next }) => {
      const ref = collectionGroup(db, path);
      const unsub = onSnapshot(
        ref,
        (snapshot) =>
          next(
            null,
            snapshot.docs.length === 0
              ? null
              : snapshot.docs.map((snap) => snap.data())
          ),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return { data, error: error?.message, isLoading: data === undefined };
}

export function useShowcasedReviews() {
  const { data, error } = useSWRSubscription(
    ["reviews"],
    ([path], { next }) => {
      // Adding where clause to filter for isShowcased: true
      const ref = query(
        collectionGroup(db, path),
        where("isShowcased", "==", true)
      );
      
      console.log("Fetching showcased reviews from Firebase...");
      
      const unsub = onSnapshot(
        ref,
        (snapshot) => {
          const reviewData = snapshot.docs.length === 0
            ? null
            : snapshot.docs.map((snap) => snap.data());
          
          console.log(`Fetched ${snapshot.docs.length} showcased reviews`);
          next(null, reviewData);
        },
        (err) => {
          console.error("Error in Firebase query:", err);
          // Add more specific error handling for missing index
          if (err.message && err.message.includes('requires an index')) {
            next(new Error('Database index is being built. Please try again in a few minutes.'), null);
          } else {
            next(err, null);
          }
        }
      );
      return () => unsub();
    }
  );

  // Check error.message instead of error directly
  const isIndexBuilding = error && error.message && error.message.includes('index');
  
  return { 
    data, 
    error: error?.message, 
    isLoading: data === undefined,
    isIndexBuilding
  };
}

/**
 * Hook to get seller-specific reviews
 * Fetches only reviews for products owned by the seller
 */
export function useSellerReviews({ sellerId, pageLimit = 100 } = {}) {
  const { data, error } = useSWRSubscription(
    ["sellerReviews", sellerId, pageLimit],
    ([path, sellerId, pageLimit], { next }) => {
      if (!sellerId) {
        next(null, { list: [], lastSnapDoc: null });
        return () => {};
      }

      // Query all reviews using collection group
      const ref = collectionGroup(db, "reviews");
      const q = query(
        ref,
        where("sellerId", "==", sellerId),
        orderBy("timestamp", "desc"),
        limit(pageLimit)
      );

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const reviews = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore timestamp
            timestamp: doc.data().timestamp
          }));
          
          next(null, {
            list: reviews,
            lastSnapDoc: snapshot.docs[snapshot.docs.length - 1] || null
          });
        },
        (err) => {
          console.error('Error fetching seller reviews:', err);
          next(err, null);
        }
      );

      return () => unsub();
    }
  );

  return {
    data: data?.list || [],
    lastSnapDoc: data?.lastSnapDoc,
    error: error?.message,
    isLoading: !data && !error
  };
}

/**
 * Hook to get all reviews (Admin only)
 * Fetches reviews from all products
 */
export function useAdminReviews({ pageLimit = 100 } = {}) {
  const { data, error } = useSWRSubscription(
    ["adminReviews", pageLimit],
    ([path, pageLimit], { next }) => {
      // Query all reviews using collection group
      const ref = collectionGroup(db, "reviews");
      const q = query(
        ref,
        orderBy("timestamp", "desc"),
        limit(pageLimit)
      );

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const reviews = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp
          }));
          
          next(null, {
            list: reviews,
            lastSnapDoc: snapshot.docs[snapshot.docs.length - 1] || null
          });
        },
        (err) => {
          console.error('Error fetching admin reviews:', err);
          next(err, null);
        }
      );

      return () => unsub();
    }
  );

  return {
    data: data?.list || [],
    lastSnapDoc: data?.lastSnapDoc,
    error: error?.message,
    isLoading: !data && !error
  };
}
