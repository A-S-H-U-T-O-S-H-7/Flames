import { db, storage } from "../firebase";
import { ROLES, DEFAULT_ROLE_PERMISSIONS } from "@/lib/permissions/adminPermissions";

import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const createNewAdmin = async ({ data, image }) => {
  if (!image) {
    throw new Error("Image is Required");
  }
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.email) {
    throw new Error("Email is required");
  }
  if (!data?.role) {
    throw new Error("Role is required");
  }
  
  const newId = data?.email;
  const imageRef = ref(storage, `admins/${newId}`);
  await uploadBytes(imageRef, image);
  const imageURL = await getDownloadURL(imageRef);

  // Set default permissions based on role if not provided
  const permissions = data?.permissions || DEFAULT_ROLE_PERMISSIONS[data.role] || [];

  await setDoc(doc(db, `admins/${newId}`), {
    ...data,
    id: newId,
    imageURL: imageURL,
    role: data.role,
    permissions: permissions,
    timestampCreate: Timestamp.now(),
  });
};

export const updateAdmin = async ({ data, image }) => {
  if (!data?.name) {
    throw new Error("Name is required");
  }
 
  if (!data?.id) {
    throw new Error("ID is required");
  } 
  if (!data?.email) {
    throw new Error("Email is required");
  }
  if (!data?.role) {
    throw new Error("Role is required");
  }
  const id = data?.id;

  let imageURL = data?.imageURL;

  if (image) {
    const imageRef = ref(storage, `admins/${id}`);
    await uploadBytes(imageRef, image);
    imageURL = await getDownloadURL(imageRef);
  }

  // Ensure permissions are set based on role if not provided
  const permissions = data?.permissions || DEFAULT_ROLE_PERMISSIONS[data.role] || [];

if(id===data?.email){
  await updateDoc(doc(db, `admins/${id}`), {
    ...data,
    imageURL: imageURL,
    role: data.role,
    permissions: permissions,
    timestampUpdate: Timestamp.now(),
  });
  }else{
    const newId = data?.email
    await deleteDoc(doc(db, `admins/${id}`));

    await setDoc(doc(db, `admins/${newId}`), {
      ...data,
      id:newId,
      imageURL: imageURL,
      role: data.role,
      permissions: permissions,
      timestampUpdate: Timestamp.now(),
    });

  }

 
};

export const deleteAdmin = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  await deleteDoc(doc(db, `admins/${id}`));
};
