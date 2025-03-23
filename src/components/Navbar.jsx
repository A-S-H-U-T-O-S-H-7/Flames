"use client"
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, User, Menu, X, ChevronDown } from "lucide-react";
import LogoutButton from "./LogoutButton";
import AuthContextProvider from "@/context/AuthContext";
import HeaderClientButtons from "./HeaderClientButtons";
import AdminButton from "./AdminButton";
import { useRouter } from "next/navigation";

const searchKeywords = ["jewelry", "accessories", "home decor", "rings", "earrings"];

const Navbar = ({categories, collections}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search for products...");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState({ 
    category: false, 
    collection: false,
    mobileCat: false,
    mobileColl: false 
  });

  const searchRef = useRef(null);
  const placeholderTimeoutRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        setShowSuggestions(false);
      }
    }
  };

  // Handle search suggestions without debounce for immediate feedback
  const handleSearchInput = (query) => {
    setSearchQuery(query);
    
    if (query.length > 1) {
      const filtered = searchKeywords.filter(keyword => 
        keyword.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Search placeholder animation
useEffect(() => {
  const isBrowser = typeof window !== 'undefined';
  if (!isBrowser) return;
  
  // Clear any existing timeout to prevent memory leaks
  if (placeholderTimeoutRef.current) {
    clearTimeout(placeholderTimeoutRef.current);
  }
  
  let currentIndex = 0;
  
  const rotatePlaceholders = () => {
    const nextIndex = (currentIndex + 1) % searchKeywords.length;
    
    // Fade out
    setSearchPlaceholder("");
    
    placeholderTimeoutRef.current = setTimeout(() => {
      // Set new text
      setSearchPlaceholder(`Search for ${searchKeywords[nextIndex]}...`);
      currentIndex = nextIndex;
      
      // Schedule next rotation
      placeholderTimeoutRef.current = setTimeout(rotatePlaceholders, 3000);
    }, 200);
  };
  
  // Start the rotation with a slight delay to ensure hydration completes first
  placeholderTimeoutRef.current = setTimeout(rotatePlaceholders, 3000);
  
  return () => {
    if (placeholderTimeoutRef.current) {
      clearTimeout(placeholderTimeoutRef.current);
    }
  };
}, []);

  return (
    <div className="sticky top-0 z-50 bg-white shadow-lg">
      {/* Main Navbar */}
      <nav className="px-3 md:px-[30px]">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 rounded-full hover:bg-purple-100">
              <Menu className="h-6 w-6 text-purple-700" />
            </button>
            <Link href="/" className="flex items-center">
              <Image src="/flame1.png" alt="Logo" width={40} height={40} className="object-contain" />
              <span className="text-2xl font-heading text-purple-700">Flames</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/" className="text-purple-800 font-medium font-heading px-4 py-2 rounded-md transition-colors">
              Home
            </Link>
            <Link href="/category/Dv3q9Y7sbPx1Ewtz3AmQ" className="text-purple-800 font-heading font-medium px-4 py-2 rounded-md transition-colors">
              Gifts
            </Link>

            <div className="relative group">
              <button className="flex items-center font-heading space-x-1 text-purple-800 font-medium px-4 py-2 rounded-md transition-colors">
                <span>Categories</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="hidden group-hover:grid grid-cols-2 absolute left-0 mt-0 w-64 bg-white shadow-xl rounded-md py-2 border border-purple-100 z-50">
                {categories?.map((category) => (
                  <Link key={category.id} href={`/category/${category?.id}`} className="block px-4 py-2 text-purple-800 hover:bg-purple-50">
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center font-heading space-x-1 text-purple-900 font-medium px-4 py-2 rounded-md transition-colors">
                <span>Collections</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="hidden group-hover:grid grid-cols-2 absolute left-0 mt-0 w-64 bg-white shadow-xl rounded-md py-2 border border-purple-100 z-50">
                {collections?.map((collection) => (
                  <Link key={collection.id} href={`/collections/${collection?.id}`} className="block px-4 py-2 text-purple-800 hover:bg-purple-50">
                    {collection.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="relative w-64" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onKeyDown={handleSearch}
                  onFocus={() => searchQuery.length > 1 && setShowSuggestions(suggestions.length > 0)}
                  className="w-full text-gray-800 font-body px-4 py-1.5 rounded-lg border border-purple-400 focus:outline-none focus:border-purple-500"
                />
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center h-6 w-6 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors"
                  onClick={handleSearch}
                  aria-label="Search"
                  title="Click to search"
                >
                  <Search className="h-4 w-4 text-purple-700" />
                </button>
              </div>
              
              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white border border-purple-200 rounded-md shadow-lg mt-1 z-50">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-gray-800"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setShowSuggestions(false);
                        router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-1 md:space-x-4">
            <AuthContextProvider>
              <HeaderClientButtons/>
            </AuthContextProvider>

            <div className="relative group">
              <button className="flex items-center font-heading space-x-1 text-purple-900 font-medium px-4 py-2 rounded-md transition-colors">
                <User className="h-6 w-6 text-purple-700" />
              </button>
              <div className="hidden group-hover:block absolute right-0 mt-0 w-36 bg-white shadow-xl rounded-md py-2 border border-purple-100 z-50">
                <Link href="/myaccount" className="flex items-center justify-center gap-2 px-4 py-2 text-purple-900 hover:bg-purple-50">
                  <User className="w-4 h-4 flex"/>Profile
                </Link>
                
                <div className="flex flex-col gap-2 mx-2 justify-center">
                  <AuthContextProvider>
                    <AdminButton/>
                    <LogoutButton/>
                  </AuthContextProvider>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Below Navbar) */}
        <div className="lg:hidden py-2 px-2 border-t border-purple-200">
          <div className="relative" ref={searchRef}>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={handleSearch}
              onFocus={() => searchQuery.length > 1 && setShowSuggestions(suggestions.length > 0)}
              className="w-full px-4 py-1.5 text-gray-800 rounded-lg border-2 border-purple-200 focus:outline-none focus:border-purple-500"
            />
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center h-6 w-6 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors"
              onClick={handleSearch}
              aria-label="Search"
              title="Click to search"
            >
              <Search className="h-4 w-4 text-purple-700" />
            </button>
            
            {/* Mobile Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-purple-200 rounded-md shadow-lg mt-1 z-50">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-gray-800"
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setShowSuggestions(false);
                      router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 overflow-y-auto"
            >
              {/* Logo and Close Button */}
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Image src="/flame1.png" alt="Logo" width={35} height={35} />
                  <span className="text-xl font-heading font-bold text-purple-700">Flames</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="p-2 rounded-full hover:bg-purple-100"
                >
                  <X className="h-6 w-6 text-purple-700" />
                </button>
              </div>

              {/* Banner Image */}
              <div className="px-4 pb-4">
                <div className="relative h-32 w-full rounded-lg overflow-hidden">
                <Image
  src="/mobilebanner.webp"
  alt="Banner"
  fill
  style={{ objectFit: "cover" }}
  className="opacity-90"
/>
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-purple-600/30" />
                </div>
              </div>

              {/* Mobile Menu Items */}
              <div className="py-4">
                <Link href="/" className="block px-4 py-2 text-purple-900 font-heading font-medium hover:bg-purple-50">
                  Home
                </Link>
                <Link href="/category/Dv3q9Y7sbPx1Ewtz3AmQ" className="block px-4 py-2 text-purple-900 font-heading font-medium hover:bg-purple-50">
                  Gifts
                </Link>

                {/* Mobile Categories Dropdown */}
                <div>
                  <button
                    onClick={() => setIsDropdownOpen(prev => ({ ...prev, mobileCat: !prev.mobileCat }))}
                    className="w-full px-4 py-2 text-purple-900 font-heading font-medium hover:bg-purple-50 flex justify-between items-center"
                  >
                    <span>Categories</span>
                    <ChevronDown className={`h-4 w-4 transform transition-transform ${isDropdownOpen.mobileCat ? 'rotate-180' : ''}`} />
                  </button>
                  {isDropdownOpen.mobileCat && (
                    <div className="bg-purple-50 grid grid-cols-2">
                      {categories?.map((category) => (
                        <Link key={category.id} href={`/category/${category?.id}`} className="block px-4 py-2 text-purple-900 font-heading">
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Collections Dropdown */}
                <div>
                  <button
                    onClick={() => setIsDropdownOpen(prev => ({ ...prev, mobileColl: !prev.mobileColl }))}
                    className="w-full px-4 py-2 text-purple-900 font-heading font-medium hover:bg-purple-50 flex justify-between items-center"
                  >
                    <span>Collections</span>
                    <ChevronDown className={`h-4 w-4 transform transition-transform ${isDropdownOpen.mobileColl ? 'rotate-180' : ''}`} />
                  </button>
                  {isDropdownOpen.mobileColl && (
                    <div className="bg-purple-50 grid grid-cols-2">
                      {collections?.map((collection) => (
                        <Link key={collection.id} href={`/collections/${collection?.id}`} className="block px-4 py-2 text-purple-900 font-heading">
                          {collection.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Auth Buttons */}
                <div className="mt-4 border-t border-purple-100 pt-4 px-4">
                  <AuthContextProvider>
                    <LogoutButton/>
                  </AuthContextProvider>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;