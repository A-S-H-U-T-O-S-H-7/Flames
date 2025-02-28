// 'use client';
// import { motion } from 'framer-motion';
// import Image from 'next/image';

// export default function AboutUs() {
//   // Animation variants
//   const fadeInUp = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };
  
//   return (
//     <div className="bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white min-h-screen">
//       <div className="container mx-auto md:px-8 px-4 py-12">
//         {/* Header Section with smaller title */}
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           transition={{ staggerChildren: 0.2 }}
//           className="text-center mb-10"
//         >
//           <motion.div
//             variants={fadeInUp}
//             transition={{ duration: 0.7 }}
//           >
//             <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-pink-300 to-amber-300">
//               FLAMES
//             </h1>
//             <div className="h-1 w-16 mx-auto bg-gradient-to-r from-amber-300 to-pink-400 rounded-full mb-4"></div>
//           </motion.div>
          
//           <motion.p 
//             variants={fadeInUp}
//             transition={{ duration: 0.7, delay: 0.1 }}
//             className="text-lg max-w-2xl mx-auto text-pink-100 font-light"
//           >
//             Where style ignites and elegance radiates
//           </motion.p>
//         </motion.div>
        
//         {/* Our Story Section - more compact */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-12"
//         >
//           <div className="relative">
//             <motion.div
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.7 }}
//               className="relative z-10 rounded-lg overflow-hidden shadow-lg shadow-purple-900/40"
//             >
//               <Image
//                 src="/about-fashion.jpg"
//                 alt="Fashion Collection"
//                 width={400}
//                 height={300}
//                 className="object-cover w-full h-48 md:h-64"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent"></div>
//             </motion.div>
//             <div className="absolute top-4 -right-2 h-full w-full border border-amber-300 rounded-lg -z-10"></div>
//           </div>
          
//           <motion.div
//             variants={fadeInUp}
//             transition={{ duration: 0.7, delay: 0.3 }}
//             className="md:pl-4"
//           >
//             <h2 className="text-2xl font-bold mb-3 text-amber-300">Our Story</h2>
//             <p className="text-base mb-4 text-pink-100">
//               Flames is the bold fashion and jewelry destination that transforms everyday style into extraordinary statements. Born from a passion for self-expression, we curate collections that empower you to showcase your unique personality.
//             </p>
//             <motion.button
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//               className="px-6 py-2 bg-gradient-to-r from-pink-500 to-amber-500 rounded-full text-white text-sm font-medium shadow-md shadow-pink-700/20"
//             >
//               Discover Collections
//             </motion.button>
//           </motion.div>
//         </motion.div>
        
//         {/* Jewelry Section - more compact */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.8, delay: 0.4 }}
//           className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
//         >
//           <motion.div
//             variants={fadeInUp}
//             transition={{ duration: 0.7, delay: 0.5 }}
//             className="order-2 md:order-1 md:pr-4"
//           >
//             <h2 className="text-2xl font-bold mb-3 text-amber-300">Jewelry Masterpieces</h2>
//             <p className="text-base mb-4 text-pink-100">
//               Our jewelry collection transcends mere accessories – each piece tells a story, captures emotion, and elevates your presence. From delicate everyday pieces to bold statement designs, Flames jewelry is crafted to illuminate your natural radiance.
//             </p>
//             <div className="flex flex-wrap gap-2">
//               <motion.span
//                 whileHover={{ scale: 1.03 }}
//                 className="px-4 py-1 border border-pink-400 rounded-full text-pink-200 text-xs inline-block"
//               >
//                 Necklaces
//               </motion.span>
//               <motion.span
//                 whileHover={{ scale: 1.03 }}
//                 className="px-4 py-1 border border-amber-400 rounded-full text-amber-200 text-xs inline-block"
//               >
//                 Bracelets
//               </motion.span>
//               <motion.span
//                 whileHover={{ scale: 1.03 }}
//                 className="px-4 py-1 border border-pink-400 rounded-full text-pink-200 text-xs inline-block"
//               >
//                 Earrings
//               </motion.span>
//             </div>
//           </motion.div>
          
//           <div className="relative order-1 md:order-2">
//             <motion.div
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.7, delay: 0.1 }}
//               className="relative z-10 rounded-lg overflow-hidden shadow-lg shadow-purple-900/40"
//             >
//               <Image
//                 src="/about-jewelry.jpg"
//                 alt="Jewelry Collection"
//                 width={400}
//                 height={300}
//                 className="object-cover w-full h-48 md:h-64"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent"></div>
//             </motion.div>
//             <div className="absolute top-4 -left-2 h-full w-full border border-pink-400 rounded-lg -z-10"></div>
//           </div>
//         </motion.div>
        
//         {/* Collections Preview - added compact section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.6 }}
//           className="mt-12 text-center"
//         >
//           <h2 className="text-2xl font-bold mb-6 text-amber-300">Explore Our Collections</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {['Seasonal', 'Classics', 'Limited Edition', 'Essentials'].map((collection, index) => (
//               <motion.div
//                 key={collection}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.1 * index }}
//                 whileHover={{ y: -5 }}
//                 className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-4 rounded-lg border border-pink-800/30 shadow-md"
//               >
//                 <h3 className="text-amber-200 font-medium text-sm md:text-base">{collection}</h3>
//                 <p className="text-pink-200 text-xs mt-1">Discover more</p>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
import React from 'react'

function AboutUs() {
  return (
    <div>
      <h1>hi</h1>
    </div>
  )
}

export default AboutUs
