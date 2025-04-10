import React, { useState, useEffect } from 'react';

const ModernLoadingSpinner = () => {
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate loading dots
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '');
    }, 500);

    // Simulate progress (0-100 over ~100 seconds)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        // Move faster at beginning, slower towards end
        const increment = Math.max(1, Math.floor((100 - prev) / 20));
        return Math.min(99, prev + increment);
      });
    }, 1000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900">
      <div className="w-full max-w-md px-8 py-12 rounded-lg bg-gray-800 shadow-2xl text-center">
        {/* Pulse circle animation */}
        <div className="relative mx-auto h-24 w-24 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-400 opacity-20 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-4 border-cyan-400 opacity-50"></div>
          <div className="absolute inset-4 rounded-full bg-gray-900 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"></div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <div 
            className="bg-cyan-400 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Loading message */}
        <h2 className="text-xl font-bold text-white mb-2">Loading Dashboard</h2>
        <p className="text-gray-300 mb-2">This page will take max 2 mins to load{dots}</p>
        <p className="text-gray-400 text-sm">Please have patience while we prepare your data</p>
      </div>
    </div>
  );
};

export default ModernLoadingSpinner;