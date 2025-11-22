"use client"
import React, { useEffect, useRef, useState } from "react";

const CustomerReviews = () => {
  const reviews = [
    {
      name: "Akanksha Khanna",
      age: 27,
      review:
        "Delighted with my engagement ring! It's my dream ring, fits perfectly, and is stunning to look at.",
      image: "/review-image1.jpg",
    },
    {
      name: "Diksha Singh",
      age: 29,
      review:
        "Flames's customer service gave me full assurance, and the delivery was super quick.",
      image: "/review-image2.jpeg",
    },
    {
      name: "Ashutosh Mohanty",
      age: 24,
      review:
        "Flames's customer service gave me full assurance, and the delivery was super quick.",
      image: "/review-image3.webp",
    },
    {
      name: "Ahraz",
      age: 21,
      review:
        "Flames's customer service gave me full assurance, and the delivery was super quick.",
      image: "/review-image4.webp",
    },
    {
      name: "Nutan Mishra",
      age: 33,
      review:
        "I got a Nazariya for my baby boy. It gives me a sense of security knowing it's there. Lovely pieces!",
      image: "/review-image1.jpg",
    },
    {
      name: "Divya Mishra",
      age: 26,
      review:
        "On Valentine's Day, my husband gifted me a necklace. I just LOVE how nice it looks on me.",
      image: "/demo2.jpeg",
    },
  ];

  const scrollRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollInterval;
    let scrollAmount = 0;
    const distance = 1; // Adjust scroll speed here

    const startScroll = () => {
      scrollInterval = setInterval(() => {
        scrollContainer.scrollLeft += distance;
        scrollAmount += distance;

        // When we reach the end, loop back to start
        if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollContainer.scrollLeft = 0;
          scrollAmount = 0;
        }
      }, 30);
    };

    const stopScroll = () => {
      clearInterval(scrollInterval);
    };

    // Start scrolling after a short delay
    setTimeout(() => startScroll(), 2000);

    // Pause scrolling when user interacts with the carousel
    scrollContainer.addEventListener("mouseenter", stopScroll);
    scrollContainer.addEventListener("touchstart", stopScroll);

    // Resume scrolling when user stops interacting
    scrollContainer.addEventListener("mouseleave", startScroll);
    scrollContainer.addEventListener("touchend", startScroll);

    // Set cards to visible for entry animation
    setTimeout(() => setIsVisible(true), 300);

    return () => {
      clearInterval(scrollInterval);
      if (scrollContainer) {
        scrollContainer.removeEventListener("mouseenter", stopScroll);
        scrollContainer.removeEventListener("touchstart", stopScroll);
        scrollContainer.removeEventListener("mouseleave", startScroll);
        scrollContainer.removeEventListener("touchend", startScroll);
      }
    };
  }, []);

  return (
    <div className="bg-[#fae7d7] py-12 px-[10px] md:px-[30px]">
      <h2 className="text-2xl font-medium font-heading text-center text-gray-800 mb-8">
        What Our Customers Say
      </h2>
      <div 
        ref={scrollRef} 
        className="overflow-x-auto flex gap-6 py-4 px-2 no-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        {reviews.map((review, index) => (
          <div
            key={index}
            className={`bg-white shadow-lg rounded-lg p-6 w-64 h-auto transform transition hover:scale-105 hover:shadow-2xl flex-shrink-0 ${
              isVisible ? "opacity-100" : "opacity-0 translate-y-8"
            }`}
            style={{
              transform: `rotate(${index % 2 === 0 ? "-2" : "2"}deg)`,
              transition: `opacity 0.5s ease, transform 0.5s ease ${index * 0.1}s`,
            }}
          >
            <div className="relative h-40 w-full rounded-lg overflow-hidden mb-4">
              <img
                src={review.image}
                alt={review.name}
                className="object-cover h-full w-full"
              />
            </div>
            <h3 className="text-lg font-body font-semibold text-gray-800">
              {review.name}, {review.age}
            </h3>
            <p className="text-sm text-gray-600 mt-2 italic">
              "{review.review}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;