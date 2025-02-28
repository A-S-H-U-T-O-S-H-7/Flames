import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where
} from "firebase/firestore";

const serializeProduct = (product) => {
  return {
    ...product,
    timestampCreate: product.timestampCreate?.toDate?.() || product.timestampCreate,
    timestampUpdate: product.timestampUpdate?.toDate?.() || product.timestampUpdate
  };
};

export const getProduct = async ({ id }) => {
  const data = await getDoc(doc(db, `products/${id}`));
  if (data.exists()) {
    return serializeProduct(data.data());
  } else {
    return null;
  }
};

export const getFeaturedProducts = async () => {
  const list = await getDocs(
    query(collection(db, "products"), where("isFeatured", "==", true))
  );
  return list.docs.map(snap => serializeProduct(snap.data()));
};

export const getNewArrivalProducts = async () => {
  const list = await getDocs(
    query(collection(db, "products"), where("isNewArrival", "==", true))
  );
  return list.docs.map(snap => serializeProduct(snap.data()));
};

export const getProducts = async () => {
  const list = await getDocs(
    query(collection(db, "products"), orderBy("timestampCreate", "desc"))
  );
  return list.docs.map(snap => serializeProduct(snap.data()));
};

export const getProductsByCategory = async ({ categoryId }) => {
  const list = await getDocs(
    query(
      collection(db, "products"),
      orderBy("timestampCreate", "desc"),
      where("categoryId", "==", categoryId)
    )
  );
  return list.docs.map(snap => serializeProduct(snap.data()));
};