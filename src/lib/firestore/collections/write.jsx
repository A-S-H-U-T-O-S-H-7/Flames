import { db,storage } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const createNewCollection = async ({ data, image, bannerImage }) => {
  if (!image) {
    throw new Error("Image is Required");
  }
  if (!bannerImage) {
    throw new Error("Banner Image is Required");
  }
  if (!data?.title) {
    throw new Error("Name is required");
  }
  if (!data?.products || data?.products?.length === 0) {
    throw new Error("Products is required");
  }
  const newId = doc(collection(db, `ids`)).id;
  
  // Upload main image
  const imageRef = ref(storage, `collections/${newId}`);
  await uploadBytes(imageRef, image);
  const imageURL = await getDownloadURL(imageRef);
  
  // Upload banner image
  const bannerImageRef = ref(storage, `collections/${newId}_banner`);
  await uploadBytes(bannerImageRef, bannerImage);
  const bannerImageURL = await getDownloadURL(bannerImageRef);

  await setDoc(doc(db, `collections/${newId}`), {
    ...data,
    id: newId,
    imageURL: imageURL,
    bannerImageURL: bannerImageURL,
    timestampCreate: Timestamp.now(),
  });
};

export const updateCollection = async ({ data, image, bannerImage }) => {
  if (!data?.title) {
    throw new Error("Name is required");
  }
  if (!data?.products || data?.products?.length === 0) {
    throw new Error("Products is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }

  const id = data?.id;

  let imageURL = data?.imageURL;
  let bannerImageURL = data?.bannerImageURL;

  if (image) {
    const imageRef = ref(storage, `collections/${id}`);
    await uploadBytes(imageRef, image);
    imageURL = await getDownloadURL(imageRef);
  }
  
  if (bannerImage) {
    const bannerImageRef = ref(storage, `collections/${id}_banner`);
    await uploadBytes(bannerImageRef, bannerImage);
    bannerImageURL = await getDownloadURL(bannerImageRef);
  }

  await updateDoc(doc(db, `collections/${id}`), {
    ...data,
    imageURL: imageURL,
    bannerImageURL: bannerImageURL,
    timestampUpdate: Timestamp.now(),
  });
};

export const deleteCollection = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  await deleteDoc(doc(db, `collections/${id}`));
};