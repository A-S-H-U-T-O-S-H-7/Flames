import React from 'react';
import Image from 'next/image';

const GiftsSection = () => {
  const giftProducts = [
    { image: '/earring2.webp', title: 'Earrings' },
    { image: '/gift2.webp', title: 'Rings' },
    { image: '/gift3.webp', title: 'Bracelet' },
    { image: '/gift4.webp', title: 'Pendant' },
  ];

  return (
    <section className="py-8 bg-gradient-to-r from-[#D0D3FF] to-[#FDE3FE]">
      <h2 className="text-4xl font-extrabold text-center text-purple-600 mb-6">
        Complete Fashion Collection
      </h2>
      <p className="text-center text-lg text-gray-600 mb-8">
        The Jewellery for every choice
      </p>

      {/* Main Container */}
      <div className=" mx-auto flex flex-col justify-center items-center lg:flex-row lg:items-start lg:gap-10 px-4">
        {/* Left Image */}
        <div
          className="relative rounded-xl shadow-lg mb-6 lg:mb-0 lg:flex-1 max-w-sm w-full"
          style={{
            aspectRatio: '425 / 465',
          }}
        >
          <Image
            src="/gift6.webp"
            alt="Mangalsutra"
            layout="fill"
            objectFit="cover"
            className="rounded-md overflow-hidden"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-purple-500/80 to-transparent text-center py-4">
            <h3 className="text-white text-2xl font-bold">Mangalsutra</h3>
          </div>
        </div>

        {/* Right Grid */}
        <div
          className="grid grid-cols-2 gap-4 w-full lg:w-[60%] sm:gap-6"
          style={{
            gridTemplateRows: 'auto',
          }}
        >
          {giftProducts.map((product, index) => (
            <div
              key={index}
              className="relative bg-white rounded-md shadow-lg overflow-hidden  "
              style={{
                height: '200px',
              }}
            >
              <Image
                src={product.image}
                alt={product.title}
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-purple-500/80 to-transparent text-center py-2">
                <h3 className="text-white text-lg font-semibold">
                  {product.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GiftsSection;
