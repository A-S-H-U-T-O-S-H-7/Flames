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
import { useRouter, usePathname } from "next/navigation";

const searchKeywords = ["jewelry", "accessories", "home decor", "rings", "earrings","bags","handbags","nacklace","pendent",
  "duppata","hijab","gift", "handmade","jhumkas","bangles","locket","gold","silver","hand crafted","red",
  "green","purple","blue","premium","art","bracelets",
];

const Navbar = ({categories, collections}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search for products...");
  const router = useRouter();
  const pathname = usePathname();
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

  // Active link detection
  const isActive = (path) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  const isGiftsActive = () => {
    return pathname?.includes('/category/Dv3q9Y7sbPx1Ewtz3AmQ');
  };

  const isCategoryActive = () => {
    return pathname?.includes('/category') && !isGiftsActive();
  };

  const isCollectionActive = () => {
    return pathname?.includes('/collections');
  };

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

  // Search placeholder animation - Fix for hydration issues
  useEffect(() => {
    // Client-side only code
    const rotatePlaceholders = () => {
      const nextIndex = Math.floor(Math.random() * searchKeywords.length);
      setSearchPlaceholder(`Search for ${searchKeywords[nextIndex]}...`);
    };
    
    // Clear any existing timeout to prevent memory leaks
    if (placeholderTimeoutRef.current) {
      clearTimeout(placeholderTimeoutRef.current);
    }
    
    // Start the rotation with a delay to ensure hydration completes first
    const timeoutId = setTimeout(() => {
      rotatePlaceholders();
      
      // Set interval for subsequent rotations
      const intervalId = setInterval(rotatePlaceholders, 3000);
      
      // Store the interval ID for cleanup
      placeholderTimeoutRef.current = intervalId;
    }, 3000);
    
    return () => {
      clearTimeout(timeoutId);
      if (placeholderTimeoutRef.current) {
        clearInterval(placeholderTimeoutRef.current);
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
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-4">
            <Link 
              href="/" 
              className={`relative font-heading text-sm xl:text-base px-2 xl:px-4 py-2 rounded-md transition-colors ${
                isActive('/') 
                  ? 'text-purple-900 font-semibold' 
                  : 'text-purple-800 font-medium hover:text-purple-900'
              }`}
            >
              Home
              {isActive('/') && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-700 rounded-full mx-2 xl:mx-4"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
            
            <Link 
              href="/category/Dv3q9Y7sbPx1Ewtz3AmQ" 
              className={`relative font-heading text-sm xl:text-base px-2 xl:px-4 py-2 rounded-md transition-colors ${
                isGiftsActive() 
                  ? 'text-purple-900 font-semibold' 
                  : 'text-purple-800 font-medium hover:text-purple-900'
              }`}
            >
              Gifts
              {isGiftsActive() && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-700 rounded-full mx-2 xl:mx-4"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>

            <div className="relative group">
              <button 
                className={`flex items-center font-heading space-x-1 px-2 xl:px-4 py-2 rounded-md transition-colors ${
                  isCategoryActive() 
                    ? 'text-purple-900 font-semibold' 
                    : 'text-purple-800 font-medium hover:text-purple-900'
                }`}
              >
                <span>Categories</span>
                <ChevronDown className="h-3 w-3 xl:h-4 xl:w-4" />
              </button>
              {isCategoryActive() && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-700 rounded-full mx-2 xl:mx-4"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className="hidden group-hover:grid grid-cols-2 absolute left-0 mt-0 w-64 bg-white shadow-xl rounded-md py-2 border border-purple-100 z-50">
                {categories?.map((category) => (
                  <Link 
                    key={category.id} 
                    href={`/category/${category?.id}`} 
                    className={`block px-4 py-2 text-sm hover:bg-purple-50 ${
                      pathname === `/category/${category?.id}` 
                        ? 'text-purple-900 font-semibold bg-purple-50' 
                        : 'text-purple-800'
                    }`}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative group">
              <button 
                className={`flex items-center font-heading space-x-1 px-2 xl:px-4 py-2 rounded-md transition-colors ${
                  isCollectionActive() 
                    ? 'text-purple-900 font-semibold' 
                    : 'text-purple-800 font-medium hover:text-purple-900'
                }`}
              >
                <span>Collections</span>
                <ChevronDown className="h-3 w-3 xl:h-4 xl:w-4" />
              </button>
              {isCollectionActive() && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-700 rounded-full mx-2 xl:mx-4"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className="hidden group-hover:grid grid-cols-2 absolute left-0 mt-0 w-64 bg-white shadow-xl rounded-md py-2 border border-purple-100 z-50">
                {collections?.map((collection) => (
                  <Link 
                    key={collection.id} 
                    href={`/collections/${collection?.id}`} 
                    className={`block px-4 py-2 text-sm hover:bg-purple-50 ${
                      pathname === `/collections/${collection?.id}` 
                        ? 'text-purple-900 font-semibold bg-purple-50' 
                        : 'text-purple-800'
                    }`}
                  >
                    {collection.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="relative w-48 xl:w-64" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onKeyDown={handleSearch}
                  onFocus={() => searchQuery.length > 1 && setShowSuggestions(suggestions.length > 0)}
                  className="w-full text-gray-800 font-body text-sm px-4 py-1.5 rounded-lg border border-purple-400 focus:outline-none focus:border-purple-500"
                />
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center h-5 w-5 xl:h-6 xl:w-6 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors"
                  onClick={handleSearch}
                  aria-label="Search"
                  title="Click to search"
                >
                  <Search className="w-3 h-3 md:w-4 md:h-4 text-purple-700" />
                </button>
              </div>
              
              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white border border-purple-200 rounded-md shadow-lg mt-1 z-50">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className="px-4 py-2 text-sm hover:bg-purple-50 cursor-pointer text-gray-800"
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
          <div className="flex items-center space-x-1 md:space-x-2 xl:space-x-4">
            <AuthContextProvider>
              <HeaderClientButtons/>
            </AuthContextProvider>

            <div className="relative group">
              <button className="flex items-center font-heading space-x-1 text-purple-900 font-medium px-2 xl:px-4 py-2 rounded-md transition-colors">
                <User className="h-5 w-5 xl:h-6 xl:w-6 text-purple-700" />
              </button>
              <div className="hidden group-hover:block absolute right-0 mt-0 w-36 bg-white shadow-xl rounded-md py-2 border border-purple-100 z-50">
                <Link 
                  href="/myaccount" 
                  className={`flex items-center justify-center gap-2 px-4 py-2 text-sm hover:bg-purple-50 ${
                    pathname === '/myaccount' 
                      ? 'text-purple-900 font-semibold bg-purple-50' 
                      : 'text-purple-800'
                  }`}
                >
                  <User className="w-4 h-4"/>Profile
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
                <Link 
                  href="/" 
                  className={`block px-4 py-2 font-heading font-medium hover:bg-purple-50 relative ${
                    isActive('/') ? 'text-purple-900 bg-purple-50/50' : 'text-purple-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                  {isActive('/') && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-700 rounded-r" />
                  )}
                </Link>
                <Link 
                  href="/category/Dv3q9Y7sbPx1Ewtz3AmQ" 
                  className={`block px-4 py-2 font-heading font-medium hover:bg-purple-50 relative ${
                    isGiftsActive() ? 'text-purple-900 bg-purple-50/50' : 'text-purple-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Gifts
                  {isGiftsActive() && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-700 rounded-r" />
                  )}
                </Link>

                {/* Mobile Categories Dropdown */}
                <div>
                  <button
                    onClick={() => setIsDropdownOpen(prev => ({ ...prev, mobileCat: !prev.mobileCat }))}
                    className={`w-full px-4 py-2 font-heading font-medium hover:bg-purple-50 flex justify-between items-center relative ${
                      isCategoryActive() ? 'text-purple-900 bg-purple-50/50' : 'text-purple-800'
                    }`}
                  >
                    <span>Categories</span>
                    <ChevronDown className={`h-4 w-4 transform transition-transform ${isDropdownOpen.mobileCat ? 'rotate-180' : ''}`} />
                    {isCategoryActive() && !isGiftsActive() && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-700 rounded-r" />
                    )}
                  </button>
                  {isDropdownOpen.mobileCat && (
                    <div className="bg-purple-50 grid grid-cols-2">
                      {categories?.map((category) => (
                        <Link 
                          key={category.id} 
                          href={`/category/${category?.id}`} 
                          className={`block px-4 py-2 font-heading hover:bg-purple-100/50 ${
                            pathname === `/category/${category?.id}` ? 'text-purple-900 font-semibold' : 'text-purple-800'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
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
                    className={`w-full px-4 py-2 font-heading font-medium hover:bg-purple-50 flex justify-between items-center relative ${
                      isCollectionActive() ? 'text-purple-900 bg-purple-50/50' : 'text-purple-800'
                    }`}
                  >
                    <span>Collections</span>
                    <ChevronDown className={`h-4 w-4 transform transition-transform ${isDropdownOpen.mobileColl ? 'rotate-180' : ''}`} />
                    {isCollectionActive() && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-700 rounded-r" />
                    )}
                  </button>
                  {isDropdownOpen.mobileColl && (
                    <div className="bg-purple-50 grid grid-cols-2">
                      {collections?.map((collection) => (
                        <Link 
                          key={collection.id} 
                          href={`/collections/${collection?.id}`} 
                          className={`block px-4 py-2 font-heading hover:bg-purple-100/50 ${
                            pathname === `/collections/${collection?.id}` ? 'text-purple-900 font-semibold' : 'text-purple-800'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
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