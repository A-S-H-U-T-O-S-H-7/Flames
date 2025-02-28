"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const giftProducts = [
  { image: "/wrapped-present.jpg", title: "Handmade Presents", id: "vxxyxAdsyxMFaTAz4Lfv" },
  { image: "/gift1.jpg", title: "Customize Gifts", id: "vxxyxAdsyxMFaTAz4Lfv" },
  { image: "/gift1.3.jpg", title: "Cards", id: "vxxyxAdsyxMFaTAz4Lfv" },
  { image: "/gift2.1.jpg", title: "Chocolate", id: "vxxyxAdsyxMFaTAz4Lfv" },
];

const GiftsSection = () => {
  return (
    <section className="py-8 md:py-12 bg-gradient-to-r from-[#D0D3FF] to-[#FDE3FE]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold font-heading text-center text-purple-600 mb-4 md:mb-6">
          Gifts That Speak to the Heart
        </h2>
        <p className="text-center font-body text-base md:text-lg text-gray-600 mb-6 md:mb-10 max-w-2xl mx-auto">
          Thoughtful presents that connect, inspire, and delight souls.
        </p>

        {/* Main Container */}
        <div className="flex flex-col justify-center items-center lg:flex-row lg:items-stretch lg:gap-8 max-w-6xl mx-auto">
          {/* Left Image */}
          <Link href="/category/vxxyxAdsyxMFaTAz4Lfv" className="w-full lg:w-2/5 mb-6 lg:mb-0">
            <motion.div
              className="relative rounded-xl shadow-lg overflow-hidden h-full w-full cursor-pointer"
              style={{ minHeight: "300px" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/gift1.2.jpg"
                alt="Thoughtful gifts"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-purple-600/90 to-transparent text-center py-4 md:py-6">
                <h3 className="text-white font-body text-xl md:text-2xl font-bold">
                  Thoughtfuls
                </h3>
              </div>
            </motion.div>
          </Link>

          {/* Right Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 w-full lg:w-3/5">
            {giftProducts.map((product, index) => (
              <Link key={index} href={`/category/vxxyxAdsyxMFaTAz4Lfv`}>
                <motion.div
                  className="relative bg-white rounded-md shadow-lg overflow-hidden cursor-pointer h-36 sm:h-44 md:h-52"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-purple-700/90 to-transparent text-center py-2 md:py-3">
                    <h3 className="text-white text-sm sm:text-base md:text-lg font-semibold px-1">
                      {product.title}
                    </h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftsSection;