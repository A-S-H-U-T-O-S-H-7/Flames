"use client";

import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, User, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firestore/firebase';


export default function SellerHeader({ seller, onMenuToggle }) {
  const { logout } = useAuth();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    // Check system preference for dark mode
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true' || 
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    }

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
  const loadProfileImage = async () => {
    if (seller?.documents?.profileImage?.url) {  // ← ADD 'documents.'
      setProfileImageUrl(seller.documents.profileImage.url);
    } else if (seller?.documents?.profileImage?.path) {  // ← ADD 'documents.'
      setLoadingImage(true);
      setImageError(false);
      try {
        const storageRef = ref(storage, seller.documents.profileImage.path);
        const url = await getDownloadURL(storageRef);
        setProfileImageUrl(url);
      } catch (error) {
        console.error('Error loading profile image:', error);
        setImageError(true);
      } finally {
        setLoadingImage(false);
      }
    }
  };
  loadProfileImage();
}, [seller?.documents?.profileImage]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-emerald-200/20 dark:border-teal-800/30 sticky top-0 z-30 shadow-sm font-body">
      {/* Background Design Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-400/15 to-pink-300/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <svg className="absolute top-0 left-0 w-full h-full opacity-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="headerWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="20%" stopColor="#06b6d4" />
              <stop offset="40%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#8b5cf6" />
              <stop offset="80%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <path
            fill="url(#headerWave)"
            d="M0,30 C200,80 400,10 600,50 C800,90 1000,20 1200,60 L1200,0 L0,0 Z"
          />
        </svg>
      </div>
      <div className="flex items-center justify-between px-4 py-1 relative z-10">
        {/* Left Section - Mobile Menu */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Button - 3 Lines Icon */}
          <button
            onClick={onMenuToggle}
            className="p-2.5 hover:bg-teal-500/10 rounded-xl transition-all duration-200 lg:hidden text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 hover:bg-teal-500/10 rounded-xl transition-colors duration-200 text-slate-600 dark:text-slate-400"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Notifications */}
          <button 
            className="relative p-2.5 hover:bg-teal-500/10 rounded-xl transition-colors duration-200 text-slate-600 dark:text-slate-400 group"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                <span className="text-xs text-teal-600 dark:text-teal-400">3 new</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-900/20">
                  <p className="font-medium text-slate-900 dark:text-white">New order received</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">2 minutes ago</p>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <p className="font-medium text-slate-900 dark:text-white">Low stock alert</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">1 hour ago</p>
                </div>
              </div>
            </div>
          </button>

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-2 hover:bg-teal-500/10 rounded-xl transition-colors duration-200 group"
            >
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                  Welcome
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-white font-body">
                  {seller?.personalInfo?.fullName || 'My Store'}
                </p>
                
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-cyan-300 flex items-center justify-center shadow-lg bg-gradient-to-br from-teal-400 to-emerald-500 overflow-hidden">
                {loadingImage ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                ) : profileImageUrl && !imageError ? (
                  <img 
                    src={profileImageUrl} 
                    alt={seller?.businessInfo?.businessName || seller?.personalInfo?.fullName || "Seller"}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span className="text-white text-sm font-semibold">
                    {seller?.businessInfo?.businessName?.charAt(0) || 
                     seller?.personalInfo?.fullName?.charAt(0) || "S"}
                  </span>
                )}
              </div>
              
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 font-body"
              >
                {/* Profile Info */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {seller?.personalInfo?.fullName || 'My Store'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {seller?.personalInfo?.email || 'seller@example.com'}
                  </p>
                  <div className="mt-2 px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-medium inline-block">
                    Premium Seller
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="py-2">
                  <button 
                    onClick={() => {
                      router.push('/sellers/profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">My Profile</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      router.push('/sellers/settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Settings</span>
                  </button>
                </div>
                
                {/* Logout */}
                <div className="border-t border-slate-100 dark:border-slate-700 pt-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}