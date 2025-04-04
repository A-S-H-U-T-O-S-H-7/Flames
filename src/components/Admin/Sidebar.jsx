'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';
import { FaHome, FaBox, FaTags, FaCubes,FaQq, FaShoppingCart, FaUsers, FaStar, FaThLarge, FaUserShield } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { auth } from '@/lib/firestore/firebase';
import { GalleryVertical } from 'lucide-react';
import { VscFeedback } from "react-icons/vsc";


const menuList = [
  { name: 'Dashboard', link: '/admin/dashboard', icon: <FaHome /> },
  { name: 'Products', link: '/admin/products', icon: <FaBox /> },
  { name: 'Categories', link: '/admin/categories', icon: <FaTags /> },
  { name: 'Orders', link: '/admin/orders', icon: <FaShoppingCart /> },
  { name: 'Customers', link: '/admin/customers', icon: <FaUsers /> },
  { name: 'Collections', link: '/admin/collections', icon: <FaThLarge /> },
  { name: 'Reviews', link: '/admin/reviews', icon: <FaStar /> },
  { name: 'Voice Of Customers', link: '/admin/voice-of-customers', icon: <VscFeedback />},
  { name: 'Brands', link: '/admin/brands', icon: <FaCubes /> },
  { name: 'Faqs', link: '/admin/faqs', icon: <FaQq /> },
  { name: 'Banner', link: '/admin/banners', icon: <GalleryVertical /> },
  { name: 'Admins', link: '/admin/admins', icon: <FaUserShield /> },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={`fixed top-0 left-0 h-full text-[#212529] bg-[#eaeaeb] dark:bg-[#0e1726] dark:text-[#888ea8] shadow-lg z-50 transition-all ease-in-out duration-500 
      ${isExpanded ? 'w-64' : 'w-[70px] md:w-[90px]'} flex flex-col overflow-hidden`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Brand Logo */}
      <Link href="/">
      <div className="flex items-center px-4 py-4 border-b border-gray-400 dark:border-[#888ea8]">
        <img src="/flame1.png" alt="Logo" className="w-10 h-10" />
        {isExpanded && <h1 className="ml-3 text-lg font-bold text-[#3C0184] dark:text-white">Flames</h1>}
      </div>
      </Link>

      {/* Scrollable Menu Items */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
      <nav className="flex flex-col py-4">
          {menuList.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className={`flex items-center gap-4 px-4 py-3 transition-colors rounded-lg cursor-pointer 
              ${pathname === item.link ? 'bg-cyan-800 text-white' : 'hover:bg-indigo-200 dark:hover:bg-[#1e2737]'}`}
            >
              <div className="text-xl text-purple-700 dark:text-[#22c7d5]">{item.icon}</div>
              {isExpanded && <span className="text-base font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Button (Always at Bottom) */}
      <div className="px-4 py-3 border-t border-gray-400 dark:border-[#888ea8]">
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
          className="flex items-center gap-4 w-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-all rounded-lg px-4 py-3"
        >
          <FiLogOut className="text-xl" />
          {isExpanded && <span className="text-base font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
