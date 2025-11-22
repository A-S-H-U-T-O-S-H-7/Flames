import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export const createNewFaq = async ({ data }) => {
  
  if (!data?.faqType) {
    throw new Error("FAQ Type is required");
  }
  if (!data?.faq) {
    throw new Error("Faq is required");
  }
  if (!data?.answer) {
    throw new Error("Answer is required");
  }
  
  const newId = doc(collection(db, `ids`)).id;

  await setDoc(doc(db, `faqs/${newId}`), {
    ...data,
    id: newId,
    timestampCreate: Timestamp.now(),
  });
};

export const updateFaq = async ({ data }) => {
  if (!data?.faqType) {
    throw new Error("FAQ Type is required");
  }
  if (!data?.faq) {
    throw new Error("Faq is required");
  }
  if (!data?.answer) {
    throw new Error("Answer is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }
  
  const id = data?.id;

  await updateDoc(doc(db, `faqs/${id}`), {
    ...data,
    timestampUpdate: Timestamp.now(),
  });
};

export const deleteFaq = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  await deleteDoc(doc(db, `faqs/${id}`));
};