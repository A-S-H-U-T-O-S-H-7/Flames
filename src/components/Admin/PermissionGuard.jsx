"use client";

import { usePermissions } from '@/context/PermissionContext';
import { CircularProgress } from '@nextui-org/react';

export default function PermissionGuard({ 
  children, 
  requiredPermission, 
  fallback = null 
}) {
  const { hasPermission, isLoading } = usePermissions();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress size="lg" />
      </div>
    );
  }

  if (!hasPermission(requiredPermission)) {
    return fallback || (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Access Denied</h2>
        <p className="text-center max-w-md">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
      </div>
    );
  }

  return children;
}

// Higher-order component version
export function withPermissionGuard(WrappedComponent, requiredPermission) {
  return function PermissionWrappedComponent(props) {
    return (
      <PermissionGuard requiredPermission={requiredPermission}>
        <WrappedComponent {...props} />
      </PermissionGuard>
    );
  };
}