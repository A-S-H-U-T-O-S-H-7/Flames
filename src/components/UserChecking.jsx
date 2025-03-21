"use client";

import { useAuth } from "@/context/AuthContext";
import { CircularProgress } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";

export default function UserChecking({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50">
        <CircularProgress color="secondary" size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col justify-center items-center p-4 space-y-6">
        <div className="w-64 h-64 relative">
          <Image
            src="/mobilelogin1.gif"
            alt="Login animation"
            layout="fill"
            objectFit="contain"
          />
        </div>
        
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-purple-800">Access Required</h2>
          <p className="text-gray-700 font-medium mb-4">
            Please log in to access this content
          </p>
          
          <Link href="/login">
            <button className="bg-purple-600 mt-4 hover:bg-purple-700 transition-colors duration-300 rounded-lg px-6 py-3 text-white font-semibold shadow-md hover:shadow-lg">
              Log In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}