"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const CategoryCard = ({ categories }) => {
  const [isHovering, setIsHovering] = useState(false);
  const scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollInterval = 2000; // 2 seconds for auto scroll

  // Auto scroll logic
  useEffect(() => {
    let interval;
    
    const scroll = () => {
      if (scrollRef.current) {
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
    
    if (!isHovering) {
      interval = setInterval(scroll, scrollInterval);
    }
    
    return () => {
      clearInterval(interval);
    };
  }, [isHovering, scrollPosition]);

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
          {categories.map((category, index) => (
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
                className="text-sm sm:text-base font-medium text-center text-gray-600 px-2 mt-2"
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