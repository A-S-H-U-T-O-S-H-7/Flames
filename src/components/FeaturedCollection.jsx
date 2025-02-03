import React from "react";
import FeaturedCollectionCard from "./FeaturedCollectionCard";
import Link from "next/link";

function FeaturedCollection() {
  const featuredCollection = [
    {
      id:5,
      image: "/bangle.webp",
      title: "Bangle",
      price: 4999,
      strikePrice: 5999,
    },
    {
      id:21,
      image: "/earring2.webp",
      title: "Pearl Earring",
      price: 3999,
      strikePrice: 4999,
    },
    {
      id:22,
      image: "/earrings.jpg",
      title: "Earring",
      price: 2999,
      strikePrice: 3999,
    },
    {
      id:23,
      image: "/ring.jpg",
      title: "Stone Ring",
      price: 5999,
      strikePrice: 6999,
    },
    {
      id:24,
      image: "/nacklace.webp",
      title: "Necklace",
      price: 4499,
      strikePrice: 5499,
    },
    {
      id:25,
      image: "/demo7.jpeg",
      title: "Jhumka",
      price: 499,
      strikePrice: 499,
    },
    {
      id:26,
      image: "/demo6.jpeg",
      title: "Bracelet",
      price: 3499,
      strikePrice: 4499,
    },
  ];

  return <div className="bg-gray-100 px-[5px] md:px-[30px]">
      <h2 className="text-2xl font-heading font-medium text-center  text-gray-800 pt-8 mb-2">
        Featured Collection
      </h2>
      <Link href="/featured-collection">
      <div className="mt-4 text-center">
        <button className=" text-purple-500  px-6 rounded-lg hover:text-purple-600 transition">
          View All
        </button>
      </div>
      </Link>
      <div className="flex overflow-x-auto space-x-2 no-scrollbar py-10">
      {featuredCollection.map((product, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-[172px] md:w-[220px]"
        >
          <FeaturedCollectionCard
             id={product.id}
            image={product.image}
            title={product.title}
            price={product.price}
            strikePrice={product.strikePrice}
          />
        </div>
      ))}
      </div>


    </div>;
}

export default FeaturedCollection;


