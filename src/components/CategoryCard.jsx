"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const CategoryCard = ({ categories }) => { 
  return (
    <div className="flex flex-col bg-white items-center py-[30px] px-[10px] md:px-[30px]">
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex gap-3 sm:gap-4 my-3 md:mx-[8px] justify-start sm:justify-around sm:px-0">
          {categories.map((category) => (
           <Link key={category.id} href={`/category/${category?.id}`}>
        
              <motion.div
              key={category.id} 
                className="flex flex-col items-center justify-center 
                            w-[90px] h-[110px] 
                            sm:w-[120px] sm:h-[120px] 
                            rounded-xl bg-purple-100 
                            hover:bg-purple-200 
                            transition-colors duration-300 
                            cursor-pointer 
                            shadow-md hover:shadow-lg 
                            flex-shrink-0 
                            p-2 space-y-2"
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative w-10 h-10 sm:w-16 sm:h-16">
                  <Image
                    src={category.imageURL}
                    alt={`${category.name} icon`}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium text-center">
                  {category.name}
                </p>
              </motion.div>
              </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;