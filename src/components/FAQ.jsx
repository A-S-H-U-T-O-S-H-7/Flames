"use client";

import { useState } from "react";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";

const FAQ = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  // Handle case when faqs is null, undefined, or not an array
  const faqItems = Array.isArray(faqs) ? faqs : [];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="px-4 md:px-8 py-10 mx-auto bg-gradient-to-b from-purple-50 to-white">
      <h2 className="text-2xl font-medium text-gray-800 text-center font-heading mb-10">
        Frequently Asked Questions
      </h2>
      {faqItems.length > 0 ? (
        <div className="space-y-4">
          {faqItems.map((faq, index) => (
            <div
              key={index}
              className="border border-purple-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 bg-white"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-md md:text-lg font-medium font-body text-gray-700">
                  {faq?.faq || "Question not available"}
                </h3>

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
                <p className="mt-4 font-body text-gray-600">
                  {faq?.answer || "Answer not available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No FAQs available.</p>
      )}
    </div>
  );
};

export default FAQ;