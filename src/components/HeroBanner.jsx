'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    title: "Adventure Awaits",
    description: "Explore incredible journeys and unlock new horizons.",
    buttonText: "Start Exploring",
    characterImage: "/character1.png",
    bgColor: "bg-blue-100"
  },
  {
    title: "Discover Magic",
    description: "Immerse yourself in worlds beyond imagination.",
    buttonText: "Begin Journey",
    characterImage: "/character2.png", 
    bgColor: "bg-green-100"
  },
  {
    title: "Epic Challenges",
    description: "Conquer obstacles and become a legend.",
    buttonText: "Take the Challenge",
    characterImage: "/character3.png",
    bgColor: "bg-purple-100"
  },
  {
    title: "Infinite Possibilities",
    description: "Break boundaries and redefine your potential.",
    buttonText: "Unlock Potential",
    characterImage: "/character4.png",
    bgColor: "bg-orange-100"
  }
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <AnimatePresence>
        <motion.div 
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 flex ${slide.bgColor}`}
        >
          <div className="container mx-auto flex items-center justify-between px-4 md:px-8">
            {/* Left Content */}
            <div className="w-1/2 pr-8 space-y-4">
              <motion.h1 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-4xl font-bold text-gray-800"
              >
                {slide.title}
              </motion.h1>
              <motion.p 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-600"
              >
                {slide.description}
              </motion.p>
              <motion.button
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                {slide.buttonText}
              </motion.button>
            </div>

            {/* Right Character */}
            <div className="w-1/2 flex justify-center items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-full h-[450px] relative"
              >
                <Image 
                  src={slide.characterImage} 
                  alt="Character" 
                  layout="fill" 
                  objectFit="contain"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;