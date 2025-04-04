"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaShoppingBag, FaGem, FaCrown, FaStar } from 'react-icons/fa';
import Link from 'next/link';

export default function AboutUs() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const collections = [
    { 
      name: 'Seasonal', 
      description: 'Fresh styles that capture the essence of now',
      icon: FaStar,
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-500',
      borderColor: 'border-teal-200',
      hoverBg: 'hover:bg-teal-100'
    },
    { 
      name: 'Classics', 
      description: 'Timeless pieces that never go out of style',
      icon: FaCrown,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
      borderColor: 'border-purple-200',
      hoverBg: 'hover:bg-purple-100'
    },
    { 
      name: 'Limited Edition', 
      description: 'Exclusive designs for discerning tastes',
      icon: FaGem,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-500',
      borderColor: 'border-amber-200',
      hoverBg: 'hover:bg-amber-100'
    },
    { 
      name: 'Essentials', 
      description: 'Core pieces for your everyday elegance',
      icon: FaShoppingBag,
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-500',
      borderColor: 'border-rose-200',
      hoverBg: 'hover:bg-rose-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-12">
      {mounted && (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Header Section */}
          <motion.div 
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-purple-500 to-teal-400">
              FLAMES
            </h1>
            <div className="h-1 w-20 mx-auto bg-gradient-to-r from-teal-400 to-purple-500 rounded-full mb-4"></div>
            <p className="text-lg font-body max-w-2xl mx-auto text-gray-600 font-light">
              Where style ignites and elegance radiates
            </p>
          </motion.div>
          
          {/* Our Story Section - Removed block structure */}
          <div className="w-full max-w-6xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <motion.div
                variants={itemVariants}
                className="md:col-span-5 relative"
              >
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-3xl overflow-hidden shadow-lg"
                >
                  <Image
                    src="/aboutus1.png"
                    alt="Fashion Collection"
                    width={500}
                    height={400}
                    className="object-cover w-full h-64 md:h-80"
                  />
                  <div className="absolute inset-0"></div>
                </motion.div>
                <div className="absolute -bottom-3 -right-3 h-full w-full border border-teal-300 rounded-3xl -z-10"></div>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                className="md:col-span-7"
              >
                <div className="w-12 h-12 rounded-full bg-teal-50 mb-6 flex items-center justify-center shadow-sm text-teal-500">
                  <FaShoppingBag className="text-xl" />
                </div>
                <h2 className="text-2xl font-bold font-heading mb-4 text-gray-800">Our Story</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-teal-400 to-purple-500 rounded-full mb-6"></div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Flames is the bold fashion and jewelry destination that transforms everyday style into extraordinary statements. Born from a passion for self-expression, we curate collections that empower you to showcase your unique personality.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our journey began with a simple belief: beautiful accessories should be accessible to everyone. Today, we continue to bridge the gap between luxury and affordability.
                </p>
                <Link href="/all-collectionPage">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(14, 165, 142, 0.2)" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 bg-gradient-to-r from-teal-400 to-purple-500 rounded-xl text-white text-sm font-medium shadow-md"
                >
                  Discover Collections
                </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
          
          {/* Jewelry Section - Removed block structure */}
          <div className="w-full max-w-6xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <motion.div
                variants={itemVariants}
                className="md:col-span-7 order-2 md:order-1"
              >
                <div className="w-12 h-12 rounded-full bg-purple-50 mb-6 flex items-center justify-center shadow-sm text-purple-500">
                  <FaGem className="text-xl" />
                </div>
                <h2 className="text-2xl font-bold font-heading mb-4 text-gray-800">Jewelry Masterpieces</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full mb-6"></div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our jewelry collection transcends mere accessories – each piece tells a story, captures emotion, and elevates your presence. From delicate everyday pieces to bold statement designs, Flames jewelry is crafted to illuminate your natural radiance.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Every creation is a testament to our dedication to quality, craftsmanship, and ethical sourcing practices that respect both people and planet.
                </p>
                <div className="flex flex-wrap gap-3 mb-2">
                  {['Necklaces', 'Bracelets', 'Earrings', 'Rings'].map((item, index) => (
                    <motion.span
                      key={item}
                      whileHover={{ scale: 1.05, backgroundColor: "#f5f3ff" }}
                      className="px-4 py-2 border border-purple-200 rounded-lg text-purple-600 text-sm"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                className="md:col-span-5 relative order-1 md:order-2"
              >
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-3xl overflow-hidden shadow-lg"
                >
                  <Image
                    src="/aboutus2.jpeg"
                    alt="Jewelry Collection"
                    width={500}
                    height={400}
                    className="object-cover w-full h-64 md:h-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent"></div>
                </motion.div>
                <div className="absolute -bottom-3 -left-3 h-full w-full border border-purple-300 rounded-3xl -z-10"></div>
              </motion.div>
            </div>
          </div>
          
          {/* Collections Preview */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-6"
          >
            <h2 className="text-2xl font-bold font-heading mb-2 text-gray-800">Explore Our Collections</h2>
            <div className="w-16 h-1 mx-auto bg-gradient-to-r from-teal-400 to-purple-500 rounded-full mb-8"></div>
            <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
              Discover our carefully curated collections, each designed to complement your unique style and personality.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.name}
                variants={itemVariants}
                custom={index}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.3 }
                }}
                className={`${collection.bgColor} p-6 rounded-2xl border ${collection.borderColor} shadow-sm transition-all duration-300 ${collection.hoverBg}`}
              >
                <div className={`w-12 h-12 rounded-full bg-white mb-4 flex items-center justify-center shadow-sm ${collection.iconColor}`}>
                  <collection.icon className="text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {collection.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {collection.description}
                </p>
                <a href="#" className={`inline-block text-sm font-medium ${collection.iconColor}`}>
                  View Collection →
                </a>
              </motion.div>
            ))}
          </div>
          
          {/* Newsletter Section */}
          {/* <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto border border-teal-100 shadow-md"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Join Our Community</h3>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Subscribe to our newsletter for exclusive offers, style tips, and first access to new collections.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-300 min-w-0 flex-1 max-w-xs mx-auto sm:mx-0"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 bg-gradient-to-r from-teal-400 to-purple-500 rounded-xl text-white text-sm font-medium shadow-md w-full sm:w-auto max-w-xs mx-auto sm:mx-0"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div> */}
        </motion.div>
      )}
    </div>
  );
}