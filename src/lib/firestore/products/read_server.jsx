// lib/firestore/products/read_server.js - UPDATED
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

export const getProduct = async ({ id, sellerId = null }) => {
  const data = await getDoc(doc(db, `products/${id}`));
  if (data.exists()) {
    const product = serializeProduct({ id: data.id, ...data.data() });
    // Verify ownership if sellerId is provided
    if (sellerId && product.sellerId !== sellerId) {
      return null;
    }
    return product;
  } else {
    return null;
  }
};

export const getFeaturedProducts = async ({ sellerId = null } = {}) => {
  let q = query(collection(db, "products"), where("isFeatured", "==", true));
  
  if (sellerId) {
    q = query(q, where("sellerId", "==", sellerId));
  }
  
  const list = await getDocs(q);
  return list.docs.map(snap => serializeProduct({ id: snap.id, ...snap.data() }));
};

export const getNewArrivalProducts = async ({ sellerId = null } = {}) => {
  let q = query(collection(db, "products"), where("isNewArrival", "==", true));
  
  if (sellerId) {
    q = query(q, where("sellerId", "==", sellerId));
  }
  
  const list = await getDocs(q);
  return list.docs.map(snap => serializeProduct({ id: snap.id, ...snap.data() }));
};

export const getProducts = async ({ sellerId = null } = {}) => {
  let q = query(collection(db, "products"), orderBy("timestampCreate", "desc"));
  
  if (sellerId) {
    q = query(q, where("sellerId", "==", sellerId));
  }
  
  const list = await getDocs(q);
  return list.docs.map(snap => serializeProduct({ id: snap.id, ...snap.data() }));
};

export const getProductsByCategory = async ({ categoryId, sellerId = null }) => {
  let q = query(
    collection(db, "products"),
    orderBy("timestampCreate", "desc"),
    where("categoryId", "==", categoryId)
  );
  
  if (sellerId) {
    q = query(q, where("sellerId", "==", sellerId));
  }
  
  const list = await getDocs(q);
  return list.docs.map(snap => serializeProduct({ id: snap.id, ...snap.data() }));
};

// New function to get seller's products
export const getSellerProducts = async (sellerId) => {
  const q = query(
    collection(db, "products"),
    where("sellerId", "==", sellerId),
    orderBy("timestampCreate", "desc")
  );
  
  const list = await getDocs(q);
  return list.docs.map(snap => serializeProduct({ id: snap.id, ...snap.data() }));
};

// New function to get all sellers for admin
export const getAllSellers = async () => {
  const q = query(collection(db, "sellers"), where("status", "==", "approved"));
  const list = await getDocs(q);
  return list.docs.map(snap => ({ id: snap.id, ...snap.data() }));
};