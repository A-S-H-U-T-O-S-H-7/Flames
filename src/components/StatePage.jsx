"use client"
import React from 'react';
import StateCard from './StateCard';
import { useRouter } from 'next/navigation';

const demoData = [
  {
    id:1,
    title: 'The Traditional Jewelry',
    image: '/jewelrybanner.webp',
    description: 'Live like a princess',
    startingPrice: '499',
    quantity: '40',
    bgColor: '#fbf5f2',
    textColor: 'text-gray-800',
    slug:'kashmir',
  },
  {
    id:2,
    title: 'Royal Pearl Collection',
    image: '/pearlbanner.webp',
    description: 'Elegance Redefined',
    startingPrice: '999',
    quantity: '30',
    bgColor: '#fdf6e3',
    textColor: 'text-gray-900',
    slug:'delhi',

  },
  {
    id:3,
    title: 'Luxury Gold Set',
    image: '/goldbanner.webp',
    description: 'Timeless Beauty',
    startingPrice: '1,499',
    quantity: '50',
    bgColor: '#fcf4d9',
    textColor: 'text-gray-700',
    slug:'mumbai',

  },
  {
    id:4,
    title: 'Diamond Radiance',
    image: '/diamondbanner.webp',
    description: 'Shine Bright Like a Diamond',
    startingPrice: '2,999',
    quantity: '25',
    bgColor: '#fef3f3',
    textColor: 'text-gray-900',
    slug:'aasam',

  },
  {
    id:5,
    title: 'Elegant Silver Touch',
    image: '/silverbanner.webp',
    description: 'Subtle Yet Stunning',
    startingPrice: '799',
    quantity: '35',
    bgColor: '#f0f4f8',
    textColor: 'text-gray-800',
    slug:'kolkata',

  },
  {
    id:6,
    title: 'Elegant Green Touch',
    image: '/bluedart.jpg',
    description: 'Subtle Yet Stunning',
    startingPrice: '599',
    quantity: '35',
    bgColor: '#0E204A',
    textColor: 'text-gray-800',
    slug:'chennai',

  }
];

function StatePage() {
    const router = useRouter();

    const handleStateClick = (slug) => {
      router.push(`/state-category/${slug}`); 
    };
  
  
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-[10px] md:px-[30px]">
      <h1 className="text-center text-2xl font-bold font-heading text-gray-800 mb-8">Our Exclusive Collections</h1>
      <div >
       {demoData.map((item) => (
          <StateCard 
            key={item.id}
            id={item.id}
            title={item.title}
            image={item.image || "/demo1.jpeg"}
            description={item.description}
            startingPrice={item.startingPrice}
            quantity={item.quantity}
            bgColor={item.bgColor}
            textColor={item.textColor}
            onClick={() => handleStateClick(item.slug)}
          />
        ))}
      </div>
      </div>
    
  );
}

export default StatePage;
