"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

const categories = [
  {
    name: "Ring",
    icon: "/cat-ring.png",
    slug: "ring"
  },
  {
    name: "Earring",
    icon: "/cat-earring.png",
    slug: "earring"
  },
  {
    name: "Necklace",
    icon: "/cat-necklace.png",
    slug: "necklace"
  },
  {
    name: "Pendant",
    icon: "/cat-pendent.png",
    slug: "pendant"
  },
  {
    name: "Bracelet",
    icon: "/cat-bracelet.png",
    slug: "bracelet"
  },
  {
    name: "Anklet",
    icon: "/cat-anklet.png",
    slug: "anklet"
  },
  {
    name: "Brooch",
    icon: "/cat-brooch.png",
    slug: "brooch"
  },
  {
    name: "Handbag",
    icon: "/cat-bag.png",
    slug: "handbag"
  }
];

const Category = () => {
  const router = useRouter();

  const handleCategoryClick = (slug) => {
    router.push(`/category/${slug}`);
  };

  return (
    <div className="flex flex-col bg-white items-center py-[30px] px-[10px] md:px-[30px]">
      <h1 className="text-2xl font-heading font-medium mb-6 text-gray-800">Categories</h1>
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex gap-3 sm:gap-4 my-3 md:mx-[8px] justify-start sm:justify-around sm:px-0">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center justify-center 
                          w-[90px] h-[110px] 
                          sm:w-[140px] sm:h-[140px] 
                          rounded-xl bg-purple-100 
                          hover:bg-purple-200 
                          transition-colors duration-300 
                          cursor-pointer 
                          shadow-md hover:shadow-lg 
                          flex-shrink-0 
                          p-2 space-y-2"
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category.slug)}
            >
              <div className="relative w-10 h-10 sm:w-16 sm:h-16">
                <Image
                  src={category.icon}
                  alt={`${category.name} icon`}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium text-center">
                {category.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;