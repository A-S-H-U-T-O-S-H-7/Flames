import React from "react";
import NewArrivalCard from "./NewArrivalCard";

function NewArrivalSection() {
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

  return <div className="bg-gray-100 px-[10px] lg:px-10">
      <h2 className="text-3xl font-bold text-center  text-gray-800 pt-8 mb-2">
        New Arrivals
      </h2>
      <div className="mt-4 text-center">
        <button className=" text-purple-500  px-6 rounded-lg hover:text-purple-600 transition">
          View All
        </button>
      </div>
      <div className="flex overflow-x-auto space-x-6 no-scrollbar py-10">
      {newArrivals.map((product, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-[260px] sm:w-[300px] md:w-[260px]"
        >
          <NewArrivalCard
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

export default NewArrivalSection;


{/* <section className="py-12 bg-gray-100">
<div className="container mx-auto ">
  <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
    New Arrivals
  </h2>
   <div className="mt-4 text-center">
    <button className=" text-purple-500  px-6 rounded-lg hover:text-purple-600 transition">
      View All
    </button>
  </div>

  <div className="relative">
    <div className="flex overflow-x-auto space-x-6 no-scrollbar py-8 ">
      {newArrivals.map((product, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-[260px] sm:w-[300px] md:w-[260px]"
        >
          <NewArrivalCard
            image={product.image}
            title={product.title}
            price={product.price}
            strikePrice={product.strikePrice}
          />
        </div>
      ))}
    </div>
  </div>

 
</div>
</section> */}
