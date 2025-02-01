import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Heart, ShoppingCart, User, Menu, X, ChevronDown 
} from 'lucide-react';

const Navbar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navCategories = [
    { 
      name: 'Home',
      href: '/'
    },
    { 
      name: 'Gifts',
      subMenu: [
        { name: 'Anniversary', href: '/anniversary' },
        { name: 'Birthday', href: '/birthday' },
        { name: 'Engagement', href: '/engagement' },
        { name: 'Wedding', href: '/wedding' },
      ]
    },
    { 
      name: 'Categories', 
      subMenu: [
        { name: 'Jewelry', href: '/jewelry' },
        { name: 'Clothing', href: '/clothing' },
        { name: 'Accessories', href: '/accessories' },
        { name: 'Home Decor', href: '/home-decor' }
      ]
    },
    { 
      name: 'Collections', 
      subMenu: [
        { name: 'New Arrivals', href: '/new-arrivals' },
        { name: 'Best Sellers', href: '/best-sellers' },
        { name: 'Sale', href: '/sale' }
      ]
    },
    { 
      name: 'About', 
      subMenu: [
        { name: 'Our Story', href: '/our-story' },
        { name: 'Contact', href: '/contact' },
        { name: 'Customer Service', href: '/customer-service' }
      ]
    }
  ];

  const iconButtons = [
    { icon: Heart, label: 'Wishlist' },
    { icon: ShoppingCart, label: 'Cart' },
    { icon: User, label: 'Profile' }
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 bg-white 
        transition-all duration-300 
        ${isScrolled ? 'shadow-md' : ''}`}
    >
      {/* Top Navigation Section */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Brand Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0"
          >
            <a href="/" className="text-3xl font-bold text-purple-600 
              hover:text-purple-700 transition-colors">
              BohuRani
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navCategories.map((category, index) => (
              <div 
                key={category.name}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {category.subMenu ? (
                  <>
                    <button className="flex items-center text-purple-600 
                      hover:text-purple-700 font-medium">
                      {category.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    {activeDropdown === index && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 mt-2 bg-white 
                          shadow-lg rounded-lg p-4 w-48 z-50"
                      >
                        {category.subMenu.map((item) => (
                          <a 
                            key={item.name}
                            href={item.href}
                            className="block py-2 text-purple-600 
                              hover:bg-purple-50 rounded-md"
                          >
                            {item.name}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </>
                ) : (
                  <a href={category.href} className="text-purple-600 
                    hover:text-purple-700 font-medium">
                    {category.name}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Search & Icons */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search gifts & jewelry..."
                className={`w-64 px-4 py-2 rounded-full border-2 
                  transition-all duration-300 
                  ${isSearchFocused 
                    ? 'border-purple-600 shadow-md' 
                    : 'border-gray-300'}
                  focus:outline-none`}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-purple-600" />
            </div>

            <div className="flex space-x-4">
              {iconButtons.map(({ icon: Icon, label }) => (
                <motion.button 
                  key={label}
                  whileHover={{ scale: 1.1 }}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <Icon className="h-6 w-6" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-purple-600 hover:text-purple-700"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white shadow-md overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search gifts & jewelry..."
                  className="w-full px-4 py-2 rounded-full border 
                    border-gray-300 focus:border-purple-600"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-purple-600" />
              </div>

              {/* Mobile Navigation */}
              {navCategories.map((category) => (
                <div key={category.name} className="border-b pb-2">
                  {category.subMenu ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-600 font-semibold">
                          {category.name}
                        </span>
                        <ChevronDown className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="mt-2 space-y-2">
                        {category.subMenu.map((item) => (
                          <a 
                            key={item.name}
                            href={item.href}
                            className="block text-purple-500 hover:bg-purple-50 py-1"
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </>
                  ) : (
                    <a href={category.href} className="text-purple-600 
                      hover:bg-purple-50 py-2 block">
                      {category.name}
                    </a>
                  )}
                </div>
              ))}

              {/* Mobile Icons */}
              <div className="flex justify-between pt-4">
                {iconButtons.map(({ icon: Icon, label }) => (
                  <button 
                    key={label}
                    className="flex flex-col items-center text-purple-600"
                  >
                    <Icon className="h-6 w-6 mb-1" />
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;