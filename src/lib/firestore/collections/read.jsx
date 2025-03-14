"use client";

import { db } from "../firebase";
import { collection,query, where, onSnapshot } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useCollections() {
  const { data, error } = useSWRSubscription(
    ["collections"],
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




export function useShowcasedCollections() {
  const { data, error } = useSWRSubscription(
    ["showcasedCollections"],
    ([path], { next }) => {
      const q = query(collection(db, "collections"), where("isShowcased", "==", "yes"));
      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(
            null,
            snapshot.docs.length === 0
              ? null
              : snapshot.docs.map((snap) => ({
                  ...snap.data(),
                  id: snap.id,
                  timestampCreate: snap.data().timestampCreate
                    ? snap.data().timestampCreate.toDate().toISOString()
                    : null,
                  timestampUpdate: snap.data().timestampUpdate
                    ? snap.data().timestampUpdate.toDate().toISOString()
                    : null,
                }))
          ),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return { data, error: error?.message, isLoading: data === undefined };
}
