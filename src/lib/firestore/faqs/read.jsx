// lib/firestore/faqs/read.js
"use client";

import { db } from "../firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

/**
 * Hook to get all FAQs (real-time)
 */
export function useFaqs() {
  const { data, error } = useSWRSubscription(
    ["faqs"],
    ([path], { next }) => {
      const ref = collection(db, path);
      const q = query(ref, orderBy("timestampCreate", "desc"));
      
      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(
            null,
            snapshot.docs.length === 0
              ? null
              : snapshot.docs.map((snap) => ({
                  id: snap.id,
                  ...snap.data(),
                  timestampCreate: snap.data().timestampCreate?.toDate?.() || snap.data().timestampCreate,
                  timestampUpdate: snap.data().timestampUpdate?.toDate?.() || snap.data().timestampUpdate
                }))
          ),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return { data, error: error?.message, isLoading: data === undefined };
}

/**
 * Hook to get FAQs by type (seller, customer, general)
 */
export function useFaqsByType(faqType) {
  const { data, error } = useSWRSubscription(
    ["faqs", faqType],
    ([path, faqType], { next }) => {
      if (!faqType) {
        next(null, []);
        return () => {};
      }

      const ref = collection(db, path);
      const q = query(
        ref, 
        where("faqType", "==", faqType),
        orderBy("timestampCreate", "desc")
      );
      
      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(
            null,
            snapshot.docs.length === 0
              ? []
              : snapshot.docs.map((snap) => ({
                  id: snap.id,
                  ...snap.data(),
                  timestampCreate: snap.data().timestampCreate?.toDate?.() || snap.data().timestampCreate,
                  timestampUpdate: snap.data().timestampUpdate?.toDate?.() || snap.data().timestampUpdate
                }))
          ),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return { 
    data: data || [], 
    error: error?.message, 
    isLoading: data === undefined && !error 
  };
}