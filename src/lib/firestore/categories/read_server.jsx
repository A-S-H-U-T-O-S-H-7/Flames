import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getCategory = async ({ id }) => {
  const docSnap = await getDoc(doc(db, `categories/${id}`));

  if (docSnap.exists()) {
    const data = docSnap.data();

    return {
      ...data,
      timestampCreate: data.timestampCreate ? data.timestampCreate.toDate().toISOString() : null,
      timestampUpdate: data.timestampUpdate ? data.timestampUpdate.toDate().toISOString() : null,
    };
  } else {
    return null;
  }
};

export const getCategories = async () => {
  const list = await getDocs(collection(db, "categories"));

  return list.docs.map((snap) => {
    const data = snap.data();

    return {
      ...data,
      timestampCreate: data.timestampCreate && typeof data.timestampCreate.toDate === 'function' 
        ? data.timestampCreate.toDate().toISOString() 
        : null, 
      timestampUpdate: data.timestampUpdate && typeof data.timestampUpdate.toDate === 'function' 
        ? data.timestampUpdate.toDate().toISOString() 
        : null, 
    };
  });
};