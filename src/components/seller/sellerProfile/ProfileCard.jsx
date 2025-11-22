"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { BadgeCheck, TrendingUp, Star, Package, Mail, Phone, Building2, Calendar, MapPin, User, Camera, Edit, Save, X, Info } from 'lucide-react';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firestore/firebase';
import { uploadSellerDocument } from '@/lib/firestore/sellers/upload';
import { getSellerStats } from '@/lib/firestore/sellers/stats';

export default function ProfileCard({ seller, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    avgRating: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  // Memoize seller data
  const sellerId = useMemo(() => seller?.sellerId || seller?.id, [seller]);
  const profileImage = useMemo(() => seller.documents?.profileImage?.url || '', [seller]);
  const personalInfo = useMemo(() => seller.personalInfo || {}, [seller]);
  const businessInfo = useMemo(() => seller.businessInfo || {}, [seller]);

  // Form data with memoized initial values
  const [formData, setFormData] = useState({
    profileImage,
    fullName: personalInfo.fullName || '',
    dob: personalInfo.dob || '',
    phone: personalInfo.phone || '',
    personalAddress: personalInfo.personalAddress || ''
  });

  // Update form data when seller data changes
  useEffect(() => {
    setFormData({
      profileImage,
      fullName: personalInfo.fullName || '',
      dob: personalInfo.dob || '',
      phone: personalInfo.phone || '',
      personalAddress: personalInfo.personalAddress || ''
    });
  }, [profileImage, personalInfo]);

  // Cleanup image preview URL
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  // Fetch seller stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!sellerId) {
        setStatsLoading(false);
        return;
      }

      setStatsLoading(true);
      try {
        const result = await getSellerStats(sellerId);
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [sellerId]);

  // Memoized stats display
  const statsDisplay = useMemo(() => [
    { 
      label: 'Orders', 
      value: statsLoading ? '...' : stats.totalOrders?.toLocaleString() || '0', 
      icon: Package 
    },
    { 
      label: 'Revenue', 
      value: statsLoading ? '...' : stats.totalRevenue >= 1000 
        ? `₹${(stats.totalRevenue / 1000).toFixed(1)}K` 
        : `₹${stats.totalRevenue}`, 
      icon: TrendingUp 
    },
    { 
      label: 'Products', 
      value: statsLoading ? '...' : stats.totalProducts?.toLocaleString() || '0', 
      icon: Package 
    },
    { 
      label: 'Rating', 
      value: statsLoading ? '...' : stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'N/A', 
      icon: Star 
    }
  ], [statsLoading, stats]);

  // Event handlers
  const handleEditToggle = useCallback(() => {
    if (isEditing) {
      setFormData({
        profileImage,
        fullName: personalInfo.fullName || '',
        dob: personalInfo.dob || '',
        phone: personalInfo.phone || '',
        personalAddress: personalInfo.personalAddress || ''
      });
      setImageFile(null);
    }
    setIsEditing(!isEditing);
  }, [isEditing, profileImage, personalInfo]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    setImagePreviewUrl(imageUrl);
    setFormData(prev => ({
      ...prev,
      profileImage: imageUrl
    }));
  }, [imagePreviewUrl]);

  const handleSave = useCallback(async () => {
    if (!sellerId) {
      alert('Seller ID not found');
      return;
    }

    // Validation
    if (!formData.fullName?.trim()) {
      alert('Name is required');
      return;
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      const sellerRef = doc(db, 'sellers', sellerId);
      const updateData = {
        updatedAt: serverTimestamp(),
        'personalInfo.fullName': formData.fullName.trim(),
        'personalInfo.dob': formData.dob,
        'personalInfo.phone': formData.phone,
        'personalInfo.personalAddress': formData.personalAddress
      };

      if (imageFile) {
        const uploadResult = await uploadSellerDocument(imageFile, sellerId, 'profileImage');
        if (uploadResult.success) {
          updateData['documents.profileImage'] = {
            url: uploadResult.url,
            path: uploadResult.path,
            fileName: uploadResult.fileName,
            size: uploadResult.size,
            type: uploadResult.type,
            uploadedAt: new Date().toISOString()
          };
        }
      }

      await updateDoc(sellerRef, updateData);
      
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
        setImagePreviewUrl(null);
      }
      
      onUpdate?.();
      setIsEditing(false);
      setImageFile(null);
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [sellerId, formData, imageFile, imagePreviewUrl, onUpdate]);

  // Input field component
  const InputField = useCallback(({ value, field, placeholder, type = "text", multiline = false }) => 
    multiline ? (
      <textarea
        value={value || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-none outline-none text-base font-medium text-slate-900 dark:text-white placeholder-slate-500 resize-none"
        rows="3"
      />
    ) : (
      <input
        type={type}
        value={value || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-none outline-none text-base font-medium text-slate-900 dark:text-white placeholder-slate-500"
      />
    ), [handleInputChange]
  );

  return (
    <div className="relative bg-white dark:bg-slate-950 border border-dashed border-orange-400 rounded-2xl shadow-2xl overflow-hidden">
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-40 h-40 pointer-events-none">
        <div className="absolute top-0 left-0 w-28 h-28 bg-orange-500 rounded-br-[90px]"></div>
        <div className="absolute top-0 left-0 w-20 h-20 bg-orange-400 rounded-br-[70px]"></div>
      </div>
      <div className="absolute bottom-0 right-0 w-40 h-40 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-28 h-28 bg-orange-500 rounded-tl-[90px]"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-orange-400 rounded-tl-[70px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-30 p-2 sm:p-6">
        {/* Info Box */}
        {isEditing && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                You can edit: Profile Image, Name, Date of Birth, Phone, and Address
              </p>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start gap-5 mb-6 pb-4">
          {/* Profile Image */}
          <div className="relative group flex-shrink-0">
            <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-orange-200 dark:border-orange-700">
              {formData.profileImage ? (
                <img 
                  src={formData.profileImage} 
                  alt={personalInfo.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white text-2xl font-bold">
                  {personalInfo.fullName?.charAt(0) || 'U'}
                </div>
              )}
              
              {isEditing && (
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {isEditing ? (
                    <InputField 
                      value={formData.fullName} 
                      field="fullName" 
                      placeholder="Enter full name" 
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {formData.fullName || personalInfo.fullName}
                    </h2>
                  )}
                  
                  {seller.status === 'approved' && (
                    <div className="flex items-center gap-1">
                      <BadgeCheck className="w-4 h-4 text-green-600 dark:text-emerald-400" />
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase">Verified</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2.5 mb-1">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <span className="text-base font-medium text-slate-700 dark:text-slate-300">
                    {personalInfo.email || 'email@example.com'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-orange-600 font-serif dark:text-orange-400 text-lg">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">{businessInfo.businessName}</span>
                </div>
              </div>

              {/* Edit/Cancel Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={handleEditToggle}
                  disabled={isLoading}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shadow-md ${
                    isEditing 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap border px-3 py-4 rounded-md bg-gradient-to-r from-rose-200 to-purple-200 dark:from-rose-950 dark:to-purple-950 border-orange-200 gap-4">
          {statsDisplay.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30 shadow-sm">
                <stat.icon className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">{stat.label}</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Personal Details */}
        <div className="space-y-4 mt-5">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* DOB */}
            <DetailCard 
              icon={Calendar} 
              label="DOB" 
              iconBg="bg-indigo-500"
              isEditing={isEditing}
            >
              {isEditing ? (
                <InputField value={formData.dob} field="dob" type="date" />
              ) : (
                <div className="text-base font-medium text-slate-900 dark:text-white">
                  {formData.dob ? new Date(formData.dob).toLocaleDateString('en-IN') : '-'}
                </div>
              )}
            </DetailCard>

            {/* Phone */}
            <DetailCard 
              icon={Phone} 
              label="Phone" 
              iconBg="bg-teal-500"
              isEditing={isEditing}
            >
              {isEditing ? (
                <InputField value={formData.phone} field="phone" placeholder="Enter phone number" />
              ) : (
                <div className="text-base font-medium text-slate-900 dark:text-white">
                  {formData.phone || '-'}
                </div>
              )}
            </DetailCard>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Aadhaar */}
            <DetailCard icon={User} label="Aadhaar" iconBg="bg-violet-500">
              <div className="text-base font-medium text-slate-900 dark:text-white">
                {personalInfo.aadhaarNumber || '-'}
              </div>
            </DetailCard>

            {/* PAN */}
            <DetailCard icon={User} label="PAN" iconBg="bg-rose-500">
              <div className="text-base font-medium text-slate-900 dark:text-white">
                {personalInfo.panNumber || '-'}
              </div>
            </DetailCard>
          </div>

          {/* Address */}
          <DetailCard 
            icon={MapPin} 
            label="Address" 
            iconBg="bg-sky-500"
            isEditing={isEditing}
            fullWidth
          >
            {isEditing ? (
              <InputField 
                value={formData.personalAddress} 
                field="personalAddress" 
                placeholder="Enter address"
                multiline={true}
              />
            ) : (
              <div className="text-base font-medium text-slate-900 dark:text-white whitespace-pre-wrap">
                {formData.personalAddress || '-'}
              </div>
            )}
          </DetailCard>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end pt-5 mt-5 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg text-sm font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Extracted Detail Card Component for better reusability
const DetailCard = ({ icon: Icon, label, iconBg, isEditing, fullWidth = false, children }) => (
  <div className={`group py-1 px-4 rounded-lg transition-all border border-dashed border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-600 shadow-md hover:shadow-lg ${fullWidth ? '' : 'sm:col-span-1'}`}>
    <div className="flex items-start gap-3">
      <div className={`p-1 mt-2 rounded-xl flex-shrink-0 ${iconBg} shadow-md`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 tracking-wider">
          {label}
        </div>
        {children}
      </div>
    </div>
  </div>
);