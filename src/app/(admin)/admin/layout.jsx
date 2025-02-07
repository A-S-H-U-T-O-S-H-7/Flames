"use client";

import AdminLayout from "@/components/Admin/AdminLayout";
import AuthContextProvider, { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Layout({ children }) {
  return (
    <div>
      <AuthContextProvider>
        <AdminChecking>{children}</AdminChecking>
      </AuthContextProvider>
    </div>
  );
}

function AdminChecking({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <h1>Please Login first</h1>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}

