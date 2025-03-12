"use client";

import { db } from "../firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  limit,
  startAfter,
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useUser({ uid }) {
  const { data, error } = useSWRSubscription(
    ["users", uid],
    ([path, uid], { next }) => {
      const ref = doc(db, `users/${uid}`);
      const unsub = onSnapshot(
        ref,
        (snapshot) => next(null, snapshot.exists() ? snapshot.data() : null),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return { data, error: error?.message, isLoading: data === undefined };
}

export function useUsers({ pageLimit, lastSnapDoc }) {
  const { data, error } = useSWRSubscription(
    ["users", pageLimit, lastSnapDoc],
    ([path, pageLimit, lastSnapDoc], { next }) => {
      const ref = collection(db, path);
      let q = query(
        ref, 
        orderBy("timestampCreate", "desc"),
        limit(pageLimit ?? 10)
      );

      if (lastSnapDoc) {
        q = query(
          ref,
          orderBy("timestampCreate", "desc"),
          startAfter(lastSnapDoc),
          limit(pageLimit ?? 10)
        );
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