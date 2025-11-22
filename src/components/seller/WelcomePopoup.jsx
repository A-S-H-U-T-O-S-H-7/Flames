"use client";

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const SellerWelcomePopup = ({ sellerName, onClose }) => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  // Auto hide confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const sellerQuotes = [
    "Every great business begins with a single step. Welcome to your journey!",
    "Your passion meets opportunity here. Let's build something amazing together!",
    "Success in marketplace begins with great sellers. Welcome to the family!",
    "Your entrepreneurial journey starts now. Make it remarkable!",
    "Great sellers don't wait for opportunities, they create them. Welcome!"
  ];

  const randomQuote = sellerQuotes[Math.floor(Math.random() * sellerQuotes.length)];

  return (
    <>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={200}
          gravity={0.3}
          colors={['#10B981', '#8B5CF6', '#F59E0B', '#3B82F6', '#EF4444']}
          recycle={false}
        />
      )}
      
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 rounded-3xl shadow-2xl max-w-md w-full transform animate-scale-in">
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-2xl">🏆</span>
          </div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center">
            <span className="text-xl">⭐</span>
          </div>

          <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 m-2">
            {/* Main content */}
            <div className="text-center">
              {/* Animated celebration icon */}
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <span className="text-4xl">🎊</span>
              </div>

              {/* Welcome message */}
              <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">
                Welcome {sellerName}!
              </h2>
              
              <div className="bg-white/20 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                <p className="text-white text-xl font-semibold mb-2">
                  Congratulations on Joining Flames
                </p>
                <p className="text-white/90 text-sm italic">
                  "{randomQuote}"
                </p>
              </div>

              {/* Seller benefits list */}
              <div className="bg-white/10 rounded-xl p-4 mb-6 backdrop-blur-sm">
                <p className="text-white text-sm font-medium mb-2">Your Seller Benefits:</p>
                <ul className="text-white/80 text-xs space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Reach Thousands of Customers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    Easy Product Management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    Real-time Analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Secure Payment Processing
                  </li>
                </ul>
              </div>

              {/* Action button */}
              <button
                onClick={onClose}
                className="bg-white text-green-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Selling 🚀
              </button>

              {/* Footer note */}
              <p className="text-white/70 text-xs mt-4">
                This welcome appears only once. Happy selling!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerWelcomePopup;