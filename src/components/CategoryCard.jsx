"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const CategoryCard = ({ categories }) => {
  // Ensure categories is an array even if null/undefined is passed
  const safeCategoriesArray = Array.isArray(categories) ? categories : [];
  
  const [isHovering, setIsHovering] = useState(false);
  const scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollInterval = 2000; // 2 seconds for auto scroll

  // Auto scroll logic
  useEffect(() => {
    let interval;
    
    const scroll = () => {
      if (scrollRef.current && safeCategoriesArray.length > 0) {
        const container = scrollRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (scrollPosition >= maxScroll) {
          setScrollPosition(0);
          container.scrollLeft = 0;
          return;
        }

        const nextPosition = scrollPosition + 150;
        
        setScrollPosition(nextPosition);
        container.scrollLeft = nextPosition;
      }
    };
    
    if (!isHovering && safeCategoriesArray.length > 0) {
      interval = setInterval(scroll, scrollInterval);
    }
    
    return () => {
      clearInterval(interval);
    };
  }, [isHovering, scrollPosition, safeCategoriesArray.length]);

  // Enhanced animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] // custom cubic-bezier for smooth entrance
      }
    },
    hover: {
      y: -5,
      scale: 1.05,
      boxShadow: "0 8px 15px rgba(0, 0, 0, 0.05)",
      transition: { type: "spring", stiffness: 200, damping: 10 }
    }
  };

  const emptyStateVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.6
      }
    }
  };

  // If no categories, render empty state
  if (safeCategoriesArray.length === 0) {
    return (
      <div className="bg-white py-8 px-5 w-full">
        <motion.div 
          className="flex flex-col items-center justify-center py-12 px-4"
          variants={emptyStateVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="w-24 h-24 mb-6 bg-purple-100 rounded-full flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-12 h-12 text-purple-400"
            >
              <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Categories Found</h3>
          <p className="text-gray-600 text-center max-w-md mb-6">
            We couldn't find any categories to display. Categories will appear here once they're added.
          </p>
          <motion.div 
            className="px-6 py-3 bg-purple-600 text-white rounded-lg cursor-pointer font-medium shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore More
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white py-4 md:py-8 px-3 md:px-5 w-full">
      <div
        className="relative w-full"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={() => setIsHovering(true)}
        onTouchEnd={() => setIsHovering(false)}
      >
        <motion.div
          ref={scrollRef}
          className="flex gap-3 md:gap-6 py-4 overflow-x-auto no-scrollbar scroll-smooth"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {safeCategoriesArray.map((category, index) => (
            <Link key={category.id} href={`/category/${category.id}`} className="flex flex-col items-center">
              <motion.div
                variants={cardVariants}
                className="flex items-center justify-center
                          w-[80px] h-[85px] 
                          sm:w-[120px] sm:h-[120px]
                          md:w-[130px] md:h-[130px]
                          
                          rounded-lg bg-purple-100
                          hover:bg-purple-200
                          transition-all duration-800
                          cursor-pointer
                          shadow-sm
                          flex-shrink-0
                          mb-1 md:mb-3"
                whileHover="hover"
              >
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center">
                  <Image
                    src={category.imageURL}
                    alt={`${category.name} icon`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </motion.div>
              <motion.p 
                variants={cardVariants}
                className="text-sm sm:text-base font-semibold text-center text-gray-600 px-2 mt-2"
              >
                {category.name}
              </motion.p>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryCard;