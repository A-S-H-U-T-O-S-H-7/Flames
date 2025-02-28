"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const StateSection = ({ collections }) => {
  const router = useRouter();

  const handleStateClick = (id) => {
    router.push(`/state-category/${id}`); // Using ID instead of slug
  };

  return (
    <div className="px-[10px] md:px-[30px] pt-16 pb-10 md:pt-28 md:pb-10 bg-white">
      {/* Main Grid Container */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-center">
        {collections.slice(0, 3).map((state, index) => ( // Limiting to 3 items
          <div
            key={state.id} // Using ID as key
            className={`relative ${state.bgColor} rounded-md overflow-hidden shadow-md h-[300px] md:h-[350px] cursor-pointer ${
              index === 1 ? "md:-mt-[80px]" : ""
            }`}
            onClick={() => handleStateClick(state.id)} // Using ID for navigation
          >
            <Image
              src={state.imageURL} // Using imageURL instead of slug
              alt={state.title}
              fill
              objectFit="cover"
              className="rounded-lg hover:scale-105 transition-transform duration-300"
            />
            <div className={`absolute bottom-0 w-full bg-gradient-to-t ${state.gradientColor} to-transparent text-white px-4 py-2`}>
              <h3 className="text-2xl font-heading font-extrabold italic">{state.title}</h3>
              <p className="text-md font-body">{state.subTitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Browse Collections Button */}
      <div className="flex justify-center mt-10 md:mt-0">
        <Link href="/state-page">
          <button className="bg-gradient-to-r font-heading from-pink-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-md hover:scale-105 transition-transform">
            Browse All Collections
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StateSection;
