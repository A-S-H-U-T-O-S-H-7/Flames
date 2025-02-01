"use client";

import React from "react";
import { motion } from "framer-motion";

const categories = [
  "Ring",
  "Earring",
  "Necklace",
  "Pendant",
  "Bracelet",
  "Anklet",
  "Brooch",
  "Hairpin",
];

const Category = () => {
  return (
    <div className="flex flex-col bg-white items-center p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Categories</h1>
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex gap-4 my-3 h-50 justify-around">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-xl bg-gradient-to-br from-pink-300 to-purple-400 text-white text-lg font-semibold shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {category}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
