"use client";

import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firestore/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function LogoutButton() {
  const { user } = useAuth();
  if (!user) {
    return <>
    <Link href="/login" className=" px-4 py-2 font-medium flex items-center justify-center gap-2 text-purple-900 hover:bg-purple-50">
    <LogIn className="w-4 h-4 flex" />Log In</Link>
    </>;
  }
  return (
    <button
      onClick={async () => {
        if (!confirm("Are you sure?")) return;
        try {
          await toast.promise(signOut(auth), {
            error: (e) => e?.message,
            loading: "Loading...",
            success: "Successfully Logged out",
          });
        } catch (error) {
          toast.error(error?.message);
        }
      }}
      className="flex items-center rounded-md bg-gray-100 justify-center gap-2 px-4 py-2 text-red-500 hover:bg-purple-50"
    >
      <LogOut size={14} />Logout
    </button>
  );
}