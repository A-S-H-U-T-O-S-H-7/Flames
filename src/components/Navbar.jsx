import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";

const searchKeywords = ["jewelry", "accessories", "home decor", "rings", "earrings"];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(searchKeywords[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState({ 
    category: false, 
    collection: false,
    mobileCat: false,
    mobileColl: false 
  });

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % searchKeywords.length;
      setSearchKeyword(searchKeywords[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-white shadow-lg">
      {/* Main Navbar */}
      <nav className="px:[10px] md:px-[30px]">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center ">
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 rounded-full hover:bg-purple-100">
              <Menu className="h-6 w-6 text-purple-700" />
            </button>
            <Link href="/" className="flex items-center ">
              <Image src="/flame1.png" alt="Logo" width={40} height={40} className="object-contain" />
              <span className="text-2xl font-heading  text-purple-700">Flames</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/" className="text-purple-800 font-medium font-heading px-4 py-2 rounded-md transition-colors">
              Home
            </Link>
            <Link href="/gifts" className="text-purple-800 font-heading font-medium px-4 py-2 rounded-md transition-colors">
              Gifts
            </Link>

            <div className="relative group">
              <button
                className="flex items-center font-heading space-x-1 text-purple-800 font-medium px-4 py-2 rounded-md transition-colors"
              >
                <span>Categories</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="hidden group-hover:block absolute left-0 mt-0 w-48 bg-white shadow-xl rounded-md py-2 border border-purple-100">
                <Link href="/category/jewelry" className="block px-4 py-2 text-purple-800 hover:bg-purple-50">Jewelry</Link>
                <Link href="/category/accessories" className="block px-4 py-2 text-purple-800 hover:bg-purple-50">Accessories</Link>
              </div>
            </div>

            <div className="relative group">
              <button
                className="flex items-center font-heading space-x-1 text-purple-900 font-medium px-4 py-2 rounded-md transition-colors"
              >
                <span>Collections</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="hidden group-hover:block absolute left-0 mt-0 w-48 bg-white shadow-xl rounded-md py-2 border border-purple-100">
                <Link href="/collection/new-arrivals" className="block px-4 py-2 text-purple-900 hover:bg-purple-50">New Arrivals</Link>
                <Link href="/collection/best-sellers" className="block px-4 py-2 text-purple-900 hover:bg-purple-50">Best Sellers</Link>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full text-gray-800 font-body px-4 py-1.5 rounded-lg border border-purple-400 focus:outline-none focus:border-purple-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-600" />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-1 md:space-x-4">
            <button className="p-2 rounded-full hover:bg-purple-100">
              <Heart className="h-6 w-6 text-purple-700" />
            </button>
            <button className="p-2 rounded-full hover:bg-purple-100">
              <ShoppingCart className="h-6 w-6 text-purple-700" />
            </button>
            <button className="p-2 rounded-full hover:bg-purple-100">
              <User className="h-6 w-6 text-purple-700" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Below Navbar) */}
        <div className="lg:hidden py-2 px-2 border-t border-purple-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-1.5 text-gray-800 rounded-lg border-2 border-purple-200 focus:outline-none focus:border-purple-500"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-700" />
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar - Keeping the rest of the code unchanged */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
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
                    src="/api/placeholder/400/160"
                    alt="Banner"
                    layout="fill"
                    objectFit="cover"
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
                <Link href="/gifts" className="block px-4 py-2 text-purple-900 font-heading font-medium hover:bg-purple-50">
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
                    <div className="bg-purple-50">
                      <Link href="/category/jewelry" className="block px-8 py-2 text-purple-900 font-heading">Jewelry</Link>
                      <Link href="/category/accessories" className="block px-8 py-2 text-purple-900 font-heading">Accessories</Link>
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
                    <div className="bg-purple-50">
                      <Link href="/collection/new-arrivals" className="block px-8 py-2 text-purple-900 font-heading">New Arrivals</Link>
                      <Link href="/collection/best-sellers" className="block px-8 py-2 text-purple-900 font-heading">Best Sellers</Link>
                    </div>
                  )}
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