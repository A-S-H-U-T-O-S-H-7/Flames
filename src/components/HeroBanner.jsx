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

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
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
    <div className="relative w-full h-[400px]  overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            <Image
              src={slide.imageURL} 
              alt={slide.name || "Banner Image"}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          </div>

          <div className="absolute inset-0 ml-8 flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="max-w-xl space-y-6"
              >
                <h1 className="text-5xl font-bold text-white">{slide.title}</h1>
                <p className="text-xl text-white/90">{slide.subtitle}</p>
                {slide.buttontext && (
                  <button className="px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition duration-300 font-semibold">
                    {slide.buttontext}
                  </button>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => handleSlideChange(-1)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/30 hover:bg-white/50 transition duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => handleSlideChange(1)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/30 hover:bg-white/50 transition duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default HeroBanner;
