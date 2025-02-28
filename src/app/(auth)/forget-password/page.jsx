"use client";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firestore/firebase";
import { Button } from "@nextui-org/react";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({ email: "" });

  const handleData = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const handleSendEmail = async () => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data?.email);
      toast.success("Reset link has been sent to your email!");
      router.push("/login");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img 
            className="mx-auto h-16 w-auto transform hover:scale-105 transition-transform duration-300" 
            src="/flame1.png" 
            alt="Logo" 
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendEmail();
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="user-email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                placeholder="Enter your email"
                type="email"
                name="user-email"
                id="user-email"
                value={data?.email}
                onChange={(e) => handleData("email", e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                required
              />
            </div>

            <Button
              isLoading={isLoading}
              isDisabled={isLoading}
              type="submit"
              className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="text-center">
            <Link 
              href="/login"
              className="text-sm font-medium text-purple-500 hover:text-purple-600 transition-colors duration-200"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}