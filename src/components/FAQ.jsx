"use client";

import { useState } from "react";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";

const FAQ = ({faqs}) => {
 
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="px-[10px] md:px-[30px] py-[40px] mx-auto bg-gradient-to-b from-purple-50 to-white">
      <h2 className="text-2xl font-medium text-gray-800 text-center font-heading mb-10">
        Frequently Asked Questions
      </h2>
      {faqs.length > 0 ? (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-purple-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 bg-white"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-md md:text-lg font-medium font-body text-gray-700">{faq.faq}</h3>

                <span
                  className={`text-md md:text-lg text-gray-700 font-bold transform transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                >
                  {activeIndex === index ? <FaMinus /> : <FaPlus />}
                </span>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeIndex === index
                    ? "max-h-[300px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="mt-4 font-body text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No FAQs available.</p>
      )}
    </div>
  );
};

export default FAQ;