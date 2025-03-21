"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const CollectionSection = ({ showcasedCollections }) => { 
  return (
    <div className="px-[10px] md:px-[30px] pt-16 pb-10 md:pt-[120px] md:pb-10 bg-gradient-to-b from-white to-gray-50">
      {/* Main Grid Container */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-center">
        {showcasedCollections.slice(0, 3).map((collection, index) => (
          <div
            key={collection.id} 
            className={`relative ${collection.bgColor} rounded-md overflow-hidden shadow-md h-[300px] md:h-[350px] cursor-pointer ${
              index === 1 ? "md:-mt-[170px]" : ""
            }`}
          >
            <Link href={`/collections/${collection.id}`} passHref>
              <div className="relative w-full h-full">
                <Image
                  src={collection.imageURL}
                  alt={collection.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute bottom-0 w-full  px-4 py-2`}>
                  <h3 className="text-2xl font-heading font-extrabold italic">{collection.title}</h3>
                  <p className="text-md font-body">{collection.subTitle}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Browse Collections Button */}
      <div className="flex justify-center mt-10 md:mt-[-50px]">
        <Link href="/all-collectionPage" passHref>
        <button className="bg-gradient-to-r from-purple-600 to-white text-gray-800 px-8 py-3 rounded-md font-heading font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
  Browse All Collections
</button>
        </Link>
      </div>
    </div>
  );
};

export default CollectionSection;