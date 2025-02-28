import { collection, doc, getDoc, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

export const getFaq = async ({ id }) => {
  const docSnap = await getDoc(doc(db, `faqs/${id}`));

  if (docSnap.exists()) {
    const data = docSnap.data();

    return {
      ...data,
      timestampCreate: data.timestampCreate instanceof Timestamp 
        ? data.timestampCreate.toDate().toISOString() 
        : data.timestampCreate || null,

      timestampUpdate: data.timestampUpdate instanceof Timestamp 
        ? data.timestampUpdate.toDate().toISOString() 
        : data.timestampUpdate || null,
    };
  } else {
    return null;
  }
};

export const getFaqs = async () => {
  const list = await getDocs(collection(db, "faqs"));

  return list.docs.map((snap) => {
    const data = snap.data();

    return {
      ...data,
      timestampCreate: data.timestampCreate instanceof Timestamp 
        ? data.timestampCreate.toDate().toISOString() 
        : data.timestampCreate || null,

      timestampUpdate: data.timestampUpdate instanceof Timestamp 
        ? data.timestampUpdate.toDate().toISOString() 
        : data.timestampUpdate || null,
    };
  });
};
