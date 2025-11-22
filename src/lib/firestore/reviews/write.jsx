import { db, storage } from "../firebase";
import { 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  Timestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export const addReview = async ({
  uid,
  rating,
  message,
  productId,
  displayName,
  photoURL,
  reviewPhoto
}) => {
  try {
    let reviewPhotoURL = null;
    
    if (reviewPhoto) {
      const imageRef = ref(storage, `reviews/${productId}/${uid}/${reviewPhoto.name}`);
      await uploadBytes(imageRef, reviewPhoto);
      reviewPhotoURL = await getDownloadURL(imageRef);
    }

    // 🔥 GET PRODUCT DETAILS FOR SELLER INFO (ENHANCED)
    let sellerId = null;
    let sellerBusinessName = null;
    let productName = null;
    
    try {
      const productDoc = await getDoc(doc(db, `products/${productId}`));
      if (productDoc.exists()) {
        const productData = productDoc.data();
        sellerId = productData?.sellerId || 'admin';
        sellerBusinessName = productData?.sellerBusinessName || 
                           productData?.sellerSnapshot?.businessName || 
                           'Platform';
        productName = productData?.title || 'Product';
        
        console.log('📝 Review - Product details:', {
          productId,
          sellerId,
          sellerBusinessName,
          productName
        });
      }
    } catch (error) {
      console.warn('Could not fetch product details:', error);
      // Set defaults if product fetch fails
      sellerId = 'admin';
      sellerBusinessName = 'Platform';
      productName = 'Product';
    }

    const reviewData = {
      // Review content
      rating: rating ?? 0,
      message: message ?? "",
      
      // User information
      uid: uid ?? "",
      displayName: displayName ?? "Customer",
      photoURL: photoURL ?? "",
      
      // Product information
      productId: productId ?? "",
      productName: productName,
      
      // Media
      reviewPhotoURL,
      
      // Timestamps
      timestamp: Timestamp.now(),
      lastUpdated: Timestamp.now(),
      
      // Default values
      isShowcased: false,
      sellerReply: "",
      
      // 🔥 SELLER INFORMATION (CRITICAL - This enables notifications)
      sellerId: sellerId,
      sellerBusinessName: sellerBusinessName
    };

    console.log('📝 Creating review with seller data:', reviewData);

    const reviewRef = doc(db, `products/${productId}/reviews/${uid}`);
    await setDoc(reviewRef, reviewData);

    return { success: true, reviewId: `${productId}_${uid}` };
    
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

/**
 * Update an existing review
 */
export const updateReview = async ({
  uid,
  productId,
  message,
  isShowcased,
  sellerReply,
  reviewPhotoURL
}) => {
  try {
    const reviewRef = doc(db, `products/${productId}/reviews/${uid}`);
    
    const updateData = {
      lastUpdated: Timestamp.now()
    };
    
    if (message !== undefined) updateData.message = message;
    if (isShowcased !== undefined) updateData.isShowcased = isShowcased;
    if (sellerReply !== undefined) updateData.sellerReply = sellerReply;
    if (reviewPhotoURL !== undefined) updateData.reviewPhotoURL = reviewPhotoURL;
    
    await updateDoc(reviewRef, updateData);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

/**
 * Delete a review
 */
export const deleteReview = async ({ uid, productId }) => {
  try {
    if (!uid || !productId) {
      throw new Error('uid and productId are required');
    }
    
    const reviewRef = doc(db, `products/${productId}/reviews/${uid}`);
    
    // Get review data to check for images
    const reviewDoc = await getDoc(reviewRef);
    
    if (reviewDoc.exists()) {
      const reviewData = reviewDoc.data();
      
      // Delete review image from storage if exists
      if (reviewData.reviewPhotoURL) {
        try {
          const imageRef = ref(storage, `reviews/${productId}/${uid}`);
          await deleteObject(imageRef);
        } catch (error) {
          console.warn('Could not delete review image:', error);
        }
      }
    }
    
    // Delete the review document
    await deleteDoc(reviewRef);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};
