'use client';

import { useState, forwardRef } from 'react'; // ADD forwardRef
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { AiFillDashboard } from "react-icons/ai";
import { LuPackage2 } from "react-icons/lu";
import { GiShoppingBag, GiReturnArrow } from "react-icons/gi";
import { MdReviews, MdSupportAgent, MdSettingsSuggest } from "react-icons/md";
import { TbPackages } from "react-icons/tb";
import { RiSecurePaymentLine } from "react-icons/ri";
import { FaUserShield } from "react-icons/fa";

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: AiFillDashboard, path: '/sellers/dashboard' },
  { id: 'products', label: 'Products', icon: LuPackage2, path: '/sellers/products' },
  { id: 'orders', label: 'Orders', icon: GiShoppingBag, path: '/sellers/orders' },
  { id: 'reviews', label: 'Reviews', icon: MdReviews, path: '/sellers/reviews' },
  { id: 'notifications', label: 'Notifications', icon: MdSupportAgent, path: '/sellers/notifications' },
  { id: 'payments', label: 'Payments', icon: RiSecurePaymentLine, path: '/sellers/payments' },
  { id: 'returns', label: 'Returns&Refunds', icon: GiReturnArrow, path: '/sellers/returns-refunds' },
  { id: 'profile', label: 'Profile', icon: FaUserShield, path: '/sellers/profile' },
  { id: 'settings', label: 'Settings', icon: MdSettingsSuggest, path: '/sellers/settings' },
];

// ADD forwardRef here
const SellerSidebar = forwardRef(({ seller, isOpen = false, toggleSidebar }, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      ref={ref} // ADD the ref here
      className={`fixed top-0 left-0 h-full bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 
      border-r border-slate-200 dark:border-slate-800/50
      backdrop-blur-xl z-50 transition-all ease-in-out duration-300 flex flex-col overflow-hidden shadow-2xl shadow-teal-500/10
      ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} 
      lg:translate-x-0 ${isExpanded ? 'lg:w-64' : 'lg:w-20'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Brand Logo */}
<div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-slate-800/50
  bg-gradient-to-r from-teal-500/5 to-emerald-500/5 dark:from-teal-500/10 dark:to-emerald-500/10">
  <div className="flex items-center">
    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 via-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30 flex-shrink-0 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
      {seller?.documents?.businessLogo?.url ? (
        <Image 
          src={seller.documents.businessLogo.url} 
          alt={seller?.businessInfo?.businessName || 'Business Logo'} 
          width={34} 
          height={34}
          className="relative z-10 object-cover rounded-lg"
        />
      ) : (
        <Image src="/flame1.png" alt="Flames" width={34} height={34} className="relative z-10" />
      )}
    </div> 
    {(isExpanded || isOpen) && (
      <h1 className="ml-3 text-lg font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent whitespace-nowrap overflow-hidden">
        {seller?.businessInfo?.businessName || 'Flames'}
      </h1>
    )}
  </div>
        {isOpen && toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Scrollable Menu Items */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <nav className="flex flex-col py-6 px-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  router.push(item.path);
                  if (isOpen && toggleSidebar) toggleSidebar();
                }}
                className={`group relative flex items-center gap-4 px-4 py-3.5 transition-all duration-300 rounded-xl cursor-pointer overflow-hidden
                ${active 
                  ? 'bg-gradient-to-r from-teal-500/10 to-emerald-500/10 dark:from-teal-500/20 dark:to-emerald-500/20 shadow-lg shadow-teal-500/10 dark:shadow-teal-500/20' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:shadow-md hover:shadow-teal-500/10'}`}
              >
                {/* Active indicator line */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-teal-400 to-emerald-400 rounded-r-full"></div>
                )}
                
                {/* Icon with glow effect */}
                <div className={`flex-shrink-0 transition-all duration-300 ${
                  active 
                    ? 'scale-110 text-teal-600 dark:text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]' 
                    : 'text-slate-600 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:scale-105'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                {(isExpanded || isOpen) && (
                  <span className={`text-base font-medium whitespace-nowrap transition-colors duration-300 ${
                    active 
                      ? 'text-teal-700 dark:text-teal-300' 
                      : 'text-slate-700 dark:text-slate-300 group-hover:text-teal-700 dark:group-hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                )}

                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer - Flames branding */}
      <div className="px-4 py-5 border-t border-slate-200 dark:border-slate-800/50
        bg-gradient-to-r from-teal-500/3 to-emerald-500/3 dark:from-teal-500/5 dark:to-emerald-500/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex-shrink-0 relative">
            <Image 
              src="/flame1.png" 
              alt="Flames" 
              width={40} 
              height={40}
              className="drop-shadow-[0_0_8px_rgba(45,212,191,0.4)]"
            />
          </div>
          {(isExpanded || isOpen) && (
            <div className="flex flex-col">
              <span className="text-sm font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Flames</span>
              <span className="text-xs text-slate-600 dark:text-slate-500">© All rights reserved</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// ADD display name for better debugging
SellerSidebar.displayName = 'SellerSidebar';

export default SellerSidebar;