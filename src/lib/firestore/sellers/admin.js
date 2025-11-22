"use client";

import { db, storage } from "../firebase";
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  Timestamp,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import useSWRSubscription from "swr/subscription";

/**
 * Hook to get all sellers for admin management
 */
export function useAllSellers({ pageLimit = 10, lastSnapDoc, status = null }) {
  const { data, error } = useSWRSubscription(
    ["all-sellers", pageLimit, lastSnapDoc, status],
    ([path, pageLimit, lastSnapDoc, status], { next }) => {
      const ref = collection(db, "admins");
      let q = query(
        ref,
        where("role", "==", "seller"),
        orderBy("timestampCreate", "desc"),
        limit(pageLimit)
      );

      if (lastSnapDoc) {
        q = query(q, startAfter(lastSnapDoc));
      }

      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(null, {
            list:
              snapshot.docs.length === 0
                ? []
                : snapshot.docs.map((snap) => snap.data()),
            lastSnapDoc:
              snapshot.docs.length === 0
                ? null
                : snapshot.docs[snapshot.docs.length - 1],
          }),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return {
    data: data?.list,
    lastSnapDoc: data?.lastSnapDoc,
    error: error?.message,
    isLoading: data === undefined,
  };
}

/**
 * Hook to get seller profiles (extended seller data)
 */
export function useSellerProfiles({ pageLimit = 10, lastSnapDoc, status = null }) {
  const { data, error } = useSWRSubscription(
    ["seller-profiles", pageLimit, lastSnapDoc, status],
    ([path, pageLimit, lastSnapDoc, status], { next }) => {
      const ref = collection(db, "sellers");
      let q = query(
        ref,
        orderBy("createdAt", "desc"),
        limit(pageLimit)
      );

      if (status) {
        // Avoid composite index requirement: filter by status only, without orderBy
        // Sorting will be by document ID; we still paginate with startAfter
        q = query(
          ref,
          where("status", "==", status),
          limit(pageLimit)
        );
      }

      if (lastSnapDoc) {
        q = query(q, startAfter(lastSnapDoc));
      }

      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(null, {
            list:
              snapshot.docs.length === 0
                ? []
                : snapshot.docs.map((snap) => {
                  const data = snap.data();
                  const flattened = {
                    id: data.sellerId || snap.id,
                    businessName: data.businessInfo?.businessName || 'N/A',
                    email: data.personalInfo?.email || 'N/A',
                    phone: data.personalInfo?.phone || 'N/A',
                    status: data.status || 'pending',
                    commission: data.commission ?? data.bankDetails?.platformFee ?? 10,
                    totalProducts: data.totalProducts ?? 0,
                    totalOrders: data.totalOrders ?? 0,
                    isKycVerified: Boolean(data.isKycVerified),
                    timestampCreate: data.createdAt,
                  };
                  return { ...flattened, ...data };
                }),
            lastSnapDoc:
              snapshot.docs.length === 0
                ? null
                : snapshot.docs[snapshot.docs.length - 1],
          }),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return {
    data: data?.list,
    lastSnapDoc: data?.lastSnapDoc,
    error: error?.message,
    isLoading: data === undefined,
  };
}

/**
 * Create seller profile
 */
export const createSellerProfile = async ({ sellerId, profileData, documents }) => {
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }

  // Upload documents if provided
  let uploadedDocuments = {};
  if (documents) {
    for (const [docType, file] of Object.entries(documents)) {
      if (file) {
        const docRef = ref(storage, `sellers/${sellerId}/documents/${docType}_${file.name}`);
        await uploadBytes(docRef, file);
        const url = await getDownloadURL(docRef);
        uploadedDocuments[docType] = {
          url,
          fileName: file.name,
          uploadedAt: Timestamp.now(),
          status: 'pending_review'
        };
      }
    }
  }

  const sellerProfile = {
    id: sellerId,
    ...profileData,
    documents: uploadedDocuments,
    status: 'pending', // pending, approved, rejected, suspended
    commission: profileData.commission || 10, // Default 10%
    totalEarnings: 0,
    pendingPayouts: 0,
    totalProducts: 0,
    totalOrders: 0,
    rating: 0,
    reviewCount: 0,
    isKycVerified: false,
    timestampCreate: Timestamp.now(),
    timestampUpdate: Timestamp.now()
  };

  await setDoc(doc(db, `sellers/${sellerId}`), sellerProfile);
  return sellerProfile;
};

/**
 * Update seller profile
 */
export const updateSellerProfile = async ({ sellerId, updates }) => {
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }

  const updateData = {
    ...updates,
    timestampUpdate: Timestamp.now()
  };

  await updateDoc(doc(db, `sellers/${sellerId}`), updateData);
};

/**
 * Update seller status (approve, reject, suspend)
 */
export const updateSellerStatus = async ({ sellerId, status, reason = null }) => {
  if (!sellerId || !status) {
    throw new Error("Seller ID and status are required");
  }

  const validStatuses = ['pending', 'approved', 'rejected', 'suspended'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const updateData = {
    status,
    timestampUpdate: Timestamp.now(),
    statusHistory: {
      [status]: {
        timestamp: Timestamp.now(),
        reason: reason || `Status changed to ${status}`
      }
    }
  };

  // If approving, mark as KYC verified
  if (status === 'approved') {
    updateData.isKycVerified = true;
    updateData.approvedAt = Timestamp.now();
  }

  await updateDoc(doc(db, `sellers/${sellerId}`), updateData);
  
  // Also update the admin role status if needed
  if (status === 'suspended') {
    await updateDoc(doc(db, `admins/${sellerId}`), {
      isActive: false,
      timestampUpdate: Timestamp.now()
    });
  } else if (status === 'approved') {
    await updateDoc(doc(db, `admins/${sellerId}`), {
      isActive: true,
      timestampUpdate: Timestamp.now()
    });
  }
};

/**
 * Suspend seller account with reason
 */
export const suspendSellerAccount = async (sellerId, adminId, reason = '') => {
  try {
    const sellerRef = doc(db, 'sellers', sellerId);
    
    const updateData = {
      status: 'suspended',
      'sellerCredentials.isSuspended': true,
      'sellerCredentials.suspensionReason': reason,
      'sellerCredentials.suspendedAt': serverTimestamp(),
      'sellerCredentials.suspendedBy': adminId,
      updatedAt: serverTimestamp(),
      timestampUpdate: Timestamp.now()
    };

    await updateDoc(sellerRef, updateData);

    // Also update admin collection
    await updateDoc(doc(db, 'admins', sellerId), {
      isActive: false,
      timestampUpdate: Timestamp.now()
    });

    return { success: true };
  } catch (error) {
    console.error('Error suspending seller account:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Reactivate suspended seller account
 */
export const reactivateSellerAccount = async (sellerId, adminId) => {
  try {
    const sellerRef = doc(db, 'sellers', sellerId);
    
    const updateData = {
      status: 'approved',
      'sellerCredentials.isSuspended': false,
      'sellerCredentials.suspensionReason': '',
      'sellerCredentials.suspendedAt': null,
      'sellerCredentials.suspendedBy': null,
      updatedAt: serverTimestamp(),
      timestampUpdate: Timestamp.now()
    };

    await updateDoc(sellerRef, updateData);

    // Also update admin collection
    await updateDoc(doc(db, 'admins', sellerId), {
      isActive: true,
      timestampUpdate: Timestamp.now()
    });

    return { success: true };
  } catch (error) {
    console.error('Error reactivating seller account:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update seller commission rate
 */
export const updateSellerCommission = async ({ sellerId, commission, reason = null }) => {
  if (!sellerId || commission === undefined) {
    throw new Error("Seller ID and commission are required");
  }

  if (commission < 0 || commission > 50) {
    throw new Error("Commission must be between 0% and 50%");
  }

  const updateData = {
    commission,
    timestampUpdate: Timestamp.now(),
    commissionHistory: {
      [Date.now()]: {
        commission,
        timestamp: Timestamp.now(),
        reason: reason || `Commission updated to ${commission}%`
      }
    }
  };

  await updateDoc(doc(db, `sellers/${sellerId}`), updateData);
};

/**
 * Get seller statistics for admin dashboard
 */
export const getSellerStats = async () => {
  const sellersSnapshot = await getDocs(collection(db, "sellers"));
  const sellers = sellersSnapshot.docs.map(doc => doc.data());

  const totalSellers = sellers.length;
  const activeSellers = sellers.filter(s => s.status === 'approved').length;
  const pendingSellers = sellers.filter(s => s.status === 'pending').length;
  const suspendedSellers = sellers.filter(s => s.status === 'suspended').length;

  const totalCommissionEarned = sellers.reduce((sum, seller) => {
    const commissionRate = (seller.commission ?? 10) / 100;
    return sum + ((seller.totalEarnings || 0) * commissionRate);
  }, 0);

  const averageCommission = sellers.length > 0 
    ? sellers.reduce((sum, seller) => sum + (seller.commission ?? 10), 0) / sellers.length 
    : 0;

  return {
    totalSellers,
    activeSellers,
    pendingSellers,
    suspendedSellers,
    totalCommissionEarned,
    averageCommission,
    recentSellers: sellers
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      .slice(0, 5)
  };
};

/**
 * Migrate existing sellers to have commission field from platformFee
 */
export const migrateSellerCommissions = async () => {
  try {
    console.log("Starting seller commission migration...");
    
    const sellersRef = collection(db, "sellers");
    const sellersSnapshot = await getDocs(sellersRef);
    
    let updatedCount = 0;
    const batch = writeBatch(db);
    
    sellersSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      
      // Only update if commission field doesn't exist but platformFee does
      if (!data.commission && data.bankDetails?.platformFee) {
        const commissionValue = parseFloat(data.bankDetails.platformFee) || 10;
        batch.update(doc.ref, { commission: commissionValue });
        updatedCount++;
        console.log(`Updating seller ${doc.id}: commission = ${commissionValue}%`);
      }
    });
    
    if (updatedCount > 0) {
      await batch.commit();
      console.log(`Migration completed: ${updatedCount} sellers updated`);
      return { success: true, updatedCount };
    } else {
      console.log("No sellers needed migration");
      return { success: true, updatedCount: 0 };
    }
  } catch (error) {
    console.error("Error during seller commission migration:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get detailed seller analytics
 */
export const getSellerAnalytics = async (sellerId) => {
  console.log("getSellerAnalytics called with sellerId:", sellerId);
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }

  let seller, products, orders;

  try {
    // Get seller profile
    console.log("Fetching seller profile...");
    const sellerDoc = await getDoc(doc(db, `sellers/${sellerId}`));
    seller = sellerDoc.data();
    console.log("Seller profile fetched:", seller ? "success" : "not found");

    // Get seller's products (limit to 100 for performance)
    console.log("Fetching seller products...");
    const productsQuery = query(
      collection(db, "products"),
      where("sellerId", "==", sellerId),
      limit(100)
    );
    const productsSnapshot = await getDocs(productsQuery);
    products = productsSnapshot.docs.map(doc => doc.data());
    console.log("Products fetched:", products.length);

    // Get seller's orders (limit to 50 recent orders for performance)
    console.log("Fetching seller orders...");
    const ordersQuery = query(
      collection(db, "orders"),
      where("sellerId", "==", sellerId),
      limit(50)
    );
    const ordersSnapshot = await getDocs(ordersQuery);
    orders = ordersSnapshot.docs.map(doc => doc.data())
      .sort((a, b) => (b.timestampCreate?.seconds || 0) - (a.timestampCreate?.seconds || 0));
    console.log("Orders fetched:", orders.length);
  } catch (error) {
    console.error("Error in getSellerAnalytics:", error);
    throw error;
  }

  // Calculate metrics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.stock > 0).length;
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);
  
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const commissionEarned = totalRevenue * ((seller?.commission ?? 10) / 100);

  // Order status breakdown
  const ordersByStatus = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  // Top products
  const topProducts = products
    .sort((a, b) => (b.orders || 0) - (a.orders || 0))
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      title: p.title,
      orders: p.orders || 0,
      revenue: (p.orders || 0) * (p.salePrice || 0)
    }));

  return {
    seller,
    totalProducts,
    activeProducts,
    totalOrders,
    totalRevenue,
    avgOrderValue,
    commissionEarned,
    ordersByStatus,
    topProducts,
    products,
    orders
  };
};

/**
 * Bulk update seller commissions
 */
export const bulkUpdateCommissions = async (updates) => {
  const batch = [];
  
  for (const update of updates) {
    const { sellerId, commission, reason } = update;
    batch.push(
      updateSellerCommission({ sellerId, commission, reason })
    );
  }

  await Promise.all(batch);
};

/**
 * Export sellers data to CSV format
 */
export const exportSellersData = async () => {
  const sellersSnapshot = await getDocs(collection(db, "sellers"));
  const sellers = sellersSnapshot.docs.map(doc => doc.data());

  if (!sellers || sellers.length === 0) {
    return [{ 'Info': 'No sellers found' }];
  }

  const csvData = sellers.map(seller => ({
    'Seller ID': seller.sellerId || seller.id,
    'Business Name': seller.businessInfo?.businessName || seller.businessName || 'N/A',
    'Email': seller.personalInfo?.email || seller.email || 'N/A',
    'Status': seller.status,
    'Commission (%)': seller.commission ?? 10,
    'Total Earnings': seller.totalEarnings || 0,
    'Total Products': seller.totalProducts || 0,
    'Total Orders': seller.totalOrders || 0,
    'KYC Status': seller.isKycVerified ? 'Verified' : 'Pending',
    'Joined Date': seller.createdAt?.toDate?.().toLocaleDateString?.() || 'N/A',
    'Last Updated': seller.updatedAt?.toDate?.().toLocaleDateString?.() || seller.timestampUpdate?.toDate?.().toLocaleDateString?.() || 'N/A'
  }));

  return csvData;
};