"use client";
import { useAuth } from "@/context/AuthContext";
import { auth, storage } from "@/lib/firestore/firebase";
import { createUser } from "@/lib/firestore/user/write";
import { Button } from "@nextui-org/react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Loading animation component - now with key for consistent rendering
const LoadingTransition = ({ isActive }) => {
  return (
    <motion.div
      key="loading-transition"
      initial={{ opacity: 0 }}
      animate={isActive ? { opacity: 1 } : { opacity: 0 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm ${
        !isActive && "pointer-events-none"
      }`}
    >
      <div className="relative w-64 h-64">
        {/* Diamond animation with fixed values */}
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
            repeatType: "loop"
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
        
        {/* Inner sparkle with fixed animation values */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop"
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
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
        >
          Unveiling your elegance...
        </motion.p>
      </div>
    </motion.div>
  );
};

// Background animated shapes with fixed animation values
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
          repeatType: "loop"
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
          repeatType: "loop"
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
          repeatType: "loop"
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

// Profile photo upload component
const ProfilePhotoUpload = ({ photoURL, setPhotoURL, photoFile, setPhotoFile }) => {
  const fileInputRef = useRef(null);
  
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoURL(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <label className="text-sm font-medium text-gray-700 mb-1">Profile Photo (Optional)</label>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative cursor-pointer"
        onClick={triggerFileInput}
      >
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-200 bg-gray-50 flex items-center justify-center relative">
          {photoURL ? (
            <img 
              src={photoURL} 
              alt="Profile Preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          )}
          
          {/* Overlay with camera icon */}
          <motion.div 
            className="absolute inset-0 bg-purple-500 bg-opacity-0 hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center"
            whileHover={{ opacity: 1 }}
            initial={{ opacity: 0 }}
          >
            <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </motion.div>
        </div>
        
        {/* Fixed sparkling effect with predetermined animation values */}
        <motion.div 
          className="absolute -inset-1 rounded-full opacity-50"
          animate={{ 
            boxShadow: ["0 0 0px rgba(147, 51, 234, 0)", "0 0 8px rgba(147, 51, 234, 0.5)", "0 0 0px rgba(147, 51, 234, 0)"] 
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
        />
      </motion.div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoChange}
        className="hidden"
        accept="image/*"
      />
      
      <motion.p 
        className="text-xs text-gray-500 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Click to {photoURL ? "change" : "add"} photo
      </motion.p>
    </div>
  );
};

// Main component with proper client-side initialization
export default function Page() {
  // To fix the hydration issue, separate client-side state initialization
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const { user: authUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // Update our local user state safely after hydration
  useEffect(() => {
    setUser(authUser);
    setInitialized(true);
  }, [authUser]);

  const handleData = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      // Create user with email and password
      const credential = await createUserWithEmailAndPassword(
        auth,
        data?.email,
        data?.password
      );
      
      let profilePhotoURL = null;
      
      // If user uploaded a photo, upload it to storage
      if (photoFile) {
        const storageRef = ref(storage, `profile_photos/${credential.user.uid}`);
        await uploadBytes(storageRef, photoFile);
        profilePhotoURL = await getDownloadURL(storageRef);
      }
      
      // Update profile with name and photo URL if available
      await updateProfile(credential.user, {
        displayName: data?.name,
        photoURL: profilePhotoURL
      });
      
      // Create user document in Firestore
      await createUser({
        uid: credential.user?.uid,
        displayName: data?.name,
        email: data?.email,
        photoURL: profilePhotoURL,
      });
      
      toast.success("Account created successfully");
      setShowTransition(true);
      
      // Delay the redirect to show transition animation
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      toast.error(error?.message);
      setIsLoading(false);
    }
  };

  // Only run client-side effects after initialization
  useEffect(() => {
    if (initialized && user) {
      setShowTransition(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [user, initialized, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      {/* Only render client-side components after initialization */}
      {initialized && (
        <>
          <LoadingTransition isActive={showTransition} />
          <BackgroundShapes />
        </>
      )}
      
      <div className="max-w-md w-full space-y-2 relative z-10">
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
              className="mx-auto h-16 w-auto drop-shadow-lg" 
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
            Create Your Account
          </motion.h2>
          <motion.p 
            className="mt-2 text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Create your personal profile to discover luxury
          </motion.p>
        </motion.div>

        <motion.div 
          className="mt-8 bg-white py-6 px-6 shadow-2xl sm:rounded-3xl sm:px-10 space-y-4 backdrop-blur bg-opacity-80 border border-purple-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <ProfilePhotoUpload 
            photoURL={photoURL} 
            setPhotoURL={setPhotoURL} 
            photoFile={photoFile} 
            setPhotoFile={setPhotoFile} 
          />
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
            }}
            className="space-y-5"
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <label htmlFor="user-name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
                <input
                  placeholder="Enter your name"
                  type="text"
                  name="user-name"
                  id="user-name"
                  value={data?.name}
                  onChange={(e) => handleData("name", e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
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
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <label htmlFor="user-password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
                <input
                  placeholder="Create a password"
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
              transition={{ delay: 0.8, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                isLoading={isLoading}
                isDisabled={isLoading || showTransition}
                type="submit"
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
              >
                {isLoading ? "Creating your profile..." : "Create Account"}
              </Button>
            </motion.div>
          </form>

          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                href="/login"
                className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors duration-200"
              >
                Already have an account? Sign in
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div
          className="text-center text-xs text-gray-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
        >
          By creating an account, you'll gain access to exclusive designs and personalized recommendations.
        </motion.div>
      </div>
    </main>
  );
}