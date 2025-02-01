import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const GiftsSection = () => {
  const giftProducts = [
    { image: '/wrapped-present.jpg', title: 'Earrings', id:1 },
    { image: '/gift2.webp ', title: 'Rings',id:2 },
    { image: '/gift1.3.jpg', title: 'Bracelet',id:3 },
    { image: '/gift2.1.jpg', title: 'Pendant',id:4 },
  ];

  return (
    <section className="py-8 bg-gradient-to-r from-[#D0D3FF] to-[#FDE3FE]">
      <h2 className="text-4xl font-extrabold font-heading text-center text-purple-600 mb-6">
      Gifts That Speak to the Heart
      </h2>
      <p className="text-center font-body text-lg text-gray-600 mb-8">
      Thoughtful presents that connect, inspire, and delight souls.
      </p>

      {/* Main Container */}
      <div className="  flex flex-col justify-center items-center lg:flex-row lg:items-start lg:gap-10 px-4">
        {/* Left Image */}
        <div
          className="relative rounded-xl shadow-lg mb-6 lg:mb-0 lg:flex-1 max-w-sm w-full"
          style={{
            aspectRatio: '425 / 465',
          }}
        >
          <Image
            src="/gift1.2.jpg"
            alt="Mangalsutra"
            layout="fill"
            objectFit="cover"
            className="rounded-md overflow-hidden"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-purple-500/100 to-transparent text-center py-4">
            <h3 className="text-white font-body text-2xl font-bold">Mangalsutra</h3>
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
            <Link href="/listed-products-page">
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
              <div className="absolute bottom-0 font-body inset-x-0 bg-gradient-to-t from-purple-800/100 to-transparent text-center py-2">
                <h3 className="text-white text-lg font-semibold">
                  {product.title}
                </h3>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GiftsSection;
