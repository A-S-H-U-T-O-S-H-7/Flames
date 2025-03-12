import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const getCollection = async ({ id }) => {
  const data = await getDoc(doc(db, `collections/${id}`));
  if (data.exists()) {
    return data.data();
  } else {
    return null;
  }
};

export const getCollections = async () => {
  const list = await getDocs(collection(db, "collections"));
  return list.docs.map((snap) => {const data = snap.data();

  return {
    ...data,
    timestampCreate: data.timestampCreate ? data.timestampCreate.toDate().toISOString() : null, 
    timestampUpdate: data.timestampUpdate ? data.timestampUpdate.toDate().toISOString() : null, 
  };
})
}

export const getShowcasedCollections = async () => {
  const q = query(
    collection(db, "collections"),
    where("isShowcased", "==", "yes")
  );
  
  const list = await getDocs(q);
  
  const result = list.docs.map((snap) => {
    const data = snap.data();
    return {
      ...data,
      id: snap.id, // Make sure ID is included
      timestampCreate: data.timestampCreate ? data.timestampCreate.toDate().toISOString() : null,
      timestampUpdate: data.timestampUpdate ? data.timestampUpdate.toDate().toISOString() : null,
    };
  });
  
  console.log("Showcased collections:", result);
  return result;
};
