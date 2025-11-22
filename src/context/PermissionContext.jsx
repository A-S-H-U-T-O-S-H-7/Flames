"use client";

import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useAdmin } from '@/lib/firestore/admins/read';
import { 
  hasPermission, 
  hasRole, 
  canManagePermissions, 
  getAccessiblePages,
  ROLES 
} from '@/lib/permissions/adminPermissions';
import { shouldUseSellersInterface } from '@/lib/permissions/sellerPermissions';

const PermissionContext = createContext();

export default function PermissionContextProvider({ children }) {
  const { user, logout: authLogout } = useAuth();
  const { data: adminData, error, isLoading } = useAdmin({ email: user?.email });

  // Memoize permission functions to avoid unnecessary re-renders
  const permissionUtils = useMemo(() => {
    if (!adminData) {
      return {
        hasPermission: () => false,
        hasRole: () => false,
        canManagePermissions: () => false,
        getAccessiblePages: () => [],
        adminData: null,
        isLoading,
        error,
        isSuperAdmin: () => false,
        isAdmin: () => false,
        isSeller: () => false,
        shouldUseSellersInterface: () => false,
        logout: authLogout
      };
    }

    return {
      hasPermission: (pageId) => hasPermission(adminData, pageId),
      hasRole: (role) => hasRole(adminData, role),
      canManagePermissions: () => canManagePermissions(adminData),
      getAccessiblePages: () => getAccessiblePages(adminData),
      adminData,
      isLoading,
      error,
      // Helper functions for common checks
      isSuperAdmin: () => hasRole(adminData, ROLES.SUPER_ADMIN),
      isAdmin: () => hasRole(adminData, ROLES.ADMIN),
      isSeller: () => hasRole(adminData, ROLES.SELLER),
      // Seller interface helper
      shouldUseSellersInterface: () => shouldUseSellersInterface(adminData),
      // Logout function
      logout: authLogout
    };
  }, [adminData, isLoading, error]);

  return (
    <PermissionContext.Provider value={permissionUtils}>
      {children}
    </PermissionContext.Provider>
  );
}

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionContextProvider');
  }
  return context;
};

// Higher-order component for permission-based rendering
export const withPermission = (WrappedComponent, requiredPermission) => {
  return function PermissionWrapper(props) {
    const { hasPermission } = usePermissions();
    
    if (!hasPermission(requiredPermission)) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p>You don't have permission to view this content.</p>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
};

// Hook for conditional rendering based on permissions
export const usePermissionCheck = (permission) => {
  const { hasPermission } = usePermissions();
  return hasPermission(permission);
};

// Hook for role-based conditional rendering
export const useRoleCheck = (role) => {
  const { hasRole } = usePermissions();
  return hasRole(role);
};