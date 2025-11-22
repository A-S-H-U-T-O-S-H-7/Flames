"use client";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firestore/firebase";
import { createUser } from "@/lib/firestore/user/write";
import { Button } from "@nextui-org/react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Loading animation component
const LoadingTransition = ({ isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isActive ? { opacity: 1 } : { opacity: 0 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm ${
        !isActive && "pointer-events-none"
      }`}
    >
      <div className="relative w-64 h-64">
        {/* Diamond animation */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <path
              d="M50 5L95 50L50 95L5 50L50 5Z"
              fill="rgba(147, 51, 234, 0.2)"
              stroke="rgba(147, 51, 234, 0.8)"
              strokeWidth="2"
            />
          </svg>
        </motion.div>
        
        {/* Inner sparkle */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M20 2L38 20L20 38L2 20L20 2Z"
              fill="rgba(147, 51, 234, 0.7)"
              stroke="white"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
        
        <motion.p
          className="absolute bottom-0 left-0 right-0 text-center text-white font-light"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Unveiling your elegance...
        </motion.p>
      </div>
    </motion.div>
  );
};

// Background animated shapes
const BackgroundShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Diamond shape */}
      <motion.div
        className="absolute top-20 right-24"
        animate={{
          y: [0, 15, 0],
          rotate: [0, 10, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <path
            d="M60 10L110 60L60 110L10 60L60 10Z"
            fill="none"
            stroke="rgba(147, 51, 234, 0.2)"
            strokeWidth="1"
          />
        </svg>
      </motion.div>
      
      {/* Circle */}
      <motion.div
        className="absolute bottom-32 left-16"
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="39" stroke="rgba(147, 51, 234, 0.15)" strokeWidth="1" />
        </svg>
      </motion.div>
      
      {/* Small diamond */}
      <motion.div
        className="absolute top-1/2 left-1/4"
        animate={{
          x: [0, 15, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path
            d="M25 5L45 25L25 45L5 25L25 5Z"
            fill="none"
            stroke="rgba(147, 51, 234, 0.1)"
            strokeWidth="1"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [showTransition, setShowTransition] = useState(false);

  const handleData = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data?.email, data?.password);
      setShowTransition(true);
      toast.success("Logged In Successfully");
      // Delay the redirect slightly to show the animation
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      toast.error(error?.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setShowTransition(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [user]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      <LoadingTransition isActive={showTransition} />
      <BackgroundShapes />
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img 
              className="mx-auto h-20 w-auto drop-shadow-lg" 
              src="/flame1.png" 
              alt="Logo" 
            />
          </motion.div>
          <motion.h2 
            className="mt-6 text-3xl font-extrabold text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Elevate Your Style
          </motion.h2>
          <motion.p 
            className="mt-2 text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Sign in to discover our exclusive collection
          </motion.p>
        </motion.div>

        <motion.div 
          className="mt-8 bg-white py-8 px-6 shadow-2xl sm:rounded-3xl sm:px-10 space-y-6 backdrop-blur bg-opacity-80 border border-purple-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-5"
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <label htmlFor="user-email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
                <input
                  placeholder="Enter your email"
                  type="email"
                  name="user-email"
                  id="user-email"
                  value={data?.email}
                  onChange={(e) => handleData("email", e.target.value)}
                  className="mt-1 block text-gray-700 w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <label htmlFor="user-password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
                <input
                  placeholder="Enter your password"
                  type="password"
                  name="user-password"
                  id="user-password"
                  value={data?.password}
                  onChange={(e) => handleData("password", e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                isLoading={isLoading}
                isDisabled={isLoading || showTransition}
                type="submit"
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </motion.div>
          </form>

          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05, x: 2 }}>
              <Link 
                href="/signup"
                className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors duration-200"
              >
                Create new account
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, x: -2 }}>
              <Link 
                href="/forget-password"
                className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
          >
            <SignInWithGoogleComponent setShowTransition={setShowTransition} />
          </motion.div>
        </motion.div>
        
        <motion.div
          className="text-center text-xs text-gray-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          Exclusive designs await. Sign in to explore our premium collection.
        </motion.div>
      </div>
    </main>
  );
}

function SignInWithGoogleComponent({ setShowTransition }) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = credential.user;
      await createUser({
        uid: user?.uid,
        displayName: user?.displayName,
        photoURL: user?.photoURL,
        email: user?.email,
      });
      setShowTransition(true);
      // Delay the redirect to show the animation, then go home
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      }
    } catch (error) {
      toast.error(error?.message);
      setIsLoading(false);
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        isLoading={isLoading}
        isDisabled={isLoading}
        onClick={handleLogin}
        className="w-full py-3.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 flex items-center justify-center gap-2"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {isLoading ? "Signing in..." : "Sign in with Google"}
      </Button>
    </motion.div>
  );
}