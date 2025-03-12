import React from "react";
import CollectionCard from "./CollectionCard";


const AllCollection = ({ collections }) => { 

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-[10px] md:px-[30px]">
      {/* Main Grid Container */}
      <h1 className="text-center text-2xl font-bold font-heading text-gray-800 mb-8">Our Exclusive Collections</h1>

      <div className="grid grid-cols-1 gap-6  items-center">
        {collections.map((collection) => (
          <CollectionCard 
          key={collection.id}
          id={collection.id}
          title={collection.title}
          image={collection.imageURL || "/demo1.jpeg"}
          description={collection.subTitle}
          startingPrice={collection.startingPrice}
          quantity={collection.quantity}
          bgcolor={collection.color}
          textColor={collection.textColor}
          
        />
        ))}
      </div>

      
    </div>
  );
};

export default AllCollection;