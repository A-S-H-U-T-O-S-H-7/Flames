"use client";

import { useState } from "react";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";

const FAQ = () => {
  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay for secure and convenient transactions."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days. Expedited shipping options are available at checkout for faster delivery."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day hassle-free return policy. Items must be unused, unworn, and in original packaging. Refunds are processed within 5-7 business days after receiving the return."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary depending on the destination. International customers may be subject to customs duties and taxes."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a confirmation email with a tracking number. You can track your package through our website or the carrier's tracking system."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="px-[10px] md:px-[30px] py-[40px] mx-auto bg-gradient-to-b from-purple-50 to-white">
      <h2 className="text-3xl font-extrabold text-gray-800 text-center font-heading mb-6">
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
                <h3 className="text-lg font-medium font-body text-gray-700">{faq.question}</h3>

                <span
                  className={`text-xl text-gray-700 font-bold transform transition-transform duration-300 ${
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