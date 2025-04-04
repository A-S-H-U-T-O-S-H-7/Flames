"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/lib/firestore/user/read';
import { addSuggestion } from '@/lib/firestore/suggestions/write';
import toast from "react-hot-toast";

const SuggestionBox = () => {
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const { data: userData } = useUser({ uid: user?.uid });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if suggestion is empty and show toast notification
    if (!suggestion.trim()) {
      toast.error("Please write your thoughts before submitting");
      return;
    }
    
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("Please Log In First");
      }
      
      await addSuggestion({
        displayName: userData?.displayName,
        message: suggestion,
        uid: user?.uid,
        email: userData?.email,
        type: "suggestion"
      });
      
      setSuggestion("");
      toast.success("Your thoughts have been successfully submitted!");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="font-heading text-lg sm:text-xl font-medium text-purple-800 mb-5 text-center relative after:content-[''] after:absolute after:w-12 after:h-0.5 after:bg-purple-400 after:bottom-0 after:left-1/2 after:-translate-x-1/2 pb-2">
        Suggestions
      </h3>
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <div className="relative rounded-lg overflow-hidden shadow-purple-100 shadow-md">
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 text-gray-600 bg-white border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-400 hover:border-purple-300 transition-colors resize-none h-28"
            disabled={isLoading}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            className="absolute bottom-3 right-3 p-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <FaPaperPlane className="text-lg" />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default SuggestionBox;