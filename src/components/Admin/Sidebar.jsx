'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';
import { 
  FaHome, FaBox, FaTags, FaCubes, FaQq, FaShoppingCart, FaUsers, FaStar, 
  FaThLarge, FaUserShield, FaCreditCard, FaUserTie, FaWarehouse, 
  FaChartBar, FaTruck, FaUndoAlt, FaBell, FaCog 
} from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { auth } from '@/lib/firestore/firebase';
import { GalleryVertical } from 'lucide-react';
import { VscFeedback } from "react-icons/vsc";
import { usePermissions } from '@/context/PermissionContext';

const menuList = [
  { id: 'dashboard', name: 'Dashboard', link: '/admin/dashboard', icon: <FaHome /> },
  { id: 'products', name: 'Products', link: '/admin/products', icon: <FaBox /> },
  { id: 'orders', name: 'Orders', link: '/admin/orders', icon: <FaShoppingCart /> },
  { id: 'customers', name: 'Customers', link: '/admin/customers', icon: <FaUsers /> },
  { id: 'sellers', name: 'Sellers', link: '/admin/sellers', icon: <FaUserTie /> },

  { id: 'collections', name: 'Collections', link: '/admin/collections', icon: <FaThLarge /> },
  { id: 'categories', name: 'Categories', link: '/admin/categories', icon: <FaTags /> },
  { id: 'reviews', name: 'Reviews', link: '/admin/reviews', icon: <FaStar /> },
  { id: 'voice-of-customers', name: 'Voice Of Customers', link: '/admin/voice-of-customers', icon: <VscFeedback />},
  { id: 'brands', name: 'Brands', link: '/admin/brands', icon: <FaCubes /> },
  { id: 'faqs', name: 'Faqs', link: '/admin/faqs', icon: <FaQq /> },
  { id: 'banners', name: 'Banner', link: '/admin/banners', icon: <GalleryVertical /> },
  { id: 'admins', name: 'Admins', link: '/admin/admins', icon: <FaUserShield /> },

  { id: 'payments', name: 'Payments & Transactions', link: '/admin/payments', icon: <FaCreditCard /> },
  { id: 'inventory', name: 'Inventory & Stock', link: '/admin/inventory', icon: <FaWarehouse /> },
  { id: 'reports', name: 'Reports & Analytics', link: '/admin/reports', icon: <FaChartBar /> },
  { id: 'shipping', name: 'Shipping & Delivery', link: '/admin/shipping', icon: <FaTruck /> },
  { id: 'returns', name: 'Returns & Refunds', link: '/admin/returns', icon: <FaUndoAlt /> },
  { id: 'notifications', name: 'Notifications', link: '/admin/notifications', icon: <FaBell /> },
  { id: 'settings', name: 'Settings', link: '/admin/settings', icon: <FaCog /> },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const { hasPermission, isLoading, adminData } = usePermissions();

  // Filter menu items based on user permissions
  const getAccessibleMenuItems = () => {
    if (isLoading || !adminData) return [];
    
    return menuList.filter(item => hasPermission(item.id));
  };

  const accessibleMenuItems = getAccessibleMenuItems();

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-lg z-50 transition-all ease-in-out duration-500 
      ${isExpanded ? 'w-64' : 'w-[70px] md:w-[90px]'} flex flex-col overflow-hidden`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Brand Logo */}
      <Link href="/">
        <div className="flex items-center px-4 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
          <Image src="/flame1.png" alt="Logo" width={40} height={40} className="w-10 h-10" />
          {isExpanded && (
            <div className="ml-3">
              <h1 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Flames
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Admin Panel</p>
            </div>
          )}
        </div>
      </Link>

      {/* Scrollable Menu Items */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-2">
        <nav className="flex flex-col space-y-1 px-2">
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">Loading...</div>
            </div>
          ) : (
            accessibleMenuItems.map((item, index) => {
              const isActive = pathname === item.link;
              return (
                <Link
                  key={item.id || index}
                  href={item.link}
                  className={`flex items-center gap-3 px-3 py-3 transition-all duration-200 rounded-xl cursor-pointer group
                    ${isActive 
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/25' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  <div className={`text-lg transition-colors duration-200 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-teal-500 dark:text-teal-400 group-hover:text-teal-600 dark:group-hover:text-teal-300'
                  }`}>
                    {item.icon}
                  </div>
                  {isExpanded && (
                    <span className={`text-sm font-medium transition-all duration-200 ${
                      isActive ? 'text-white' : 'group-hover:text-slate-900 dark:group-hover:text-white'
                    }`}>
                      {item.name}
                    </span>
                  )}
                  
                  {/* Active indicator dot for collapsed state */}
                  {!isExpanded && isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })
          )}
        </nav>
      </div>

      {/* Logout Button (Always at Bottom) */}
      <div className="px-3 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <button
          onClick={async () => {
            try {
              await toast.promise(signOut(auth), {
                loading: 'Logging out...',
                success: 'Successfully logged out',
                error: (e) => e?.message,
              });
            } catch (error) {
              toast.error(error?.message);
            }
          }}
          className={`flex items-center gap-3 w-full text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all rounded-xl px-3 py-3 group ${
            isExpanded ? 'justify-start' : 'justify-center'
          }`}
        >
          <FiLogOut className={`text-lg transition-colors duration-200 group-hover:text-red-600 dark:group-hover:text-red-400 ${
            isExpanded ? '' : 'text-red-500'
          }`} />
          {isExpanded && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}