"use client";


import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/lib/firestore/admins/read";
import { User } from "lucide-react";
import Link from "next/link";

export default function AdminButton() {
  const { user } = useAuth();
  const { data } = useAdmin({ email: user?.email });
  if (!data) {
    return <></>;
  }
  return (
    
      <Link href="/admin/dashboard" className="flex items-center justify-center gap-2 px-4 py-2 text-purple-900 hover:bg-purple-50">
      <User className="w-4 h-4 flex"/>Admin</Link>
    
  );
}