'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';


const HeroBanner = ({ banners }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval;
    
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 6000); // Slightly longer interval for smoother experience
    }
  
    return () => clearInterval(interval);
  }, [banners.length, isAutoPlaying]);

  // Fade variants instead of slide
  const fadeVariants = {
    hidden: {
      opacity: 0,
      scale: 1.05,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { duration: 1.2, ease: "easeInOut" },
        scale: { duration: 1.5, ease: "easeOut" }
      }
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      transition: {
        opacity: { duration: 0.8, ease: "easeInOut" },
        scale: { duration: 0.8, ease: "easeIn" }
      }
    }
  };

  // Enhanced text animation variants with staggered fade
  const textVariants = {
    hidden: { 
      y: 20, 
      opacity: 0,
    },
    visible: (custom) => ({ 
      y: 0, 
      opacity: 1,
      transition: { 
        delay: 0.3 + (custom * 0.2),  
        duration: 0.8,
        ease: "easeOut",
      } 
    })
  };

  const handleSlideChange = (index) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
    
    // Resume auto-play after user interaction
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const slide = banners[currentSlide];

  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[75vh] overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0"
        >
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={slide.imageURL} 
              alt={slide.name || "Banner Image"}
              fill
              priority
              className="object-cover transition-all duration-700"
              style={{ 
                transformOrigin: 'center',
                filter: 'brightness(0.9)',
              }}
            />
            {/* Gradient overlay with enhanced depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            {/* Subtle gradient from bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="max-w-xl space-y-4 md:space-y-5 ml-4 sm:ml-6 md:ml-8">
                <motion.h1 
                  custom={0}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-2xl sm:text-3xl md:text-4xl font-light text-white leading-tight font-serif"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                >
                  {slide.title}
                </motion.h1>
                
                <motion.p 
                  custom={1}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-sm sm:text-base md:text-lg text-white/95 max-w-md font-light"
                  style={{ textShadow: "0 1px 5px rgba(0,0,0,0.4)" }}
                >
                  {slide.subtitle}
                </motion.p>
                
                {slide.buttontext && (
                  <motion.div 
                    custom={2}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    className="pt-3"
                  >
                    <Link href={slide.link || "#"} className="inline-block">
                      <button className="px-5 py-2 sm:px-6 sm:py-2.5 border border-white bg-white/10 backdrop-blur-sm text-white rounded-sm hover:bg-white hover:text-gray-900 transition-all duration-300 font-light text-xs sm:text-sm tracking-wider uppercase">
                        {slide.buttontext}
                      </button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Improved indicators with pulse effect */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2.5 sm:h-3 rounded-full transition-all duration-500 transform hover:scale-125 ${
              currentSlide === index 
                ? 'bg-white w-8 sm:w-10 shadow-glow' 
                : 'bg-white/40 hover:bg-white/70 w-2.5 sm:w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            style={currentSlide === index ? { 
              boxShadow: "0 0 12px rgba(255,255,255,0.8)",
              animation: currentSlide === index ? "pulse 2s infinite" : "none"
            } : {}}
          />
        ))}
      </div>

      {/* Refined Navigation Buttons */}
      <button
        onClick={() => handleSlideChange((currentSlide - 1 + banners.length) % banners.length)}
        className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-sm transition-all duration-300 z-10 hover:scale-110 hover:shadow-lg group"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white/80 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => handleSlideChange((currentSlide + 1) % banners.length)}
        className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-sm transition-all duration-300 z-10 hover:scale-110 hover:shadow-lg group"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white/80 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Add ambient light effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0) 70%)',
          animation: 'pulse 4s infinite alternate ease-in-out'
        }}
      />

     
    </div>
  );
};

export default HeroBanner;