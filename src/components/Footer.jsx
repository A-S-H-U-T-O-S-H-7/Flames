"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Facebook, Instagram, Twitter, Youtube, 
  Send
} from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const socialLinks = [
    { icon: Facebook, link: "#", color: "text-blue-600" },
    { icon: Instagram, link: "#", color: "text-pink-600" },
    { icon: Twitter, link: "#", color: "text-sky-500" },
    { icon: Youtube, link: "#", color: "text-red-600" }
  ];

  const handleSubscribe = () => {
    if (email) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-gradient-to-b from-purple-100 via-purple-50 to-white">
      <div className=" mx-auto px-[10px] md:px-[30px] py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Company Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center ">
              <Image src="/flame1.png" alt="logo" width={50} height={50} />
              <h2 className="text-3xl font-heading  bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Flames
              </h2>
            </div>
            <p className="font-body text-gray-600 max-w-md">
              Discover the perfect blend of tradition and elegance with our curated collection of cultural jewelry and artisan gifts.
            </p>
            <div className="flex space-x-5">
              {socialLinks.map(({ icon: Icon, link, color }, index) => (
                <motion.a 
                  key={index} 
                  href={link}
                  whileHover={{ scale: 1.1 }}
                  className={`${color} hover:opacity-80 transition`}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Products Column */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold text-purple-800">Products</h3>
            <ul className="space-y-3 font-body">
              {['Necklaces', 'Earrings', 'Bracelets', 'Rings', 'Gift Sets'].map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  className="text-gray-600 hover:text-purple-700 cursor-pointer"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold text-purple-800">Quick Links</h3>
            <ul className="space-y-3 font-body">
              {['About Us', 'Blog', 'FAQs', 'Contact', 'Shipping'].map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  className="text-gray-600 hover:text-purple-700 cursor-pointer"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold text-purple-800">Stay Updated</h3>
            <p className="font-body text-sm text-gray-600">Subscribe for exclusive offers and updates</p>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-white border border-purple-200 focus:ring-2 focus:ring-purple-500 font-body"
              />
              <motion.button 
                onClick={handleSubscribe}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg"
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </div>
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-green-50 text-green-800 px-4 py-2 rounded-lg text-sm"
                >
                  Thank you for subscribing!
                </motion.div>
              )}
            </AnimatePresence>
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
              {["Privacy Policy", "Terms of Service", "Sitemap"].map((item, index) => (
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