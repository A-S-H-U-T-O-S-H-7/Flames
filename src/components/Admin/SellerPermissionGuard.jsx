"use client";

import { usePermissions } from '@/context/PermissionContext';
import { canSellerAccess, getSellerIdFromAdmin } from '@/lib/permissions/sellerPermissions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Permission guard specifically for seller routes and resources
 * Ensures sellers can only access their own data
 */
export default function SellerPermissionGuard({ 
  children, 
  requiredPermission = null, 
  resourceSellerId = null,
  fallbackPath = '/admin/dashboard'
}) {
  const { adminData, loading } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for permission data to load

    if (!adminData) {
      router.push('/login');
      return;
    }

    // Check if user has required permission
    if (requiredPermission && !adminData.permissions?.includes(requiredPermission)) {
      router.push(fallbackPath);
      return;
    }

    // If resourceSellerId is provided, check if user can access this resource
    if (resourceSellerId && !canSellerAccess(adminData, resourceSellerId)) {
      router.push(fallbackPath);
      return;
    }

    // For seller role, ensure they're accessing seller routes (not admin routes)
    if (adminData.role === 'seller' && window.location.pathname.includes('/admin/')) {
      router.push('/sellers/dashboard');
      return;
    }

  }, [adminData, loading, requiredPermission, resourceSellerId, router, fallbackPath]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1e2737]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22c7d5] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show access denied if no admin data or permission denied
  if (!adminData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1e2737]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-4">You need to be logged in to access this page.</p>
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-[#22c7d5] text-white rounded-lg hover:bg-[#1aa5b5]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Check permission access
  if (requiredPermission && !adminData.permissions?.includes(requiredPermission)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1e2737]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-4">You don't have permission to access this page.</p>
          <button 
            onClick={() => router.push(fallbackPath)}
            className="px-4 py-2 bg-[#22c7d5] text-white rounded-lg hover:bg-[#1aa5b5]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check seller resource access
  if (resourceSellerId && !canSellerAccess(adminData, resourceSellerId)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1e2737]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-4">You can only access your own seller data.</p>
          <button 
            onClick={() => router.push(fallbackPath)}
            className="px-4 py-2 bg-[#22c7d5] text-white rounded-lg hover:bg-[#1aa5b5]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
}