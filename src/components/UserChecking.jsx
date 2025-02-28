"use client"; 

import { useAuth } from "@/context/AuthContext";
import { CircularProgress } from "@nextui-org/react";
import Link from "next/link";

export default function UserChecking({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-96 flex justify-center items-center">
        <p>You are not logged in</p>
        <Link href="/login">
          <button className="flex bg-purple-500 rounded-md px-2 py-1 text-white font-semibold">
            Login
          </button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
