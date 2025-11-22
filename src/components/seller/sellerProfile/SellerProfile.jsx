"use client";

import { useState, useEffect } from 'react';
import { getSellerByEmail } from '@/lib/firestore/sellers/read'; 
import { useAuth } from '@/context/AuthContext';
import BusinessDetails from './BusinessDetails';
import BankDetails from './BankDetailsSection';
import ProfileCard from './ProfileCard';
import PayoutPage from '../payout/SellerPayout';

export default function SellerProfile() {
  const { user } = useAuth();
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'payout'

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await getSellerByEmail(user.email);
        
        if (result.success) {
          setSeller(result.data);
        }
      } catch (err) {
        console.error('Error fetching seller:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [user]);

  const handleProfileUpdate = async () => {
    if (!user?.email) return;
    
    try {
      const result = await getSellerByEmail(user.email);
      if (result.success) {
        setSeller(result.data);
      }
    } catch (err) {
      console.error('Error refreshing seller data:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-950 dark:to-emerald-950/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-950 dark:to-emerald-950/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">No seller data found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        {/* Tab Navigation */}
        <div className="flex justify-between mb-4">
  <div className='text-2xl text-emerald-400 flex items-center font-semibold '>
    {activeTab === 'profile' ? 'Profile' : 'Payout'}
  </div>
  <div className="bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-emerald-400 dark:border-emerald-700">
    <div className="flex space-x-1">
      <button
        onClick={() => setActiveTab('profile')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          activeTab === 'profile'
            ? 'bg-emerald-500 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
      >
        Profile
      </button>
      <button
        onClick={() => setActiveTab('payout')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          activeTab === 'payout'
            ? 'bg-emerald-500 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
      >
        Payout
      </button>
    </div>
  </div>
</div>

        {/* Tab Content */}
        {activeTab === 'profile' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* LEFT BLOCK - Profile Header + Personal Details */}
            <div className="xl:col-span-1 space-y-6 lg:space-y-8">
              <ProfileCard
                seller={seller} 
                onUpdate={handleProfileUpdate}
              />
            </div>

            {/* RIGHT BLOCK - Bank, Business, Documents */}
            <div className="xl:col-span-2 space-y-1">
              <BankDetails 
                bankDetails={seller.bankDetails} 
                sellerId={seller.sellerId || seller.id}
                onUpdate={handleProfileUpdate}
              />
              <BusinessDetails 
                businessInfo={seller.businessInfo}
                createdAt={seller.createdAt}
                commission={seller.commission}
              />
            </div>
          </div>
        ) : (
          <PayoutPage seller={seller} />
        )}
      </div>
    </div>
  );
}