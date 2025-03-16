"use client";

import { db } from "../firebase";
import { collection, query,where, limit, startAfter, onSnapshot } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useCollections({ pageLimit, lastSnapDoc } = {}) {
  const { data, error } = useSWRSubscription(
    ["collections", pageLimit, lastSnapDoc],
    ([path, pageLimit, lastSnapDoc], { next }) => {
      const ref = collection(db, path);
      let q = query(ref, limit(pageLimit ?? 10));

      if (lastSnapDoc) {
        q = query(q, startAfter(lastSnapDoc));
      }

      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(null, {
            list:
              snapshot.docs.length === 0
                ? null
                : snapshot.docs.map((snap) => snap.data()),
            lastSnapDoc:
              snapshot.docs.length === 0
                ? null
                : snapshot.docs[snapshot.docs.length - 1],
          }),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return {
    data: data?.list,
    lastSnapDoc: data?.lastSnapDoc,
    error: error?.message,
    isLoading: data === undefined,
  };
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
