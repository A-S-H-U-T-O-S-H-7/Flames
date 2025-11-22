"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { CircularProgress } from "@nextui-org/react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firestore/firebase";
import { useSeller } from "@/lib/firestore/sellers/read";
import SellerSidebar from "./SellerSidebar";
import SellerHeader from "./SellerHeader";
import SellerWelcomePopup from "./WelcomePopoup";
// FCM imports
import { useFCM } from "@/hooks/useFCM";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firestore/firebase";

export default function SellerLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef(null);
  const { user } = useAuth();
  
  const { data: seller, error, isLoading } = useSeller({ email: user?.email });
  const { requestPermission } = useFCM(); // FCM hook

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // FCM Setup - FIXED: Added proper cleanup and error handling
  useEffect(() => {
    let unsubscribe = () => {};

    if (seller?.id && user?.email) {
      // Initialize FCM for seller
      const initializeFCM = async () => {
        try {
          await requestPermission(seller.id, user.email);
          console.log('FCM initialized for seller:', seller.id);
        } catch (error) {
          console.error('FCM initialization failed:', error);
          // Don't break the app if FCM fails
        }
      };

      initializeFCM();

      // Handle foreground messages - only if messaging is available
      if (messaging) {
        try {
          unsubscribe = onMessage(messaging, (payload) => {
            console.log('Foreground message received:', payload);
            
            // Show notification to user
            if (payload.notification) {
              const { title, body } = payload.notification;
              
              // Create browser notification
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(title, { 
                  body, 
                  icon: '/flame1.png',
                  badge: '/flame1.png'
                });
              }
              
              console.log('New notification:', { title, body });
            }
          });
        } catch (messagingError) {
          console.error('Failed to set up message listener:', messagingError);
        }
      }
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [seller?.id, user?.email, requestPermission]);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Show welcome popup for first-time users - FIXED: Added dependency array
  useEffect(() => {
    if (seller && user?.email) {
      const welcomeKey = `seller_welcome_${user.email}`;
      const hasSeenWelcome = typeof window !== 'undefined' && localStorage.getItem(welcomeKey);
      
      if (!hasSeenWelcome) {
        setTimeout(() => setShowWelcome(true), 1000);
        if (typeof window !== 'undefined') {
          localStorage.setItem(welcomeKey, 'true');
        }
      }
    }
  }, [seller, user?.email]); // FIXED: Added proper dependencies

  // Close sidebar when clicking outside - FIXED: Better cleanup
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <CircularProgress />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center h-screen w-screen">
        <h2 className="text-red-500 text-xl font-bold">Error Loading Seller Panel</h2>
        <p className="text-gray-600 text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // FIXED: Added null check for seller in the return
  if (!seller) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <CircularProgress label="Loading seller data..." />
      </div>
    );
  }

  return (
    <>
      {showWelcome && (
        <SellerWelcomePopup 
          sellerName={seller.businessName || seller.personalInfo?.fullName || 'Seller'} 
          onClose={() => setShowWelcome(false)} 
        />
      )}

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <main className="relative h-screen flex overflow-hidden">
        {/* Sidebar - Works for both mobile and desktop */}
        <SellerSidebar 
          seller={seller}
          isOpen={isOpen}
          toggleSidebar={toggleSidebar} 
          ref={sidebarRef} // FIXED: Added ref to sidebar
        />

        {/* Main Content */}
        <section className="flex-1 flex flex-col overflow-hidden">
          <SellerHeader 
            seller={seller}
            onMenuToggle={toggleSidebar} 
          />
          <section className="flex-1 bg-[#eff3f4] dark:bg-gray-900 overflow-y-auto overflow-x-hidden">
            <div className="p-4 lg:pl-24 lg:pr-6 max-w-[1600px] mx-auto w-full">
              {children}
            </div>
          </section>
        </section>
      </main>
    </>
  );
}