import { db, storage } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";

/**
 * Create a new banner with image upload
 */
export const createNewBanner = async ({ data, image }) => {
  try {
    // Validation
    if (!image) throw new Error("Image is required.");
    if (!data?.title) throw new Error("Title is required.");
    if (!data?.subtitle) throw new Error("Subtitle is required.");
    if (!data?.buttontext) throw new Error("Button text is required.");

    // Generate unique ID for the new banner
    const newId = doc(collection(db, "banners")).id;

    // Upload image to Firebase Storage
    const imageRef = ref(storage, `banners/${newId}`);
    await uploadBytes(imageRef, image);
    const imageURL = await getDownloadURL(imageRef);

    // Save banner data in Firestore
    await setDoc(doc(db, `banners/${newId}`), {
      ...data,
      id: newId,
      imageURL,
      timestampCreate: Timestamp.now(),
    });

    return { success: true, id: newId };
  } catch (error) {
    console.error("Error creating banner:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Update an existing banner with optional image replacement
 */
export const updateBanner = async ({ data, image }) => {
  try {
    if (!data?.id) throw new Error("Banner ID is required.");
    if (!data?.title) throw new Error("Title is required.");
    if (!data?.subtitle) throw new Error("Subtitle is required.");
    if (!data?.buttontext) throw new Error("Button text is required.");

    const id = data.id;
    const bannerRef = doc(db, `banners/${id}`);
    const bannerSnap = await getDoc(bannerRef);

    if (!bannerSnap.exists()) {
      throw new Error("Banner not found.");
    }

    let imageURL = data?.imageURL;

    if (image) {
      // Delete the old image if it exists
      if (imageURL) {
        const oldImageRef = ref(storage, imageURL);
        await deleteObject(oldImageRef).catch((err) =>
          console.warn("Failed to delete old image:", err)
        );
      }

      // Upload the new image
      const newImageRef = ref(storage, `banners/${id}`);
      await uploadBytes(newImageRef, image);
      imageURL = await getDownloadURL(newImageRef);
    }

    // Update Firestore document
    await updateDoc(bannerRef, {
      ...data,
      imageURL,
      timestampUpdate: Timestamp.now(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating banner:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a banner and its image from Firebase
 */
export const deleteBanner = async ({ id }) => {
  try {
    if (!id) throw new Error("Banner ID is required.");

    const bannerRef = doc(db, `banners/${id}`);
    const bannerSnap = await getDoc(bannerRef);

    if (!bannerSnap.exists()) {
      throw new Error("Banner not found.");
    }

    const bannerData = bannerSnap.data();
    const imageURL = bannerData.imageURL;

    // Delete Firestore document
    await deleteDoc(bannerRef);

    // Delete image from Firebase Storage if it exists
    if (imageURL) {
      const imageRef = ref(storage, imageURL);
      await deleteObject(imageRef).catch((err) =>
        console.warn("Failed to delete image:", err)
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting banner:", error);
    return { success: false, error: error.message };
  }
};
