"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, Minus, Plus, Heart, Info, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Photos from "./Photos";
import RelatedProducts from "./RelatedProducts";
import AddToCart from "../AddToCart";
import FavoriteButton from "../FavoriteButton";
import AuthContextProvider from "@/context/AuthContext";

const ProductInfo = ({ product }) => {
  const {
    title,
    featureImageURL,
    imageList = [],
    salePrice,
    price,
    shortDescription = "No short description available.",
    stock = 0,
    categoryId,
    id: productId,
  } = product;

  const [quantity, setQuantity] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Fade-in animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  // Hover animation variants
  const hoverScale = {
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const incrementQuantity = () => {
    setQuantity(prev => {
      const newValue = prev + 1;
      // Add a subtle pop animation when changing quantity
      return newValue;
    });
  };

  const decrementQuantity = () => quantity > 1 && setQuantity(prev => prev - 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-purple-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 backdrop-blur-sm bg-white/90">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
            {/* Image Gallery Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-8 relative"
            >
              <div className="absolute top-4 right-4 z-10">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white p-2 rounded-full shadow-lg"
                >
                  <Heart className="w-6 h-6 text-pink-500" />
                </motion.div>
              </div>
              <Photos imageList={[featureImageURL, ...imageList]} />
            </motion.div>

            {/* Product Information Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-8 lg:border-l border-gray-200 space-y-8"
            >
              {/* Title with badge */}
              <div className="space-y-2">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium"
                >
                  <Star className="w-4 h-4 mr-1" />
                  Featured Product
                </motion.div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                  {title}
                </h1>
              </div>

              {/* Enhanced Price Display */}
              <motion.div 
                className="flex flex-wrap items-center gap-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600">
                  ₹ {salePrice || price || "0"}
                </span>
                {salePrice && price && salePrice !== price && (
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <span className="text-lg text-gray-500 line-through">₹ {price}</span>
                    <span className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-lg">
                      {Math.round(((price - salePrice) / price) * 100)}% OFF
                    </span>
                  </motion.div>
                )}
              </motion.div>

              {/* Enhanced Stock Status */}
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative"
                  onHoverStart={() => setShowTooltip(true)}
                  onHoverEnd={() => setShowTooltip(false)}
                >
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium gap-2 ${
                    stock > 0 
                      ? "bg-green-100 text-green-800 border border-green-200" 
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
                    {stock > 0 ? `${stock} in Stock` : "Out of Stock"}
                    <Info className="w-4 h-4 cursor-help" />
                  </span>
                  <AnimatePresence>
                    {showTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full mt-2 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl z-10 w-64"
                      >
                        {stock > 0 
                          ? "Product is available and ready to ship within 24 hours"
                          : "Product is currently unavailable. Please check back later"}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>

              {/* Enhanced Description */}
              <motion.div 
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 shadow-inner"
                whileHover={{ boxShadow: "0 8px 24px rgba(147, 51, 234, 0.1)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-gray-700 leading-relaxed">{shortDescription}</p>
              </motion.div>

              {/* Enhanced Quantity Selector */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <motion.div 
                  className="flex items-center border-2 border-purple-200 rounded-xl bg-white overflow-hidden shadow-sm"
                  whileHover={{ borderColor: "#9333ea", boxShadow: "0 4px 12px rgba(147, 51, 234, 0.1)" }}
                >
                  <motion.button 
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border-r border-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4 text-purple-600" />
                  </motion.button>
                  <motion.span 
                    key={quantity}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-16 text-center font-semibold text-lg text-gray-800"
                  >
                    {quantity}
                  </motion.span>
                  <motion.button 
                    onClick={incrementQuantity}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border-l border-purple-100 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-purple-600" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="mt-8 space-y-4 sm:space-y-0 sm:flex sm:gap-4">
                <div className="grid grid-cols-2 sm:flex gap-4 w-full">
                  <AuthContextProvider>
                    <motion.button 
                      whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(147, 51, 234, 0.2)" }}
                      whileTap={{ scale: 0.98 }}
                      className="flex gap-2 justify-center items-center bg-gradient-to-r from-purple-600 to-purple-800 text-white py-4 px-8 rounded-xl shadow-lg transition-all duration-300"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span className="font-medium">Add to Cart</span>
                    </motion.button>
                    
                    <AddToCart type="cute" productId={productId} quantity={quantity} />
                    
                    <motion.button 
                      whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(236, 72, 153, 0.2)" }}
                      whileTap={{ scale: 0.98 }}
                      className="col-span-2 sm:col-span-1 bg-gradient-to-r from-pink-600 to-pink-800 text-white py-4 px-8 rounded-xl shadow-lg transition-all duration-300"
                    >
                      Buy Now
                    </motion.button>

                    <motion.div 
                      className="flex justify-end"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FavoriteButton productId={productId} />
                    </motion.div>
                  </AuthContextProvider>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Sticky Add to Cart Bar */}
          <AnimatePresence>
            {isScrolled && (
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 flex justify-between items-center z-50 shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <motion.img 
                    src={featureImageURL} 
                    alt={title} 
                    className="w-16 h-16 rounded-xl object-cover shadow-lg"
                    whileHover={{ scale: 1.1 }}
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                    <p className="text-lg font-bold text-purple-600">₹ {salePrice || price}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AuthContextProvider>
                    <AddToCart type="cute" productId={productId} quantity={quantity} />
                    <FavoriteButton productId={productId} />
                  </AuthContextProvider>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Related Products Section */}
          <div className="border-t border-gray-200 bg-gradient-to-b from-white to-purple-50">
            <RelatedProducts categoryId={categoryId} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductInfo;