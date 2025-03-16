import { db } from "../firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export const getCategory = async ({ id }) => {
  const data = await getDoc(doc(db, `categories/${id}`));
  if (data.exists()) {
    const categoryData = data.data();
    // Convert Firestore Timestamp to plain object
    return JSON.parse(JSON.stringify(categoryData));
  } else {
    return null;
  }
};

export const getCategories = async () => {
  const list = await getDocs(collection(db, "categories"));
  return list.docs.map((snap) => {
    const data = snap.data();
    // Convert Firestore Timestamp to plain object
    return JSON.parse(JSON.stringify(data));
  });
};