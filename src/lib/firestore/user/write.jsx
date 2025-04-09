import { db } from "../firebase";
import { doc, setDoc,updateDoc, Timestamp } from "firebase/firestore";

export const createUser = async ({ uid, displayName, photoURL, email, dateOfBirth }) => {
  await setDoc(
    doc(db, `users/${uid}`),
    {
      displayName: displayName,
      email: email,
      photoURL: photoURL ?? "",
      dateOfBirth: dateOfBirth || null,
      timestampCreate: Timestamp.now(),
    },
    { merge: true }
  );
};

export const updateUser = async ({ uid, displayName, photoURL, email, dateOfBirth }) => {
  await updateDoc(
    doc(db, `users/${uid}`),
    {
      displayName: displayName,
      email: email,
      photoURL: photoURL ?? "",
      dateOfBirth: dateOfBirth || null,
      timestampUpdate: Timestamp.now(),
    }
  );
};


export const updateFavorites = async ({ uid, list }) => {
  await setDoc(
    doc(db, `users/${uid}`),
    {
      favorites: list,
    },
    {
      merge: true,
    }
  );
};

export const updateCarts = async ({ uid, list }) => {
  await setDoc(
    doc(db, `users/${uid}`),
    {
      carts: list,
    },
    {
      merge: true,
    }
  );
};