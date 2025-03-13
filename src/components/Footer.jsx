"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPaperPlane 
} from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

const Footer = ({categories = []}) => {
  const [suggestion, setSuggestion] = useState('');

  const socialLinks = [
    { icon: FaFacebook, link: "#", color: "text-blue-600" },
    { icon: FaInstagram, link: "#", color: "text-pink-600" },
    { icon: FaTwitter, link: "#", color: "text-sky-500" },
    { icon: FaYoutube, link: "#", color: "text-red-600" }
  ];

  const quickLinks = [
    { name: "About Us", path: "/aboutus" },
    { name: "FAQs", path: "/" },
    { name: "Contact", path: "/contactus" },
    { name: "Shipping", path: "/myaccount" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle suggestion submission
    setSuggestion('');
  };

  // Placeholder categories if none provided
  const defaultCategories = ['Jewelry', 'Accessories', 'Home Decor', 'Gifts', 'Seasonal', 'Artisan'];
  const displayCategories = categories && categories.length > 0 
    ? categories 
    : defaultCategories.map((name, id) => ({ id, name }));

  return (
    <footer className="bg-gradient-to-b from-purple-100 via-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-10 gap-x-6">
          {/* Company Info */}
          <div className="lg:col-span-4 flex flex-col items-center md:items-start">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <Image src="/flame1.png" alt="logo" width={60} height={60} className="mr-2" />
              <h2 className="text-3xl font-heading bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Flames
              </h2>
            </div>
            <p className="font-body text-gray-600 max-w-sm text-center md:text-left mb-6">
              Discover the perfect blend of tradition and elegance with our curated collection of cultural jewelry and artisan gifts.
            </p>

            <div className="flex justify-center md:justify-start space-x-6 mb-4">
              {socialLinks.map(({ icon: Icon, link, color }, index) => (
                <motion.a 
                  key={index} 
                  href={link}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${color} hover:opacity-80 transition-all duration-300 text-2xl`}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Products and Quick Links for mobile - side by side */}
          <div className="lg:hidden w-full">
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              {/* Products Column - Mobile */}
              <div className="flex flex-col items-center">
                <h3 className="font-heading text-base sm:text-lg font-medium text-purple-800 mb-4 text-center relative after:content-[''] after:absolute after:w-10 after:h-0.5 after:bg-purple-400 after:bottom-0 after:left-1/2 after:-translate-x-1/2 pb-2">
                  Products
                </h3>
                <ul className="space-y-2 font-body w-full">
                  {displayCategories.slice(0, 4).map((category) => (
                    <motion.li 
                      key={category.id}
                      whileHover={{ x: 2 }}
                      className="text-gray-600 hover:text-purple-700 transition-all duration-200 text-center text-sm"
                    >
                      <Link href={`/category/${category.id}`}>{category.name}</Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Quick Links Column - Mobile */}
              <div className="flex flex-col items-center">
                <h3 className="font-heading text-base sm:text-lg font-medium text-purple-800 mb-4 text-center relative after:content-[''] after:absolute after:w-10 after:h-0.5 after:bg-purple-400 after:bottom-0 after:left-1/2 after:-translate-x-1/2 pb-2">
                  Quick Links
                </h3>
                <ul className="space-y-2 font-body w-full">
                  {quickLinks.map((link, index) => (
                    <motion.li 
                      key={index}
                      whileHover={{ x: 2 }}
                      className="text-gray-600 hover:text-purple-700 transition-all duration-200 text-center text-sm"
                    >
                      <Link href={link.path}>{link.name}</Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Products Column - Desktop */}
          <div className="hidden lg:flex lg:col-span-3 flex-col items-center">
            <h3 className="font-heading text-xl font-medium text-purple-800 mb-6 text-center relative after:content-[''] after:absolute after:w-12 after:h-0.5 after:bg-purple-400 after:bottom-0 after:left-1/2 after:-translate-x-1/2 pb-2">
              Products
            </h3>
            <ul className="grid grid-cols-1 gap-3 font-body w-full">
              {displayCategories.map((category) => (
                <motion.li 
                  key={category.id}
                  whileHover={{ x: 2 }}
                  className="text-gray-600 hover:text-purple-700 transition-all duration-200 text-center"
                >
                  <Link href={`/category/${category.id}`}>{category.name}</Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column - Desktop */}
          <div className="hidden lg:flex lg:col-span-2 flex-col items-center">
            <h3 className="font-heading text-xl font-medium text-purple-800 mb-6 text-center relative after:content-[''] after:absolute after:w-12 after:h-0.5 after:bg-purple-400 after:bottom-0 after:left-1/2 after:-translate-x-1/2 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3 font-body w-full">
              {quickLinks.map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 2 }}
                  className="text-gray-600 hover:text-purple-700 transition-all duration-200 text-center"
                >
                  <Link href={link.path}>{link.name}</Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Suggestion Box */}
          <div className="lg:col-span-3 flex flex-col items-center">
            <h3 className="font-heading text-lg sm:text-xl font-medium text-purple-800 mb-5 text-center relative after:content-[''] after:absolute after:w-12 after:h-0.5 after:bg-purple-400 after:bottom-0 after:left-1/2 after:-translate-x-1/2 pb-2">
              Suggestions
            </h3>
            <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
              <div className="relative rounded-lg overflow-hidden shadow-purple-100 shadow-md">
                <textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-3 text-gray-600 bg-white border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-400 hover:border-purple-300 transition-colors resize-none h-28"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  className="absolute bottom-3 right-3 p-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
                >
                  <FaPaperPlane className="text-lg" />
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-purple-200 bg-white/90">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <p className="font-body text-sm text-gray-600">
              © 2024 Flames. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {["Privacy Policy", "Terms of Service"].map((item, index) => (
                <motion.a 
                  key={index}
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  whileHover={{ y: -2 }}
                  className="font-body text-sm text-purple-700 hover:text-purple-900"
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;