"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Header from "@/components/Admin/Header";
import Sidebar from "@/components/Admin/Sidebar";
import { useAuth } from "@/context/AuthContext";
import PermissionContextProvider from "@/context/PermissionContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CircularProgress } from "@nextui-org/react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firestore/firebase";
import { useAdmin } from "@/lib/firestore/admins/read";
import { ROLES } from "@/lib/permissions/adminPermissions";

export default function AdminLayout({ children }) {
  return (
    <ThemeProvider>
      <AdminContent>{children}</AdminContent>
    </ThemeProvider>
  );
}

function AdminContent({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef(null);
  const { user } = useAuth();
  
  const { data: Admin, error, isLoading } = useAdmin({ email: user?.email });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(false); 
  }, [pathname]);

  useEffect(() => {
    if (Admin && Admin.role === ROLES.SELLER) {
      router.push('/sellers/dashboard');
      return;
    }
  }, [Admin, router]);

  useEffect(() => {
    function handleOutsideEvent(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false); 
      }
    }
    document.addEventListener("mousedown", handleOutsideEvent);
    return () => {
      document.removeEventListener("mousedown", handleOutsideEvent);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-white dark:bg-slate-900">
        <CircularProgress />
      </div>
    );
  }

  if (!Admin && !isLoading) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center h-screen w-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
        <h2 className="font-bold text-xl">Access Denied</h2>
        <h2 className="text-gray-600 dark:text-gray-400 text-sm">You are not authorized to access the admin panel</h2>
        <p className="text-gray-500 dark:text-gray-500 text-xs">{user?.email}</p>
        <button 
          onClick={async () => { 
            try {
              await signOut(auth);
            } catch (error) {
              console.error('Logout error:', error);
            }
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Log Out
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center h-screen w-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
        <h2 className="text-red-500 text-xl font-bold">Error Loading Admin Panel</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <PermissionContextProvider>
      <main className="relative h-screen flex bg-white dark:bg-slate-900">
        {/* Sidebar for Desktop */}
        <div className="hidden md:block">
          <Sidebar isSidebarOpen={true} toggleSidebar={toggleSidebar} />
        </div>

        {/* Sidebar for Mobile */}
        <div
          ref={sidebarRef}
          className={`fixed md:hidden transition-all duration-300 z-20 bg-white dark:bg-slate-800 shadow-lg h-screen w-[260px] 
          ${isOpen ? "left-0" : "-left-[260px]"}`}
        >
          <Sidebar isSidebarOpen={isOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content */}
        <section className="flex-1 flex flex-col">
          <Header />
          <section className="flex-1 ml-[90px] bg-[#eff3f4] dark:bg-slate-800">
            {children}
          </section>
        </section>
      </main> 
    </PermissionContextProvider>
  );
}