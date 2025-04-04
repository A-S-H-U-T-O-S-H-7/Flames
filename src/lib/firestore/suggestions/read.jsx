"use client";

import { db } from "../firebase";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useSuggestions(filters = {}, forceRefresh = 0) {
  const { data, error } = useSWRSubscription(
    ["suggestions", filters, forceRefresh], // Add forceRefresh to the key
    ([path, filterOptions], { next }) => {
      // Create queries based on filter combinations
      let suggestionQuery;
      
      try {
        // Start with the collection reference
        const collectionRef = collection(db, path);
        
        // Handle different filter combinations that require specific indexes
        if (filterOptions.status && filterOptions.type) {
        
          suggestionQuery = query(
            collectionRef,
            where("status", "==", filterOptions.status),
            where("type", "==", filterOptions.type),
            orderBy("timestampCreate", "desc")
          );
        } else if (filterOptions.status) {
          // Only status filter + timestamp ordering
          suggestionQuery = query(
            collectionRef,
            where("status", "==", filterOptions.status),
            orderBy("timestampCreate", "desc")
          );
        } else if (filterOptions.type) {
          // Only type filter + timestamp ordering
          suggestionQuery = query(
            collectionRef,
            where("type", "==", filterOptions.type),
            orderBy("timestampCreate", "desc")
          );
        } else if (filterOptions.uid) {
          // Only uid filter + timestamp ordering
          suggestionQuery = query(
            collectionRef,
            where("uid", "==", filterOptions.uid),
            orderBy("timestampCreate", "desc")
          );
        } else {
          // No filters, just ordering
          suggestionQuery = query(
            collectionRef,
            orderBy("timestampCreate", "desc")
          );
        }
        
        // Set up the snapshot listener
        const unsub = onSnapshot(
          suggestionQuery,
          (snapshot) =>
            next(
              null,
              snapshot.docs.length === 0
                ? []
                : snapshot.docs.map((snap) => snap.data())
            ),
          (err) => next(err, null)
        );
        
        return () => unsub();
      } catch (err) {
        next(err, null);
        return () => {};
      }
    }
  );

  return { 
    suggestions: data, 
    error: error?.message, 
    isLoading: data === undefined 
  };
}