"use client"
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Photos({ imageList }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fitMode, setFitMode] = useState("cover"); // Default to cover, can toggle

  // Filter out empty/null images
  const validImages = imageList?.filter(img => img && img.trim() !== '') || [];
  
  if (!validImages.length) return null;

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % validImages.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const toggleFitMode = () => {
    setFitMode(prev => prev === "cover" ? "contain" : "cover");
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Main Image Container */}
      <div className="relative w-full max-w-3xl h-72 md:h-96 rounded-lg mb-6 overflow-hidden bg-gray-100">
        {/* Image with dynamic object-fit */}
        <img
          src={validImages[selectedIndex]}
          alt={`Photo ${selectedIndex + 1}`}
          className={`w-full h-full object-${fitMode} transition-all duration-300 ease-in-out`}
          onClick={toggleFitMode}
        />

        {/* Toggle fit mode button */}
        <button
          onClick={toggleFitMode}
          className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md hover:bg-black/70 transition"
        >
          {fitMode === "cover" ? "View Full" : "Fill Screen"}
        </button>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-400 text-white p-1 rounded-full hover:bg-black/70 transition"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6 md:w-5 md:h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-400 text-white p-1 rounded-full hover:bg-black/70 transition"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6 md:w-5 md:h-5" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center overflow-x-auto space-x-2 py-2 px-2">
        {validImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all border-2 ${
              selectedIndex === index
                ? "border-purple-500 scale-105"
                : "border-gray-300 hover:border-purple-400"
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </button>
        ))}
      </div>
    </div>
  );
}