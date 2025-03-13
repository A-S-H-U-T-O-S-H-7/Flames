'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const HeroBanner = ({ banners }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
  
    return () => clearInterval(interval);
  }, [banners.length]);

  // Enhanced slide variants with 3D effects
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction > 0 ? 15 : -15, // 3D rotation effect
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction < 0 ? 15 : -15, // 3D rotation on exit
      scale: 0.9,
    })
  };

  // Text animation variants - now entering from left to right
  const textVariants = {
    hidden: { 
      x: -100, 
      opacity: 0,
      rotateX: 5, // Slight 3D tilt
    },
    visible: (custom) => ({ 
      x: 0, 
      opacity: 1,
      rotateX: 0,
      transition: { 
        delay: custom * 0.2,  
        duration: 0.6,
        ease: "easeOut",
      } 
    })
  };

  const handleSlideChange = (newDirection) => {
    setDirection(newDirection);
    setCurrentSlide((prev) =>
      newDirection > 0 ? (prev + 1) % banners.length : (prev - 1 + banners.length) % banners.length
    );
  };

  const slide = banners[currentSlide];

  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] bg-purple-200 lg:h-[70vh] overflow-hidden perspective-1000">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 200, damping: 30 },
            opacity: { duration: 0.4 },
            rotateY: { duration: 0.8, ease: "easeOut" },
            scale: { duration: 0.8, ease: "easeOut" }
          }}
          className="absolute inset-0 transform-style-3d"
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px"
          }}
        >
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={slide.imageURL} 
              alt={slide.name || "Banner Image"}
              fill
              priority
              className="object-cover transform-gpu hover:scale-105 transition-transform duration-3000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </div>

          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-8 lg:px-12">
              <div className="max-w-xl space-y-4 md:space-y-6 ml-4 sm:ml-6 md:ml-8">
                <motion.h1 
                  custom={0}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                >
                  {slide.title}
                </motion.h1>
                
                <motion.p 
                  custom={1}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-base sm:text-lg md:text-xl text-white/90 max-w-md"
                >
                  {slide.subtitle}
                </motion.p>
                
                {slide.buttontext && (
                  <motion.div 
                    custom={2}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    className="pt-2"
                  >
                    <button className="px-5 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold text-sm sm:text-base transform hover:scale-110 hover:shadow-xl">
                      {slide.buttontext}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators with enhanced hover effect */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
            }}
            className={`h-2 sm:h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
              currentSlide === index 
                ? 'bg-white w-6 sm:w-8 shadow-glow' 
                : 'bg-white/50 hover:bg-white/80 w-2 sm:w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            style={currentSlide === index ? { boxShadow: "0 0 10px rgba(255,255,255,0.8)" } : {}}
          />
        ))}
      </div>

      {/* Enhanced Navigation Buttons with 3D hover effects */}
      <button
        onClick={() => handleSlideChange(-1)}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm transition duration-300 z-10 hover:scale-110 hover:shadow-lg"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => handleSlideChange(1)}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm transition duration-300 z-10 hover:scale-110 hover:shadow-lg"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Add a subtle 3D parallax effect to the background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%)',
          transform: `translateX(${direction * 5}px)`,
          transition: 'transform 1s ease-out'
        }}
      />
    </div>
  );
};

export default HeroBanner;