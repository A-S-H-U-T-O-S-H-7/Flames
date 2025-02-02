"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const statesData = [
  {
    name: "Kerala",
    slug: "kerala",
    image: "/demo3.jpeg",
    bgColor: "bg-blue-100",
    gradientColor: "from-green-500",
    description: "Protective charm and design.",
  },
  {
    name: "Odisha",
    slug: "odisha",
    image: "/demo1.jpeg",
    bgColor: "bg-pink-200",
    gradientColor: "from-purple-800",
    description: "Explore the culture of Odisha.",
  },
  {
    name: "Gujarat",
    slug: "gujarat",
    image: "/demo5.jpeg",
    bgColor: "bg-purple-200",
    gradientColor: "from-cyan-400",
    description: "Gujarat's artistic heritage.",
  },
];

const StateSection = () => {
  const router = useRouter();

  const handleStateClick = (slug) => {
    router.push(`/state-category/${slug}`); 
  };

  return (
    <div className="px-[10px] md:px-[30px] py-10 md:py-16 lg:py-28 bg-[#f7f2fd]">
      {/* Main Grid Container */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-center">
        {statesData.map((state, index) => (
          <div
            key={state.slug}
            className={`relative ${state.bgColor} rounded-md overflow-hidden shadow-md h-[300px] md:h-[350px] cursor-pointer ${
              index === 1 ? "md:-mt-[80px]" : ""
            }`}
            onClick={() => handleStateClick(state.slug)}
          >
            <Image
              src={state.image}
              alt={state.name}
              fill
              objectFit="cover"
              className="rounded-lg hover:scale-105 transition-transform duration-300"
            />
            <div className={`absolute bottom-0 w-full bg-gradient-to-t ${state.gradientColor} to-transparent text-white px-4 py-2`}>
              <h3 className="text-2xl font-heading font-extrabold italic">{state.name}</h3>
              <p className="text-md font-body">{state.description}</p>
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
