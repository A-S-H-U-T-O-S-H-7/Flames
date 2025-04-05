"use client";

import { useState } from "react";
import { LogOut, LogIn, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firestore/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";

export default function LogoutButton() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 font-medium flex items-center justify-center gap-2 text-purple-900 hover:bg-purple-50 rounded-full transition-all"
      >
        <LogIn className="w-4 h-4 flex" />
        Log In
      </Link>
    );
  }

  const handleLogout = async () => {
    try {
      await toast.promise(signOut(auth), {
        error: (e) => e?.message,
        loading: "Loading...",
        success: "Successfully Logged out",
      });
      setShowModal(false);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center rounded-full bg-gray-100 justify-center gap-2 px-4 py-2 text-red-500 hover:bg-purple-50 transition-all"
      >
        <LogOut size={14} />
        Logout
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Confirm Logout</h3>
              <button 
                onPress={() => setShowModal(false)}
                className=" text-red-600 hover:text-gray-500 transition-all rounded-full p-1 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="px-6 pb-6">
              <p className="text-gray-600">Are you sure you want to log out of your account?</p>
            </div>
            
            <div className="px-6 pb-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-full text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium hover:from-purple-700 hover:to-purple-800 shadow-sm hover:shadow transition-all"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}