import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/lib/firestore/admins/read";
import { useTheme } from "@/context/ThemeContext"; 
import { Bell, Moon, Sun, User, Settings, LogOut } from "lucide-react"; 
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";

function Header() {
  const { user, logout } = useAuth();
  const { data: admin } = useAdmin({ email: user?.email });
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-emerald-200/20 dark:border-teal-800/30 sticky top-0 z-30 shadow-sm font-body">
      {/* Background Design Elements - Same as Seller Header */}
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

      <div className="flex items-center justify-between px-2 py-2 relative z-10">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl ml-[90px] font-semibold text-slate-900 dark:text-white bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button - Enhanced Design */}
          <button
            onClick={toggleTheme}
            className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="sr-only">Toggle theme</span>
            
            {/* Sun Icon */}
            <svg
              className={`absolute left-1 h-5 w-5 text-yellow-500 transition-transform duration-300 ${
                theme === 'light' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>

            {/* Moon Icon */}
            <svg
              className={`absolute right-1 h-5 w-5 text-blue-400 transition-transform duration-300 ${
                theme === 'dark' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                clipRule="evenodd"
              />
            </svg>

            {/* Toggle Circle */}
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>

          {/* Notifications - Enhanced */}
          <button 
            className="relative p-2.5 hover:bg-teal-500/10 rounded-xl transition-colors duration-200 text-slate-600 dark:text-slate-400 group"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                <span className="text-xs text-teal-600 dark:text-teal-400">3 new</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-900/20">
                  <p className="font-medium text-slate-900 dark:text-white">New user registered</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">2 minutes ago</p>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <p className="font-medium text-slate-900 dark:text-white">System update available</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">1 hour ago</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <p className="font-medium text-slate-900 dark:text-white">New order received</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">3 hours ago</p>
                </div>
              </div>
            </div>
          </button>

          {/* Profile Menu - Enhanced */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-2 hover:bg-teal-500/10 rounded-xl transition-colors duration-200 group"
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                  Welcome
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-white font-body">
                  {admin?.name || "Admin"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-cyan-300 flex items-center justify-center shadow-lg bg-gradient-to-br from-teal-400 to-emerald-500 overflow-hidden">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={admin?.name || "Admin"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-semibold">
                    {admin?.name?.charAt(0) || "A"}
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
                    {admin?.name || "Admin"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {admin?.email || user?.email || "admin@example.com"}
                  </p>
                  <div className="mt-2 px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-medium inline-block">
                    Administrator
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="py-2">
                  <button 
                    onClick={() => {
                      router.push('/admin/profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">My Profile</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      router.push('/admin/settings');
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

export default Header;