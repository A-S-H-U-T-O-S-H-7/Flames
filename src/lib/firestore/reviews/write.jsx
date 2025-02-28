// write.jsx
import { updateDoc,deleteDoc, doc, setDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase";

// Initialize storage
const storage = getStorage();

export const addReview = async ({
  uid,
  rating,
  message,
  productId,
  displayName,
  photoURL,
  reviewPhoto
}) => {
  let reviewPhotoURL = null;
  
  // Upload image if provided
  if (reviewPhoto) {
    const imageRef = ref(storage, `reviews/${productId}/${uid}/${reviewPhoto.name}`);
    await uploadBytes(imageRef, reviewPhoto);
    reviewPhotoURL = await getDownloadURL(imageRef);
  }

  const reviewRef = doc(db, `products/${productId}/reviews/${uid}`);
  await setDoc(reviewRef, {
    rating: rating ?? "",
    message: message ?? "",
    productId: productId ?? "",
    uid: uid ?? "",
    displayName: displayName ?? "",
    photoURL: photoURL ?? "",
    reviewPhotoURL,
    timestamp: Timestamp.now(),
  });
};

export const deleteReview = async ({ productId, uid }) => {
  await deleteDoc(doc(db, `products/${productId}/reviews/${uid}`));
};

export const updateReview = async ({ uid, productId, message,reviewPhotoURL, isShowcased }) => {
  const ref = doc(db, `products/${productId}/reviews/${uid}`);
  await updateDoc(ref, {
    message,
    reviewPhotoURL,
    isShowcased,
    lastUpdated: Timestamp.now()
  });
};