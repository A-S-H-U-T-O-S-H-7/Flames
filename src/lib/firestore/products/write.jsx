// lib/firestore/products/write.js - CORRECTED
import { db, storage } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getSellerById } from "../sellers/read";

// Helper function to create seller snapshot
const createSellerSnapshot = async (sellerId) => {
  if (!sellerId) return null;
  
  try {
    const sellerResult = await getSellerById(sellerId);
    if (!sellerResult.success || !sellerResult.data) {
      console.warn('Could not fetch seller data for snapshot');
      return null;
    }
    
    const seller = sellerResult.data;
    return {
      businessName: seller.businessInfo?.businessName || '',
      sellerName: seller.personalInfo?.fullName || '',
      businessType: seller.businessInfo?.businessType || '',
      email: seller.personalInfo?.email || '',
      phone: seller.personalInfo?.phone || '',
      isKycVerified: seller.status === 'approved',
      snapshotAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating seller snapshot:', error);
    return null;
  }
};

// Enhanced create product with seller support and variations
export const createNewProduct = async ({ data, featureImage, imageList, sellerId = null }) => {
  if (!data?.title) {
    throw new Error("Title is required");
  }
  if (!featureImage) {
    throw new Error("Feature Image is required");
  }

  // Fetch seller snapshot if sellerId is provided
  let sellerSnapshot = null;
  let sellerBusinessName = '';
  let sellerName = '';
  
  if (sellerId) {
    sellerSnapshot = await createSellerSnapshot(sellerId);
    if (sellerSnapshot) {
      sellerBusinessName = sellerSnapshot.businessName;
      sellerName = sellerSnapshot.sellerName;
    }
  }

  // Determine storage path based on seller or admin
  const storagePath = sellerId ? `sellers/${sellerId}/products` : `products`;
  
  // Upload feature image
  const featureImageRef = ref(storage, `${storagePath}/${Date.now()}_${featureImage?.name}`);
  await uploadBytes(featureImageRef, featureImage);
  const featureImageURL = await getDownloadURL(featureImageRef);

  // Upload gallery images
  let imageURLList = [];
  for (let i = 0; i < imageList?.length; i++) {
    const image = imageList[i];
    const imageRef = ref(storage, `${storagePath}/gallery/${Date.now()}_${image?.name}`);
    await uploadBytes(imageRef, image);
    const url = await getDownloadURL(imageRef);
    imageURLList.push(url);
  }

  const newId = doc(collection(db, `ids`)).id;

  // Enhanced product data with seller info and variations
  const productData = {
    // Basic details
    title: data.title,
    shortDescription: data.shortDescription,
    description: data.description,
    categoryId: data.category,
    brandId: data.brandId,
    
    // Pricing
    price: parseFloat(data.price) || 0,
    salePrice: parseFloat(data.salePrice) || 0,
    
    // Inventory
    stock: parseInt(data.stock) || 0,
    sku: data.sku,
    
    // Features
    isFeatured: Boolean(data.isFeatured),
    isNewArrival: Boolean(data.isNewArrival),
    
    // Seller specific fields
    sellerSku: data.sellerSku || '',
    handlingTime: parseInt(data.handlingTime) || 1,
    shippingProfile: data.shippingProfile || 'standard',
    returnPolicy: data.returnPolicy || 'seller',
    warranty: data.warranty || { hasWarranty: false, duration: 0, type: 'seller' },
    
    // Variations
    variations: data.variations || [],
    
    // Images
    featureImageURL: featureImageURL,
    imageList: imageURLList,
    
    // System fields
    id: newId,
    orders: 0,
    timestampCreate: Timestamp.now(),
    
    // Seller information
    ...(sellerId && { 
      sellerId: sellerId,
      addedBy: 'seller',
      // Seller snapshot for optimized order queries
      ...(sellerSnapshot && {
        sellerSnapshot: sellerSnapshot,
        sellerBusinessName: sellerBusinessName,
        sellerName: sellerName
      })
    }),
    ...(!sellerId && { 
      addedBy: 'admin'
    })
  };

  await setDoc(doc(db, `products/${newId}`), productData);
  
  return { success: true, productId: newId };
};

// Enhanced update product with seller validation and variations
export const updateProduct = async ({ id, data, featureImage, imageList, sellerId = null }) => {
  if (!data?.title) {
    throw new Error("Title is required");
  }
  if (!id) {
    throw new Error("ID is required");
  }

  console.log('🔄 Update Product Debug:', { id, sellerId, data });

  // Fetch current product and verify ownership
  const productRef = doc(db, "products", id);
  const productSnap = await getDoc(productRef);
  
  if (!productSnap.exists()) {
    throw new Error("Product not found");
  }
  
  const currentProduct = productSnap.data();
  
  // Verify ownership if seller is provided
  if (sellerId && currentProduct.sellerId !== sellerId) {
    throw new Error("Access denied - product does not belong to this seller");
  }
  
  // Update seller snapshot if seller product (keep existing snapshot structure)
  let sellerSnapshot = currentProduct.sellerSnapshot || null;
  let sellerBusinessName = currentProduct.sellerBusinessName || '';
  let sellerName = currentProduct.sellerName || '';
  
  // Only update snapshot if it doesn't exist yet
  if (sellerId && !sellerSnapshot) {
    const newSnapshot = await createSellerSnapshot(sellerId);
    if (newSnapshot) {
      sellerSnapshot = newSnapshot;
      sellerBusinessName = newSnapshot.businessName;
      sellerName = newSnapshot.sellerName;
    }
  }

  const storagePath = sellerId ? `sellers/${sellerId}/products` : `products`;
  let featureImageURL = data?.existingFeatureImage;

  // Upload new feature image if provided
  if (featureImage) {
    const featureImageRef = ref(storage, `${storagePath}/${Date.now()}_${featureImage?.name}`);
    await uploadBytes(featureImageRef, featureImage);
    featureImageURL = await getDownloadURL(featureImageRef);
  }

  // Handle gallery images - merge existing with new ones
  let imageURLList = data?.existingImages || [];
  if (imageList && imageList.length > 0) {
    for (let i = 0; i < imageList.length; i++) {
      const image = imageList[i];
      const imageRef = ref(storage, `${storagePath}/gallery/${Date.now()}_${image?.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
      imageURLList.push(url);
    }
  }

  const updateData = {
    // Basic details
    title: data.title,
    shortDescription: data.shortDescription,
    description: data.description,
    categoryId: data.category,
    brandId: data.brandId,
    
    // Pricing
    price: parseFloat(data.price) || 0,
    salePrice: parseFloat(data.salePrice) || 0,
    
    // Inventory
    stock: parseInt(data.stock) || 0,
    sku: data.sku,
    
    // Features
    isFeatured: Boolean(data.isFeatured),
    isNewArrival: Boolean(data.isNewArrival),
    
    // Seller specific fields
    sellerSku: data.sellerSku || '',
    handlingTime: parseInt(data.handlingTime) || 1,
    shippingProfile: data.shippingProfile || 'standard',
    returnPolicy: data.returnPolicy || 'seller',
    warranty: data.warranty || { hasWarranty: false, duration: 0, type: 'seller' },
    
    // Variations
    variations: data.variations || [],
    
    // Images
    ...(featureImageURL && { featureImageURL }),
    imageList: imageURLList,
    
    // Seller snapshot (preserve or add if missing)
    ...(sellerSnapshot && {
      sellerSnapshot: sellerSnapshot,
      sellerBusinessName: sellerBusinessName,
      sellerName: sellerName
    }),
    
    // System fields
    timestampUpdate: Timestamp.now(),
  };

  console.log('📝 Final update data:', updateData);

  await setDoc(doc(db, `products/${id}`), updateData, { merge: true });
  
  return { success: true, productId: id };
};

// Keep delete operations as they are (they're correct)
export const deleteProduct = async ({ id, sellerId = null }) => {
  if (!id) {
    throw new Error("ID is required");
  }

  if (sellerId) {
   const productSnap = await getDocs(
  query(collection(db, "products"), 
  where("id", "==", id), 
  where("sellerId", "==", sellerId))  
);
    if (productSnap.empty) {
      throw new Error("Product not found or access denied");
    }
  }

  await deleteDoc(doc(db, `products/${id}`));
};

// Seller-specific operations (correct)
export const createSellerProduct = async ({ data, featureImage, imageList, sellerId }) => {
  console.log('🛠️ createSellerProduct Debug:')
  console.log('Seller ID:', sellerId)
  console.log('Product data:', data)
  console.log('Feature image:', featureImage?.name)
  console.log('Gallery images:', imageList?.length)
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }
  return createNewProduct({ data, featureImage, imageList, sellerId });
};

export const updateSellerProduct = async ({ id, data, featureImage, imageList, sellerId }) => {
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }
  if (!id) {
    throw new Error("Product ID is required for update");
  }
  
  console.log('🔄 Updating product:', id)
  const result = await updateProduct({ 
    id, 
    data, 
    featureImage, 
    imageList, 
    sellerId 
  });
  console.log('✅ Product updated successfully:', result)
  return result;
};
 

export const deleteSellerProduct = async ({ id, sellerId }) => {
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }
  return deleteProduct({ id, sellerId });
};