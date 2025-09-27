"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Header from "@/components/Admin/Header";
import Sidebar from "@/components/Admin/Sidebar";
import { useAuth } from "@/context/AuthContext";
import PermissionContextProvider from "@/context/PermissionContext";
import { CircularProgress } from "@nextui-org/react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firestore/firebase";
import { useAdmin } from "@/lib/firestore/admins/read";


export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef(null);
  const { user } = useAuth();
  
  // Assuming useAdmin is a custom hook that's properly imported
  const { data: Admin, error, isLoading } = useAdmin({ email: user?.email });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(false); 
  }, [pathname]);

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
      <div className="flex justify-center items-center h-screen w-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!Admin) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center h-screen w-screen">
        <h2 className="font-bold">You are not an admin</h2>
        <h2 className="text-gray-600 text-sm">{user?.email}</h2>
        <button onClick={async () => { await signOut(auth) }}>Log Out</button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <h2 className="text-red-500">{error}</h2>
      </div>
    );
  }

  return (
    <PermissionContextProvider>
      <main className="relative h-screen flex">
        {/* Sidebar for Desktop */}
        <div className="hidden md:block">
          <Sidebar isSidebarOpen={true} toggleSidebar={toggleSidebar} />
        </div>

        {/* Sidebar for Mobile */}
        <div
          ref={sidebarRef}
          className={`fixed md:hidden transition-all duration-300 z-20 bg-white dark:bg-gray-800 shadow-lg h-screen w-[260px] 
          ${isOpen ? "left-0" : "-left-[260px]"}`}
        >
          <Sidebar isSidebarOpen={isOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content */}
        <section className="flex-1 flex flex-col">
          <Header toggleSidebar={toggleSidebar} />
          <section className="flex-1 ml-[90px] bg-[#eff3f4] dark:bg-gray-900">
            {children}
          </section>
        </section>
      </main>
    </PermissionContextProvider>
  );
}