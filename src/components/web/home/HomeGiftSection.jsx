"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation, useInView } from "framer-motion";

const giftProducts = [
  { image: "/wrapped-present.jpg", title: "Handmade Presents", id: "Dv3q9Y7sbPx1Ewtz3AmQ" },
  { image: "/gift1.jpg", title: "Customize Gifts", id: "Dv3q9Y7sbPx1Ewtz3AmQ" },
  { image: "/gift1.3.jpg", title: "Cards", id: "Dv3q9Y7sbPx1Ewtz3AmQ" },
  { image: "/gift2.1.jpg", title: "Chocolate", id: "Dv3q9Y7sbPx1Ewtz3AmQ" },
];

const GiftsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
  };

  return (
    <section 
      ref={sectionRef}
      className="py-8 md:py-12 bg-gradient-to-r from-[#D0D3FF] to-[#FDE3FE]"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-center text-purple-600 mb-4 md:mb-6">
            Gifts That Speak to the Heart
          </h2>
          <p className="text-center font-body text-base md:text-lg text-gray-600 mb-6 md:mb-10 max-w-2xl mx-auto">
            Thoughtful presents that connect, inspire, and delight souls.
          </p>
        </motion.div>

        {/* Main Container */}
        <motion.div 
          className="flex flex-col justify-center items-center lg:flex-row lg:items-stretch lg:gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Left Image */}
          <motion.div 
            className="w-full lg:w-2/5 mb-6 lg:mb-0"
            variants={itemVariants}
          >
            <Link href="/category/Dv3q9Y7sbPx1Ewtz3AmQ" className="block h-full">
              <motion.div
                className="relative rounded-xl shadow-lg overflow-hidden h-64 md:h-80 lg:h-full w-full cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/gift1.2.jpg"
                  alt="Thoughtful gifts"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  className="object-cover rounded-md"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-purple-600/90 to-transparent text-center py-4 md:py-6">
                  <h3 className="text-white font-body text-xl md:text-2xl font-bold">
                    Thoughtfuls
                  </h3>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Right Grid */}
          <motion.div 
            className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 w-full lg:w-3/5"
            variants={containerVariants}
          >
            {giftProducts.map((product, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link href={`/category/${product.id}`} className="block h-full">
                  <motion.div
                    className="relative bg-white rounded-md shadow-lg overflow-hidden cursor-pointer h-36 sm:h-44 md:h-52"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-purple-700/90 to-transparent text-center py-2 md:py-3">
                      <h3 className="text-white text-sm sm:text-base md:text-lg font-semibold px-1">
                        {product.title}
                      </h3>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default GiftsSection;