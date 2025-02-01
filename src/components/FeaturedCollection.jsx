import React from "react";
import FeaturedCollectionCard from "./FeaturedCollectionCard";

function FeaturedCollection() {
  const newArrivals = [
    {
      image: "/bangle.webp",
      title: "Bangle",
      price: 4999,
      strikePrice: 5999,
    },
    {
      image: "/earring2.webp",
      title: "Pearl Earring",
      price: 3999,
      strikePrice: 4999,
    },
    {
      image: "/earrings.jpg",
      title: "Earring",
      price: 2999,
      strikePrice: 3999,
    },
    {
      image: "/ring.jpg",
      title: "Stone Ring",
      price: 5999,
      strikePrice: 6999,
    },
    {
      image: "/nacklace.webp",
      title: "Necklace",
      price: 4499,
      strikePrice: 5499,
    },
    {
      image: "/bracelet.jpg",
      title: "Bracelet",
      price: 3499,
      strikePrice: 4499,
    },
  ];

  return <div className="bg-gray-100 px-[10px] md:px-[30px]">
      <h2 className="text-3xl font-heading font-bold text-center  text-gray-800 pt-8 mb-2">
        Featured Collection
      </h2>
      <div className="mt-4 text-center">
        <button className=" text-purple-500  px-6 rounded-lg hover:text-purple-600 transition">
          View All
        </button>
      </div>
      <div className="flex overflow-x-auto space-x-4  no-scrollbar py-10">
      {newArrivals.map((product, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-[175px] md:w-[220px]"
        >
          <FeaturedCollectionCard
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


