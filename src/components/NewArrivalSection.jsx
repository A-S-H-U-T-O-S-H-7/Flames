import React from "react";
import NewArrivalCard from "./NewArrivalCard";
import Link from "next/link";

function NewArrivalSection() {
  const newArrivals = [
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
      image: "/bracelet.jpg",
      title: "Bracelet",
      price: 3499,
      strikePrice: 4499,
    },
  ];

  return <div className="bg-gray-100 px-[5px] md:px-[30px]">
      <h2 className="text-2xl font-medium font-heading text-center  text-gray-800 pt-8 mb-2">
        New Arrivals
      </h2>
      <Link href="/new-arrival-collection">
      <div className="mt-4 text-center">
        <button className=" text-purple-500 font-body  px-6 rounded-lg hover:text-purple-600 transition">
          View All
        </button>
      </div>
      </Link>

      <div className="flex overflow-x-auto space-x-2 md:space-x-4 no-scrollbar py-10">
      {newArrivals.map((product,i) => (
        <div
          key={i}
          className="flex-shrink-0 w-[172px] md:w-[220px]"
        >
          <NewArrivalCard
            id ={product.id}
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
