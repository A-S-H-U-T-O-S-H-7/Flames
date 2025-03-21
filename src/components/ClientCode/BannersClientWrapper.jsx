"use client";

import React from "react";
import HeroBanner from "@/components/HeroBanner";
import { useHeroBanners } from "@/lib/firestore/banners/read";
import { motion } from 'framer-motion';

export default function BannersClientWrapper() {
  const { heroBanners, isLoading, error } = useHeroBanners();

  if (isLoading) return <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[75vh] overflow-hidden bg-white">
    {/* Main shimmer background */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="w-full h-full bg-gray-100 relative">
        {/* Shimmer effect overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
          animate={{
            x: ['0%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ width: '50%' }}
        />
      </div>
    </div>

    {/* Content placeholders */}
    <div className="absolute inset-0 flex items-center">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-xl space-y-5 md:space-y-7 ml-4 sm:ml-6 md:ml-8">
          {/* Title placeholder */}
          <div className="h-10 sm:h-12 md:h-14 lg:h-16 bg-gray-200 rounded-lg w-3/4 overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
              animate={{
                x: ['0%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
                delay: 0.2,
              }}
              style={{ width: '50%' }}
            />
          </div>
          
          {/* Subtitle placeholder */}
          <div className="space-y-2">
            <div className="h-5 sm:h-6 md:h-7 bg-gray-200 rounded-lg w-full overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                animate={{
                  x: ['0%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: 0.4,
                }}
                style={{ width: '50%' }}
              />
            </div>
            <div className="h-5 sm:h-6 md:h-7 bg-gray-200 rounded-lg w-5/6 overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                animate={{
                  x: ['0%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: 0.6,
                }}
                style={{ width: '50%' }}
              />
            </div>
          </div>
          
          {/* Button placeholder */}
          <div className="pt-3">
            <div className="h-10 sm:h-12 md:h-14 bg-gray-200 rounded-lg w-40 md:w-48 overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                animate={{
                  x: ['0%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: 0.8,
                }}
                style={{ width: '50%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Indicator dots placeholders */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="h-2.5 sm:h-3 rounded-full bg-gray-200 w-2.5 sm:w-3 overflow-hidden relative"
          style={{ width: index === 0 ? '2rem' : '0.75rem' }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
            animate={{
              x: ['0%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
              delay: 1 + (index * 0.1),
            }}
            style={{ width: '50%' }}
          />
        </div>
      ))}
    </div>

    {/* Navigation button placeholders */}
    <div className=" left-4 sm:left-6 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 rounded-full bg-gray-200 w-10 h-10 sm:w-12 sm:h-12 overflow-hidden relative">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
        animate={{
          x: ['0%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
          delay: 1.2,
        }}
        style={{ width: '50%' }}
      />
    </div>
    <div className=" right-4 sm:right-6 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 rounded-full bg-gray-200 w-10 h-10 sm:w-12 sm:h-12 overflow-hidden relative">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
        animate={{
          x: ['0%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
          delay: 1.4,
        }}
        style={{ width: '50%' }}
      />
    </div>
  </div>;
  
  if (error) return <div>Error loading banners: {error}</div>;
  
  return <HeroBanner banners={heroBanners} />;
}