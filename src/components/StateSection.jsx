import React from "react";
import Image from "next/image";
import Link from "next/link";

const StateSection = () => {
  return (
    <div className="px-[10px] lg:px-10 py-20 lg:py-28 bg-[#f7f2fd]">
      {/* Main Grid Container */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-center">
        {/* Block 1 */}
        <div className="relative bg-blue-100 rounded-md overflow-hidden shadow-md h-[300px] md:h-[350px]">
          <Image
            src="/demo3.jpeg"
            alt="Evil Eye"
            fill
            objectFit="cover"
            className="rounded-lg hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-transparent text-white px-4 py-2">
            <h3 className="text-lg font-bold">Kerala</h3>
            <p className="text-sm">Protective charm and design.</p>
          </div>
        </div>

        {/* Block 2 - Center Block */}
        <div className="relative bg-pink-200 rounded-md overflow-hidden shadow-md h-[300px] md:h-[350px] md:-mt-[80px] ">
          <Image
            src="/demo1.jpeg"
            alt="Hello Kitty and Friends"
            fill
            objectFit="cover"
            className="rounded-lg hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-purple-800 to-transparent text-white px-6 py-4">
            <h3 className="text-2xl font-extrabold italic">Odisha</h3>
            <p className="text-md">Explore the culture of Odisha.</p>
          </div>
        </div>

        {/* Block 3 */}
        <div className="relative bg-purple-200 rounded-lg overflow-hidden shadow-md h-[300px] md:h-[350px]">
          <Image
            src="/demo5.jpeg"
            alt="Art"
            fill
            objectFit="cover"
            className="rounded-lg hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-400 to-transparent text-white px-4 py-2">
            <h3 className="text-lg font-bold">Gujrat</h3>
            <p className="text-sm">Gujrat's artistic heritage.</p>
          </div>
        </div>
      </div>

      {/* Browse Collections Button */}
      <div className="flex justify-center mt-10 md:mt-0">
        <Link href="/state-page">
        <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-md hover:scale-105 transition-transform">
          Browse All Collections
        </button>
        </Link>
      </div>
    </div>
  );
};

export default StateSection;
