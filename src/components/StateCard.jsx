import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function StateCard({ id,title, image, description, startingPrice, quantity, bgColor, textColor,onClick }) {
  return (
    <div className=' py-[20px] '>
      <div className=' border-gray-400 overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300  max-h-[330px]' style={{ backgroundColor: bgColor }} onClick={onClick}>
        {/* Image Container */}
        <div className='relative h-[220px] overflow-hidden'>
          <Image 
            src={image}
            alt={title}
            className='w-full h-full object-cover transform '
            width={1000} 
            height={220}
            priority
          />
        </div>

        {/* Title Section */}
        <div className='border-y border-dashed border-gray-400 py-2 bg-white/80 backdrop-blur-sm'>
          <h1 className='text-gray-800 text-center text-lg sm:text-xl font-serif'>
           {title}
          </h1>
          <p className='text-center text-gray-600 text-xs sm:text-sm font-light tracking-wide italic'>
           {description}
          </p>
        </div>

        {/* Footer Section */}
        <div className='flex justify-between items-center px-2 sm:px-8 pb-2'>
          <div className='flex items-center space-x-2'>
            <span className='w-1.5 h-1.5 bg-yellow-600 rounded-full'></span>
            <p className='text-gray-800 font-medium text-sm'>
             {quantity} Designs
            </p>
          </div>
          
          <p className='text-gray-800 py-4 font-semibold text-sm'>
            Starting from <span className='text-yellow-600'>₹{startingPrice}/-</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default StateCard;