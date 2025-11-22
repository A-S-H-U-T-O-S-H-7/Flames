"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firestore/firebase';
import { getSellerByEmail } from '@/lib/firestore/sellers/read';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sun, 
  Moon, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Shield,
  Store,
  ArrowLeft,
  Sparkles,
  Cloud
} from 'lucide-react';

// Password hashing utility
const simpleHash = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

const verifyPassword = async (password, hashedPassword) => {
  const testHash = await simpleHash(password);
  return testHash === hashedPassword;
};

// Theme Toggle Component
const ThemeToggle = ({ darkMode, setDarkMode }) => {
  return (
    <motion.button
      onClick={() => setDarkMode(!darkMode)}
      className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none ${
        darkMode ? 'bg-slate-700' : 'bg-amber-100'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`w-6 h-6 rounded-full shadow-lg flex items-center justify-center ${
          darkMode 
            ? 'bg-gradient-to-br from-amber-200 to-amber-400' 
            : 'bg-gradient-to-br from-amber-500 to-amber-600'
        }`}
        animate={{ x: darkMode ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {darkMode ? (
          <Moon className="w-3 h-3 text-slate-800" />
        ) : (
          <Sun className="w-3 h-3 text-white" />
        )}
      </motion.div>
    </motion.button>
  );
};

// Animated Background Elements
const AnimatedBackground = ({ darkMode }) => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base Background */}
      <div className={`absolute inset-0 transition-colors duration-500 ${
        darkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-sky-50 via-blue-50 to-amber-50'
      }`} />
      
      {/* Animated Elements */}
      <AnimatePresence>
        {darkMode ? (
          // Night Theme - Stars
          <>
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                initial={{ 
                  opacity: 0,
                  scale: 0 
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
                style={{
                  width: Math.random() * 2 + 1,
                  height: Math.random() * 2 + 1,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
            {/* Shooting Stars */}
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={`shooting-${i}`}
                className="absolute w-0.5 h-0.5 bg-white rounded-full"
                animate={{
                  x: [0, 300],
                  y: [0, 300],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 10,
                  ease: "easeOut"
                }}
                style={{
                  left: `${Math.random() * 40}%`,
                  top: `${Math.random() * 40}%`,
                }}
              />
            ))}
          </>
        ) : (
          // Day Theme - Clouds
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                animate={{
                  x: [0, 50, 0],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: Math.random() * 20 + 15,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 40 + 10}%`,
                }}
              >
                <Cloud className={`w-16 h-16 ${
                  i % 2 === 0 ? 'text-sky-200/60' : 'text-sky-300/40'
                }`} />
              </motion.div>
            ))}
            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute rounded-full bg-amber-200/20"
                animate={{
                  y: [0, -20, 0],
                  x: [0, Math.random() * 15 - 7.5, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
                style={{
                  width: Math.random() * 6 + 3,
                  height: Math.random() * 6 + 3,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Loading Overlay
const LoadingOverlay = ({ isActive }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl"
        >
          <motion.div 
            className="flex flex-col items-center gap-8"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring" }}
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-24 h-24"
              >
                <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-amber-400/60"></div>
              </motion.div>
              
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 w-20 h-20"
              >
                <div className="absolute inset-0 rounded-full border-b-4 border-l-4 border-slate-400/60"></div>
              </motion.div>
              
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-6 bg-amber-400 rounded-full blur-xl opacity-60 animate-pulse"></div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative"
                >
                  <Shield className="w-10 h-10 text-white drop-shadow-2xl" />
                </motion.div>
              </div>
            </div>
            
            <motion.div className="text-center space-y-3">
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-white text-xl font-semibold"
              >
                Verifying Credentials
              </motion.p>
              <div className="flex gap-1.5 justify-center">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      height: ["6px", "20px", "6px"],
                      backgroundColor: ["#f59e0b", "#d97706", "#f59e0b"]
                    }}
                    transition={{ 
                      duration: 1.2, 
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut"
                    }}
                    className="w-1.5 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function SellerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check system preference
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  const handleSellerLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔐 Starting seller login for:', email);
      
      // 1. Check if seller exists with this email
      const sellerResult = await getSellerByEmail(email);
      
      if (!sellerResult.success) {
        toast.error('No seller account found with this email');
        setLoading(false);
        return;
      }

      const seller = sellerResult.data;
      console.log('📋 Seller found:', seller.sellerId, 'Status:', seller.status);

      // 2. Check if seller account is approved
      if (seller.status !== 'approved') {
        toast.error('Seller account not approved yet');
        setLoading(false);
        return;
      }

      // 3. Check if seller account is activated
      if (!seller.sellerCredentials?.isActivated) {
        toast.error('Seller account not activated. Please complete activation first.');
        setLoading(false);
        return;
      }

      // 4. Check if seller account is suspended
      if (seller.sellerCredentials?.isSuspended) {
        toast.error('Your seller account has been suspended');
        setLoading(false);
        return;
      }

      // 5. Verify the seller-specific password
      console.log('🔑 Verifying seller password...');
      const isPasswordValid = await verifyPassword(
        password, 
        seller.sellerCredentials.sellerPassword
      );

      if (!isPasswordValid) {
        toast.error('Invalid seller password');
        setLoading(false);
        return;
      }

      console.log('✅ Password verified successfully!');

      // 6. Password is correct - proceed with login
      setShowTransition(true);
      
      // Update last login timestamp
      const sellerRef = doc(db, 'sellers', seller.sellerId);
      await updateDoc(sellerRef, {
        'sellerCredentials.lastLogin': serverTimestamp()
      });

      console.log('🚀 Redirecting to seller dashboard...');

      // 7. Success - redirect to dashboard
      setTimeout(() => {
        toast.success('Welcome back! Redirecting to dashboard...');
        router.push('/sellers/dashboard');
      }, 1500);

    } catch (error) {
      console.error('❌ Seller login error:', error);
      setShowTransition(false);
      toast.error('Login failed. Please try again');
    } finally {
      setLoading(false);
    }
  };

  // Dynamic image source based on theme
  const imageSrc = darkMode ? "/seller-login4.png" : "/seller-login5.png";

  return (
    <main className="min-h-screen relative">
      <AnimatedBackground darkMode={darkMode} />
      <LoadingOverlay isActive={showTransition || loading} />
      
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="w-full max-w-7xl mx-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            
            {/* Left Side - Image and Text */}
            <motion.div 
              className="flex flex-col items-center text-center lg:text-left space-y-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Image Container - Enhanced sizing */}
              <motion.div
                className="relative w-72 h-72 xl:w-[28rem] xl:h-[24rem] 2xl:w-[32rem] 2xl:h-[26rem] mx-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Image
                  src={imageSrc}
                  alt="Seller Login"
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                  sizes="(min-width: 768px) 224px, (max-width: 768px) 224px, (max-width: 1024px) 384px, (max-width: 1280px) 448px, 512px"
                />
                {/* Floating animation */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className={`absolute -top-2 -right-2 w-6 h-6 ${
                    darkMode ? 'text-amber-400' : 'text-amber-500'
                  }`} />
                </motion.div>
              </motion.div>

              {/* Text Content - Adjusted for larger image */}
              <motion.div
                className="space-y-3 lg:space-y-4 mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className={`p-2 rounded-xl ${
                    darkMode 
                      ? 'bg-amber-500/20 border border-amber-500/30' 
                      : 'bg-amber-500/10 border border-amber-500/20'
                  }`}>
                    <Store className={`w-6 h-6 ${
                      darkMode ? 'text-amber-400' : 'text-amber-600'
                    }`} />
                  </div>
                  <h1 className={`text-2xl lg:text-3xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Welcome, Seller
                  </h1>
                </div>
                <p className={`text-base lg:text-lg leading-relaxed ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  "Consistency builds momentum and drives success"
                </p>
              </motion.div>
            </motion.div>

            {/* Right Side - Login Form */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm lg:max-w-md">
                {/* Theme Toggle */}
                <div className="flex justify-end mb-6">
                  <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                </div>

                {/* Login Card */}
                <motion.div 
                  className={`relative rounded-xl lg:rounded-2xl shadow-xl border transition-all duration-300 overflow-hidden ${
                    darkMode 
                      ? 'bg-slate-800/90 border-slate-700/50' 
                      : 'bg-white/90 border-slate-200/50'
                  } backdrop-blur-xl`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {/* Golden Top Line */}
                  <div className="h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
                  
                  <div className="p-6 lg:p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-center mb-6"
                    >
                      <h2 className={`text-xl lg:text-2xl font-bold mb-2 ${
                        darkMode ? 'text-white' : 'text-slate-800'
                      }`}>
                        Seller Login
                      </h2>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Sign in to your seller account
                      </p>
                    </motion.div>

                    <form onSubmit={handleSellerLogin} className="space-y-5">
                      {/* Email Field */}
                      <motion.div
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                            darkMode ? 'text-slate-500' : 'text-slate-400'
                          }`} />
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="your.email@business.com"
                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all duration-200 focus:outline-none text-sm ${
                              darkMode
                                ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-amber-500'
                                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500'
                            }`}
                            required
                            disabled={loading}
                          />
                        </div>
                      </motion.div>

                      {/* Password Field */}
                      <motion.div
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <label htmlFor="password" className={`block text-sm font-medium ${
                            darkMode ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            Seller Password
                          </label>
                          <Link 
                            href="/seller-forgot-password"
                            className="text-xs font-medium text-amber-600 hover:text-amber-500 transition-colors"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                            darkMode ? 'text-slate-500' : 'text-slate-400'
                          }`} />
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Enter your seller password"
                            className={`w-full pl-10 pr-10 py-2.5 rounded-lg border-2 transition-all duration-200 focus:outline-none text-sm ${
                              darkMode
                                ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-amber-500'
                                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500'
                            }`}
                            required
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                              darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
                            } transition-colors`}
                            disabled={loading}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </motion.div>

                      {/* Login Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <motion.button
                          type="submit"
                          disabled={loading || showTransition}
                          className="w-full py-2.5 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm
                                    bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 
                                    hover:from-amber-600 hover:via-amber-700 hover:to-amber-800
                                    text-white shadow-lg hover:shadow-xl
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: loading ? 1 : 1.02 }}
                          whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            <>
                              Sign In
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    </form>

                    {/* Divider */}
                    <motion.div 
                      className="relative my-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className={`absolute inset-0 flex items-center ${
                        darkMode ? 'border-slate-700' : 'border-slate-300'
                      }`}>
                        <div className="w-full border-t"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className={`px-3 text-xs ${
                          darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500'
                        }`}>
                          New to our platform?
                        </span>
                      </div>
                    </motion.div>

                    {/* Additional Links */}
                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Link
                        href="/seller-registration"
                        className={`block w-full text-center py-2.5 px-6 rounded-lg border-2 font-medium transition-all duration-200 text-sm ${
                          darkMode
                            ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                            : 'border-amber-500/50 text-amber-600 hover:bg-amber-500/10'
                        }`}
                      >
                        Create Seller Account
                      </Link>
                      
                      <Link
                        href="/"
                        className={`flex items-center justify-center gap-2 text-xs font-medium transition-colors ${
                          darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-800'
                        }`}
                      >
                        <ArrowLeft className="w-3 h-3" />
                        Back to Main Site
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}