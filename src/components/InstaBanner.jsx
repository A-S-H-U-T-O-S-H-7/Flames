import React from 'react';

const InstaBanner = () => {
  return (
    <div className="h-[200px] bg-[#E1306C] flex items-center justify-center relative overflow-hidden">
      {/* Glowing Effect */}
      <div className="absolute inset-0 bg-pink-500 opacity-30 blur-3xl animate-pulse"></div>
      
      <div className="text-center px-8 py-6 rounded-2xl relative z-10">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3 drop-shadow-lg animate-glow">
          Explore Our Insta Shop
        </h1>
        <p className="text-lg md:text-2xl font-body text-white/90 drop-shadow-md animate-glow">
          Shop By Instagram Sellers
        </p>
      </div>
    </div>
  );
};

export default InstaBanner;
