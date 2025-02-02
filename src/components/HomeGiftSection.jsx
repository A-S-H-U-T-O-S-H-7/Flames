"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const giftProducts = [
  { image: "/wrapped-present.jpg", title: "Handmade Presents", slug: "gift" },
  { image: "/gift1.jpg", title: "Customize Gifts", slug: "gift" },
  { image: "/gift1.3.jpg", title: "Cards", slug: "gift" },
  { image: "/gift2.1.jpg", title: "Chocolate", slug: "gift" },
];

const GiftsSection = () => {
  const router = useRouter();

  const handleGiftClick = (slug) => {
    router.push(`/category/${slug}`);
  };

  return (
    <section className="py-8 bg-gradient-to-r from-[#D0D3FF] to-[#FDE3FE]">
      <h2 className="text-2xl font-bold px-[5px] font-heading text-center text-purple-600 mb-6">
        Gifts That Speak to the Heart
      </h2>
      <p className="text-center font-body text-lg text-gray-600 mb-8">
        Thoughtful presents that connect, inspire, and delight souls.
      </p>

      {/* Main Container */}
      <div className="flex flex-col justify-center items-center lg:flex-row lg:items-start lg:gap-10 px-4">
        {/* Left Image */}
        <div
          className="relative rounded-xl shadow-lg mb-6 lg:mb-0 lg:flex-1 max-w-sm w-full cursor-pointer"
          style={{ aspectRatio: "425 / 465" }}
          onClick={() => handleGiftClick("gift")}
        >
          <Image
            src="/gift1.2.jpg"
            alt="gift"
            layout="fill"
            objectFit="cover"
            className="rounded-md overflow-hidden"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-purple-500/100 to-transparent text-center py-4">
            <h3 className="text-white font-body text-2xl font-bold">
              Thoughfuls
            </h3>
          </div>
        </div>

        {/* Right Grid */}
        <div className="grid grid-cols-2 gap-4 w-full lg:w-[60%] sm:gap-6">
          {giftProducts.map((product, index) => (
            <div
              key={index}
              className="relative bg-white rounded-md shadow-lg overflow-hidden cursor-pointer"
              style={{ height: "200px" }}
              onClick={() => handleGiftClick(product.slug)}
            >
              <Image
                src={product.image}
                alt={product.title}
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute bottom-0 font-body inset-x-0 bg-gradient-to-t from-purple-800/100 to-transparent text-center py-2">
                <h3 className="text-white text-lg font-semibold">
                  {product.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GiftsSection;
