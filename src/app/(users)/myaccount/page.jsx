"use client"
import React, { useState } from "react";
import Favorites from "@/components/web/pages/Favorites";
import Cart from "@/components/web/pages/Cart";
import Orders from "@/components/Orders";
import { useAuth } from "@/context/AuthContext"; 

const OrdersTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuth();

  const tabs = ["My Orders", "Favorites", "Cart", "My Address"];
  const tabComponents = [<Orders/>,<Favorites />,<Cart/>];

  return (
    <div className=" bg-white py-5 px-[10px] md:px-[30px]">
      <div className="bg-purple-700 text-white p-3  text-center w-full rounded-lg font-heading">
        <h2 className="text-2xl font-semibold">My Account</h2>
      </div>
      <div className="flex items-center bg-purple-100 p-4 rounded-md shadow-md mt-2">
        <img
          src={user?.photoURL || "/flame1.png"}
          alt="Profile"
          className="w-16 h-16 rounded-full border-2 border-purple-500"
        />
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-purple-700">{user?.displayName || "Flamer"}</h3>
          <p className="text-sm text-gray-600">{user?.email || "user@flamer.com"}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-between mt-4 border border-purple-200 rounded-t-md bg-white p-2 shadow-md">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-6 py-2 m-1 transition-all duration-300 rounded-md text-sm font-medium font-body 
              ${
                activeTab === index
                  ? "text-purple-700 bg-purple-100 border-b-4 border-purple-500 shadow-md"
                  : "text-gray-600 hover:text-purple-700 hover:bg-gray-100"
              }
              sm:px-4 sm:py-1 md:px-6 md:py-2 text-xs sm:text-sm md:text-base
            `}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className=" bg-gray-50 min-h-[200px] rounded-b-md overflow-hidden shadow-md font-body">
        {tabComponents[activeTab]}
      </div>
    </div>
  );
};

export default OrdersTabs;
