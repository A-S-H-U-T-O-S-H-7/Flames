"use client";

import { db } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useBanners() {
  const { data, error } = useSWRSubscription(
    ["banners"],
    ([path], { next }) => {
      const ref = collection(db, path);
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


export function useHeroBanners() {
  const { data, error } = useSWRSubscription(
    ["banners", "Hero"],
    ([path, bannerType], { next }) => {
      // Create a query to filter by bannerType
      const q = query(
        collection(db, path),
        where("bannerType", "==", bannerType)
      );
      
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          next(
            null,
            snapshot.docs.length === 0
              ? []
              : snapshot.docs.map((snap) => ({
                  id: snap.id,
                  ...snap.data()
                }))
          );
        },
        (err) => next(err, null)
      );
      
      return () => unsub();
    }
  );

  return { 
    heroBanners: data || [], 
    error: error?.message, 
    isLoading: data === undefined 
  };
}