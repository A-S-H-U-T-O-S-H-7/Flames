// Seller Permission System
// Defines all seller-specific pages, permissions and access controls

export const SELLER_PAGES = [
  {
    id: 'seller-dashboard',
    name: 'Dashboard',
    link: '/sellers/dashboard',
    icon: 'FaHome',
    description: 'Seller overview with sales metrics and alerts'
  },
  {
    id: 'seller-products',
    name: 'My Products',
    link: '/sellers/products',
    icon: 'FaBox',
    description: 'Manage your product inventory and listings'
  },
  {
    id: 'seller-orders',
    name: 'Orders',
    link: '/sellers/orders',
    icon: 'FaShoppingCart',
    description: 'View and manage orders for your products'
  },
  {
    id: 'seller-earnings',
    name: 'Earnings & Payouts',
    link: '/sellers/earnings',
    icon: 'FaRupeeSign',
    description: 'Track your earnings and payout history'
  },
  {
    id: 'seller-reviews',
    name: 'Reviews',
    link: '/sellers/reviews',
    icon: 'FaStar',
    description: 'Manage customer reviews for your products'
  },
  {
    id: 'seller-profile',
    name: 'Store Profile',
    link: '/sellers/profile',
    icon: 'FaStore',
    description: 'Manage your store information and branding'
  },
  {
    id: 'seller-messages',
    name: 'Messages',
    link: '/sellers/messages',
    icon: 'FaEnvelope',
    description: 'Customer queries and communications'
  },
  {
    id: 'seller-settings',
    name: 'Settings',
    link: '/sellers/settings',
    icon: 'FaCog',
    description: 'Account settings and preferences'
  }
];

/**
 * Check if a seller has permission to access a specific resource
 * @param {Object} adminData - Admin user object with role and seller info
 * @param {string} resourceSellerId - ID of the seller who owns the resource
 * @returns {boolean} - True if seller can access, false otherwise
 */
export const canSellerAccess = (adminData, resourceSellerId) => {
  if (!adminData) return false;
  
  // Super admin and admin can access all seller data
  if (adminData.role === 'super_admin' || adminData.role === 'admin') {
    return true;
  }
  
  // Sellers can only access their own data
  if (adminData.role === 'seller') {
    return adminData.id === resourceSellerId;
  }
  
  return false;
};

/**
 * Get filtered pages based on seller permissions
 * @param {Object} adminData - Admin user object
 * @returns {Array} - Array of pages the seller can access
 */
export const getSellerAccessiblePages = (adminData) => {
  if (!adminData || adminData.role !== 'seller') return [];
  
  return SELLER_PAGES;
};

/**
 * Validate seller operation and throw error if unauthorized
 * @param {Object} adminData - Current user data
 * @param {string} resourceSellerId - Seller ID being accessed
 * @throws {Error} - If access is denied
 */
export const validateSellerAccess = (adminData, resourceSellerId) => {
  if (!canSellerAccess(adminData, resourceSellerId)) {
    throw new Error('Access denied: Cannot access other seller\'s data');
  }
  return true;
};

/**
 * Get seller ID from admin data
 * @param {Object} adminData - Admin user object
 * @returns {string|null} - Seller ID if user is seller, null otherwise
 */
export const getSellerIdFromAdmin = (adminData) => {
  if (!adminData || adminData.role !== 'seller') return null;
  return adminData.id;
};

/**
 * Check if user should see seller interface
 * @param {Object} adminData - Admin user object
 * @returns {boolean} - True if user should use seller interface
 */
export const shouldUseSellersInterface = (adminData) => {
  return adminData && adminData.role === 'seller';
};