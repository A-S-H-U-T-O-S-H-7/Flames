// Admin Permission System
// Defines all admin pages, roles, and permission management

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  SELLER: 'seller'
};

export const ADMIN_PAGES = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    link: '/admin/dashboard',
    icon: 'FaHome',
    description: 'Main dashboard with analytics and overview'
  },
  {
    id: 'products',
    name: 'Products',
    link: '/admin/products',
    icon: 'FaBox',
    description: 'Manage products, inventory, and product details'
  },
  {
    id: 'categories',
    name: 'Categories',
    link: '/admin/categories',
    icon: 'FaTags',
    description: 'Manage product categories and subcategories'
  },
  {
    id: 'orders',
    name: 'Orders',
    link: '/admin/orders',
    icon: 'FaShoppingCart',
    description: 'View and manage customer orders'
  },
  {
    id: 'customers',
    name: 'Customers',
    link: '/admin/customers',
    icon: 'FaUsers',
    description: 'Manage customer accounts and information'
  },
  {
    id: 'collections',
    name: 'Collections',
    link: '/admin/collections',
    icon: 'FaThLarge',
    description: 'Manage product collections and showcases'
  },
  {
    id: 'reviews',
    name: 'Reviews',
    link: '/admin/reviews',
    icon: 'FaStar',
    description: 'Manage customer reviews and ratings'
  },
  {
    id: 'voice-of-customers',
    name: 'Voice Of Customers',
    link: '/admin/voice-of-customers',
    icon: 'VscFeedback',
    description: 'Customer feedback and testimonials'
  },
  {
    id: 'brands',
    name: 'Brands',
    link: '/admin/brands',
    icon: 'FaCubes',
    description: 'Manage product brands and manufacturers'
  },
  {
    id: 'faqs',
    name: 'FAQs',
    link: '/admin/faqs',
    icon: 'FaQq',
    description: 'Manage frequently asked questions'
  },
  {
    id: 'banners',
    name: 'Banner',
    link: '/admin/banners',
    icon: 'GalleryVertical',
    description: 'Manage promotional banners and advertisements'
  },
  {
    id: 'admins',
    name: 'Admins',
    link: '/admin/admins',
    icon: 'FaUserShield',
    description: 'Manage admin accounts and permissions'
  },
  {
    id: 'sellers',
    name: 'Sellers',
    link: '/admin/sellers',
    icon: 'FaStore',
    description: 'Manage marketplace sellers and their performance'
  },
  {
    id: 'payments',
    name: 'Payments & Transactions',
    link: '/admin/payments',
    icon: 'FaCreditCard',
    description: 'Track payments, commissions, and payouts'
  },
  {
    id: 'inventory',
    name: 'Inventory & Stock',
    link: '/admin/inventory',
    icon: 'FaWarehouse',
    description: 'Manage stock levels and warehouse operations'
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    link: '/admin/reports',
    icon: 'FaChartBar',
    description: 'Generate sales and performance reports'
  },
  {
    id: 'shipping',
    name: 'Shipping & Delivery',
    link: '/admin/shipping',
    icon: 'FaTruck',
    description: 'Manage shipping partners and delivery zones'
  },
  {
    id: 'returns',
    name: 'Returns & Refunds',
    link: '/admin/returns',
    icon: 'FaUndo',
    description: 'Handle return requests and refund processing'
  },
  {
    id: 'notifications',
    name: 'Notifications',
    link: '/admin/notifications',
    icon: 'FaBell',
    description: 'Manage communication templates and announcements'
  },
  {
    id: 'settings',
    name: 'Settings',
    link: '/admin/settings',
    icon: 'FaCog',
    description: 'Configure site settings and integrations'
  }
];

// Default permissions for each role
export const DEFAULT_ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ADMIN_PAGES.map(page => page.id), // Super admin has access to all pages
  [ROLES.ADMIN]: [
    'dashboard', 'products', 'categories', 'orders', 'customers', 
    'payments', 'collections', 'reviews', 'brands', 'inventory', 
    'reports', 'shipping', 'returns', 'notifications'
  ], // Default admin permissions
  [ROLES.SELLER]: [
    'dashboard', 'products', 'orders', 'collections', 'reviews'
  ] // Default seller permissions - restricted to their own data
};

/**
 * Check if a user has permission to access a specific page
 * @param {Object} admin - Admin user object with role and permissions
 * @param {string} pageId - ID of the page to check access for
 * @returns {boolean} - True if user has permission, false otherwise
 */
export const hasPermission = (admin, pageId) => {
  if (!admin) return false;
  
  // Hardcoded super admin access for Ashutosh (fallback)
  if (admin.email === 'ashutoshmohanty13703@gmail.com') {
    return true;
  }
  
  if (!admin.role) return false;
  
  // Super admin always has access to everything
  if (admin.role === ROLES.SUPER_ADMIN) return true;
  
  // Check if user has specific permission for this page
  return admin.permissions && admin.permissions.includes(pageId);
};

/**
 * Check if a user has a specific role
 * @param {Object} admin - Admin user object
 * @param {string} role - Role to check
 * @returns {boolean} - True if user has the role
 */
export const hasRole = (admin, role) => {
  if (!admin) return false;
  
  // Hardcoded super admin access for Ashutosh (fallback)
  if (admin.email === 'ashutoshmohanty13703@gmail.com' && role === ROLES.SUPER_ADMIN) {
    return true;
  }
  
  return admin && admin.role === role;
};

/**
 * Check if a user can manage permissions (only super admins)
 * @param {Object} admin - Admin user object
 * @returns {boolean} - True if user can manage permissions
 */
export const canManagePermissions = (admin) => {
  if (!admin) return false;
  
  // Hardcoded super admin access for Ashutosh (fallback)
  if (admin.email === 'ashutoshmohanty13703@gmail.com') {
    return true;
  }
  
  return hasRole(admin, ROLES.SUPER_ADMIN);
};

/**
 * Get filtered pages based on user permissions
 * @param {Object} admin - Admin user object
 * @returns {Array} - Array of pages the user can access
 */
export const getAccessiblePages = (admin) => {
  if (!admin) return [];
  
  // Hardcoded super admin access for Ashutosh (fallback)
  if (admin.email === 'ashutoshmohanty13703@gmail.com') {
    return ADMIN_PAGES;
  }
  
  // Super admin gets all pages
  if (admin.role === ROLES.SUPER_ADMIN) return ADMIN_PAGES;
  
  // Filter pages based on permissions
  return ADMIN_PAGES.filter(page => hasPermission(admin, page.id));
};

/**
 * Get role display name
 * @param {string} role - Role key
 * @returns {string} - Human readable role name
 */
export const getRoleDisplayName = (role) => {
  const roleNames = {
    [ROLES.SUPER_ADMIN]: 'Super Admin',
    [ROLES.ADMIN]: 'Admin',
    [ROLES.SELLER]: 'Seller'
  };
  return roleNames[role] || 'Unknown';
};

/**
 * Get role color for UI
 * @param {string} role - Role key
 * @returns {string} - CSS color class
 */
export const getRoleColor = (role) => {
  const colors = {
    [ROLES.SUPER_ADMIN]: 'text-red-600 bg-red-100',
    [ROLES.ADMIN]: 'text-blue-600 bg-blue-100',
    [ROLES.SELLER]: 'text-green-600 bg-green-100'
  };
  return colors[role] || 'text-gray-600 bg-gray-100';
};