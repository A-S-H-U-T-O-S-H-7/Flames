// Utility to refresh seller snapshots in products
// Use this when seller business information is updated

import { db } from "../firebase";
import { collection, query, where, getDocs, doc, updateDoc, Timestamp } from "firebase/firestore";
import { getSellerById } from "../sellers/read";

/**
 * Update seller snapshot in all products for a specific seller
 * Use this when seller business info changes (name, business details, etc.)
 */
export const updateSellerSnapshotInProducts = async (sellerId) => {
  try {
    if (!sellerId) {
      throw new Error("Seller ID is required");
    }

    // Fetch latest seller data
    const sellerResult = await getSellerById(sellerId);
    if (!sellerResult.success || !sellerResult.data) {
      throw new Error("Seller not found");
    }

    const seller = sellerResult.data;
    
    // Create updated snapshot
    const updatedSnapshot = {
      businessName: seller.businessInfo?.businessName || '',
      sellerName: seller.personalInfo?.fullName || '',
      businessType: seller.businessInfo?.businessType || '',
      email: seller.personalInfo?.email || '',
      phone: seller.personalInfo?.phone || '',
      isKycVerified: seller.status === 'approved',
      snapshotAt: new Date().toISOString()
    };

    // Query all products by this seller
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("sellerId", "==", sellerId));
    const querySnapshot = await getDocs(q);

    console.log(`Found ${querySnapshot.size} products for seller ${sellerId}`);

    // Update each product with new snapshot
    const updatePromises = [];
    querySnapshot.forEach((productDoc) => {
      const productRef = doc(db, "products", productDoc.id);
      updatePromises.push(
        updateDoc(productRef, {
          sellerSnapshot: updatedSnapshot,
          sellerBusinessName: updatedSnapshot.businessName,
          sellerName: updatedSnapshot.sellerName,
          timestampUpdate: Timestamp.now()
        })
      );
    });

    await Promise.all(updatePromises);

    console.log(`Successfully updated ${updatePromises.length} products with new seller snapshot`);

    return {
      success: true,
      productsUpdated: updatePromises.length,
      snapshot: updatedSnapshot
    };

  } catch (error) {
    console.error("Error updating seller snapshots:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Batch update seller snapshots for multiple sellers
 * Useful for initial migration or bulk updates
 */
export const batchUpdateSellerSnapshots = async (sellerIds = []) => {
  try {
    const results = [];
    
    for (const sellerId of sellerIds) {
      console.log(`Updating snapshots for seller: ${sellerId}`);
      const result = await updateSellerSnapshotInProducts(sellerId);
      results.push({
        sellerId,
        ...result
      });
      
      // Add small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const totalUpdated = results.reduce((sum, r) => sum + (r.productsUpdated || 0), 0);
    const failures = results.filter(r => !r.success);

    return {
      success: failures.length === 0,
      totalSellers: sellerIds.length,
      totalProductsUpdated: totalUpdated,
      results,
      failures: failures.length > 0 ? failures : undefined
    };

  } catch (error) {
    console.error("Error in batch update:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update all products that are missing seller snapshots
 * One-time migration utility
 */
export const migrateProductsWithoutSnapshots = async () => {
  try {
    // Get all products with sellerId but no sellerSnapshot
    const productsRef = collection(db, "products");
    const allProductsQuery = query(productsRef);
    const querySnapshot = await getDocs(allProductsQuery);

    const sellersToUpdate = new Set();
    
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      // Check if product has seller but no snapshot
      if (product.sellerId && !product.sellerSnapshot) {
        sellersToUpdate.add(product.sellerId);
      }
    });

    console.log(`Found ${sellersToUpdate.size} sellers with products missing snapshots`);

    if (sellersToUpdate.size === 0) {
      return {
        success: true,
        message: "All products already have seller snapshots"
      };
    }

    // Update snapshots for these sellers
    const result = await batchUpdateSellerSnapshots(Array.from(sellersToUpdate));

    return {
      success: result.success,
      message: `Migration complete. Updated ${result.totalProductsUpdated} products for ${result.totalSellers} sellers`,
      details: result
    };

  } catch (error) {
    console.error("Error in migration:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
