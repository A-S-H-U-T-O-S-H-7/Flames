import React from 'react';
import StateCard from './StateCard';

const demoData = [
  {
    title: 'The Traditional Jewelry',
    image: '/jewelrybanner.webp',
    description: 'Live like a princess',
    startingPrice: '499',
    quantity: '40',
    bgColor: '#fbf5f2',
    textColor: 'text-gray-800'
  },
  {
    title: 'Royal Pearl Collection',
    image: '/pearlbanner.webp',
    description: 'Elegance Redefined',
    startingPrice: '999',
    quantity: '30',
    bgColor: '#fdf6e3',
    textColor: 'text-gray-900'
  },
  {
    title: 'Luxury Gold Set',
    image: '/goldbanner.webp',
    description: 'Timeless Beauty',
    startingPrice: '1,499',
    quantity: '50',
    bgColor: '#fcf4d9',
    textColor: 'text-gray-700'
  },
  {
    title: 'Diamond Radiance',
    image: '/diamondbanner.webp',
    description: 'Shine Bright Like a Diamond',
    startingPrice: '2,999',
    quantity: '25',
    bgColor: '#fef3f3',
    textColor: 'text-gray-900'
  },
  {
    title: 'Elegant Silver Touch',
    image: '/silverbanner.webp',
    description: 'Subtle Yet Stunning',
    startingPrice: '799',
    quantity: '35',
    bgColor: '#f0f4f8',
    textColor: 'text-gray-800'
  },
  {
    title: 'Elegant Green Touch',
    image: '/bluedart.jpg',
    description: 'Subtle Yet Stunning',
    startingPrice: '599',
    quantity: '35',
    bgColor: '#0E204A',
    textColor: 'text-gray-800'
  }
];

function StatePage() {
  return (
    <div className="min-h-screen mt-[22px] bg-gray-100 py-10 px-1 sm:px-10">
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">Our Exclusive Collections</h1>
      <div >
       {demoData.map((item, index) => (
          <StateCard 
            key={index}
            title={item.title}
            image={item.image || "/demo1.jpeg"}
            description={item.description}
            startingPrice={item.startingPrice}
            quantity={item.quantity}
            bgColor={item.bgColor}
            textColor={item.textColor}
          />
        ))}
      </div>
      </div>
    
  );
}

export default StatePage;
