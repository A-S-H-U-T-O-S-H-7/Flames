"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPaperPlane 
} from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link'; // Added Next.js Link import

const Footer = () => {
  const [suggestion, setSuggestion] = useState('');

  const socialLinks = [
    { icon: FaFacebook, link: "#", color: "text-blue-600" },
    { icon: FaInstagram, link: "#", color: "text-pink-600" },
    { icon: FaTwitter, link: "#", color: "text-sky-500" },
    { icon: FaYoutube, link: "#", color: "text-red-600" }
  ];

  const categories = [
    { name: "Ring", slug: "ring" },
    { name: "Earring", slug: "earring" },
    { name: "Necklace", slug: "necklace" },
    { name: "Pendant", slug: "pendant" },
    { name: "Bracelet", slug: "bracelet" },
    { name: "Anklet", slug: "anklet" },
    { name: "Brooch", slug: "brooch" },
    { name: "Handbag", slug: "handbag" }
  ];

  // Updated quickLinks array with proper paths
  const quickLinks = [
    
    { name: "FAQs", path: "/" },
    { name: "Contact", path: "/contactus" },
    { name: "Shipping", path: "/shipping" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle suggestion submission
    setSuggestion('');
  };

  return (
    <footer className="bg-gradient-to-b from-purple-100 via-purple-50 to-white">
      <div className="mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-wrap justify-between">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center md:justify-start">
              <Image src="/flame1.png" alt="logo" width={50} height={50} />
              <h2 className="text-3xl font-heading bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Flames
              </h2>
            </div>
            <p className="font-body text-gray-600 max-w-sm text-left">
              Discover the perfect blend of tradition and elegance with our curated collection of cultural jewelry and artisan gifts.
            </p>

            <div className="flex justify-left space-x-5">
              {socialLinks.map(({ icon: Icon, link, color }, index) => (
                <motion.a 
                  key={index} 
                  href={link}
                  whileHover={{ scale: 1.1 }}
                  className={`${color} hover:opacity-80 transition text-3xl`}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Products and Quick Links Container for Mobile */}
          <div className="grid grid-cols-2 gap-8 pt-10 lg:pt-0 lg:gap-12">
            {/* Products Column */}
            <div className="flex flex-col lg:items-center">
              <h3 className="font-heading text-lg font-medium text-purple-800 mb-6  text-center">
                Products
              </h3>
              <ul className="grid grid-cols-2 gap-3 font-body w-48">
                {categories.map((category, index) => (
                  <motion.li 
                    key={index}
                    className="text-gray-600 hover:text-purple-700 cursor-pointer text-left"
                  >
                    <Link href={`/category/${category.slug}`}>{category.name}</Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Quick Links Column */}
            <div className="flex flex-col items-center">
              <h3 className="font-heading text-lg font-medium text-purple-800 mb-6 lg:text-center text-center">
                Quick Links
              </h3>
              <ul className="space-y-3 font-body w-30">
                {quickLinks.map((link, index) => (
                  <motion.li 
                    key={index}
                    className="text-gray-600 hover:text-purple-700 cursor-pointer text-left"
                  >
                    <Link href={link.path}>{link.name}</Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggestion Box */}
          <div className="flex flex-col pt-10 lg:pt-0 lg:items-center ">
            <h3 className="font-heading text-lg font-medium text-purple-800 mb-6 text-center ">
              Suggestions for us
            </h3>
            <form onSubmit={handleSubmit} className="w-full max-w-full space-y-4">
              <div className="relative">
                <textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full flex px-4 py-3 text-gray-600 bg-white border border-purple-200 rounded-lg focus:outline-none hover:border-purple-300 transition-colors resize-none h-32"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="absolute bottom-3 right-3 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors focus:outline-none"
                >
                  <FaPaperPlane className="text-lg" />
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-purple-200 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="font-body text-sm text-gray-600">
              © 2024 Flames. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {["Privacy Policy", "Terms of Service"].map((item, index) => (
                <motion.a 
                  key={index}
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  whileHover={{ scale: 1.05 }}
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