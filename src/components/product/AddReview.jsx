// AddReview.jsx
"use client";
import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { addReview } from "@/lib/firestore/reviews/write";
import { useUser } from "@/lib/firestore/user/read";
import { Rating } from "@mui/material";
import { Button } from "@nextui-org/react";
import { ImagePlus } from "lucide-react";
import toast from "react-hot-toast";

const AddReview = ({ productId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(4);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const { user } = useAuth();
  const { data: userData } = useUser({ uid: user?.uid });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }

      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Check if message is empty and show toast notification
    if (!message.trim()) {
      toast.error("Please write a review before submitting");
      return;
    }
    
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("Please Log In First");
      }
      await addReview({
        displayName: userData?.displayName,
        message,
        photoURL: userData?.photoURL,
        productId,
        rating,
        uid: user?.uid,
        reviewPhoto: photo
      });
      setMessage("");
      setPhoto(null);
      setPhotoPreview(null);
      setRating(4);
      toast.success("Successfully Submitted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 p-6 rounded-xl border border-purple-300 w-full">
      <h1 className="text-2xl font-heading text-gray-800 font-semibold">
        Rate This Product
      </h1>
      
      <div className="flex flex-col justify-center gap-2 items-center">
        <style jsx global>{`
          @keyframes pulse-star {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          .star-rating-container .MuiRating-icon:not(.MuiRating-iconActive) {
            animation: pulse-star 1.5s infinite;
            animation-delay: calc(var(--star-index) * 0.2s);
          }
          
          .star-rating-container:hover .MuiRating-icon {
            animation: none !important;
          }
        `}</style>
        
        <div className="star-rating-container">
          <Rating 
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            sx={{ 
              color: '#EAB308',
              '& .MuiRating-iconFilled': {
                color: '#EAB308',
              },
              '& .MuiRating-icon': {
                position: 'relative',
                '&:nth-of-type(1)': {
                  '--star-index': 0,
                },
                '&:nth-of-type(2)': {
                  '--star-index': 1,
                },
                '&:nth-of-type(3)': {
                  '--star-index': 2,
                },
                '&:nth-of-type(4)': {
                  '--star-index': 3,
                },
                '&:nth-of-type(5)': {
                  '--star-index': 4,
                },
              }
            }}
          />
        </div>
        <h1 className='text-xs text-gray-500'>Rate us</h1>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Share your thoughts about this product..."
        className="w-full min-h-[90px] text-gray-800 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
      />

      <div 
        className="relative border-2 border-dashed border-purple-200 rounded-lg hover:border-purple-500 transition-colors cursor-pointer"
        onClick={() => document.getElementById('photo-upload').click()}
      >
        <input
          type="file"
          id="photo-upload"
          className="hidden"
          accept="image/*"
          onChange={handlePhotoChange}
        />
        
        {photoPreview ? (
          <div className="relative w-full h-48">
            <img 
              src={photoPreview} 
              alt="Preview" 
              className="w-full h-full object-contain rounded-lg"
            />
            <Button
              size="sm"
              color="danger"
              className="absolute top-2 right-2 min-w-unit-8 w-8 h-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setPhoto(null);
                setPhotoPreview(null);
              }}
            >
              ×
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <ImagePlus className="w-6 h-6 text-purple-500" />
            <p className="text-sm text-gray-600">
              Click to upload a photo
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG up to 5MB
            </p>
          </div>
        )}
      </div>

      <Button
        color="primary"
        onClick={handleSubmit}
        isLoading={isLoading}
        isDisabled={isLoading}
        className="bg-purple-500 w-full rounded-md"
      >
        {isLoading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </div>
  );
};

export default AddReview;