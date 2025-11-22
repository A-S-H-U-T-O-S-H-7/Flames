'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Higher-Order Component for seller authentication
export function withSellerAuth(WrappedComponent) {
  return function SellerAuthComponent(props) {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [sellerId, setSellerId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const checkSellerAccess = async () => {
        try {
          // Wait for auth to load
          if (authLoading) return;

          // Redirect if not authenticated
          if (!user) {
            router.push('/login');
            return;
          }

          // Set seller ID from user data
          setSellerId(user.uid);
          setLoading(false);
        } catch (err) {
          console.error('Seller auth error:', err);
          setError('Failed to verify seller access');
          setLoading(false);
        }
      };

      checkSellerAccess();
    }, [user, authLoading, router]);

    // Loading state
    if (loading || authLoading) {
      return (
        <div className="p-6 bg-[#1e2737] min-h-screen">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-600 rounded mb-6 w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-600 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className="p-6 bg-[#1e2737] min-h-screen">
          <div className="text-center">
            <div className="bg-red-900/20 border border-red-600/20 rounded-lg p-6 max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-white mb-2">Access Error</h2>
              <p className="text-gray-400">{error}</p>
            </div>
          </div>
        </div>
      );
    }

    // Render the wrapped component with seller data
    return (
      <WrappedComponent 
        {...props} 
        sellerId={sellerId}
        sellerData={{ uid: sellerId, role: 'seller' }}
      />
    );
  };
}

// Hook for accessing seller data within components
export function useSellerData() {
  const { user } = useAuth();
  
  return {
    sellerId: user?.uid,
    sellerData: user,
    isAuthenticated: !!user,
    role: user?.customClaims?.role || user?.role
  };
}