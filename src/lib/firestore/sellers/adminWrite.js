import { updateDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { getSellerById, getSellers, getSellerStats, searchSellers } from './read';

// Re-export read functions for convenience
export { getSellerById, getSellers, getSellerStats, searchSellers };

// Update seller status
export const updateSellerStatus = async ({ sellerId, status, reason = null }) => {
  try {
    const sellerRef = doc(db, 'sellers', sellerId);
    await updateDoc(sellerRef, {
      status,
      statusReason: reason,
      statusUpdatedAt: new Date()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating seller status:', error);
    return { success: false, error: error.message };
  }
};

// Update seller commission
export const updateSellerCommission = async ({ sellerId, commission, reason = null }) => {
  try {
    const sellerRef = doc(db, 'sellers', sellerId);
    await updateDoc(sellerRef, {
      commission: parseFloat(commission),
      commissionUpdatedAt: new Date(),
      commissionUpdateReason: reason
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating seller commission:', error);
    return { success: false, error: error.message };
  }
};

// Get seller analytics
export const getSellerAnalytics = async (sellerId) => {
  try {
    // Get seller data
    const sellerResult = await getSellerById(sellerId);
    if (!sellerResult.success) {
      throw new Error(sellerResult.error);
    }

    // Get seller orders
    const ordersRef = collection(db, 'orders');
    const ordersQuery = query(ordersRef, where('sellerId', '==', sellerId));
    const ordersSnapshot = await getDocs(ordersQuery);
    
    const orders = [];
    let totalRevenue = 0;
    let commissionEarned = 0;
    const ordersByStatus = {};

    ordersSnapshot.forEach(doc => {
      const order = { id: doc.id, ...doc.data() };
      orders.push(order);
      
      // Calculate totals
      totalRevenue += order.total || 0;
      commissionEarned += order.commission || 0;
      
      // Count by status
      const status = order.status || 'pending';
      ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
    });

    return {
      seller: sellerResult.data,
      orders,
      totalOrders: orders.length,
      totalRevenue,
      commissionEarned,
      ordersByStatus
    };
  } catch (error) {
    console.error('Error getting seller analytics:', error);
    throw error;
  }
};

// Export sellers data to CSV
export const exportSellersData = async () => {
  try {
    const sellersResult = await getSellers({ pageLimit: 1000 });
    if (!sellersResult.success) {
      throw new Error(sellersResult.error);
    }

    const csvData = sellersResult.data.map(seller => ({
      id: seller.id,
      businessName: seller.businessInfo?.businessName || seller.businessName || 'N/A',
      email: seller.personalInfo?.email || seller.email || 'N/A',
      phone: seller.personalInfo?.phone || seller.phone || 'N/A',
      status: seller.status || 'pending',
      commission: seller.commission || 10,
      createdAt: seller.createdAt?.toDate?.()?.toISOString() || 'N/A',
      businessType: seller.businessInfo?.businessType || 'N/A'
    }));

    return csvData;
  } catch (error) {
    console.error('Error exporting sellers data:', error);
    throw error;
  }
};