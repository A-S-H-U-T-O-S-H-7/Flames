
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { addReview } from "@/lib/firestore/reviews/write";
import { useUser } from "@/lib/firestore/user/read";
import { Rating } from "@mui/material";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddReview({ productId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(4);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { data: userData } = useUser({ uid: user?.uid });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("Please Logged In First");
      }
      await addReview({
        displayName: userData?.displayName,
        message: message,
        photoURL: userData?.photoURL,
        productId: productId,
        rating: rating,
        uid: user?.uid,
      });
      setMessage("");
      toast.success("Successfully Submitted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-3 p-3 rounded-xl border w-full">
      <h1 className="text-lg font-semibold">Rate This Products</h1>
      <Rating
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
      />
      <textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        type="text"
        placeholder="Enter you thoughts on this products ..."
        className="w-full border border-lg px-4 py-2 focus:outline-none"
      />
      <Button
        onClick={handleSubmit}
        isLoading={isLoading}
        isDisabled={isLoading}
      >
        Submit
      </Button>
    </div>
  );
}


//reviews

"use client";

import { useAuth } from "@/context/AuthContext";
import { useReviews } from "@/lib/firestore/reviews/read";
import { deleteReview } from "@/lib/firestore/reviews/write";
import { useUser } from "@/lib/firestore/user/read";
import { Rating } from "@mui/material";
import { Avatar, Button } from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Reviews({ productId }) {
  const { data } = useReviews({ productId: productId });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { data: userData } = useUser({ uid: user?.uid });

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("Please Logged In First");
      }
      await deleteReview({
        uid: user?.uid,
        productId: productId,
      });
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-3 p-3 rounded-xl border w-full">
      <h1 className="text-lg font-semibold">Reviews</h1>
      <div className="flex flex-col gap-4">
        {data?.map((item) => {
          return (
            <div className="flex gap-3">
              <div className="">
                <Avatar src={item?.photoURL} />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between">
                  <div>
                    <h1 className="font-semibold">{item?.displayName}</h1>
                    <Rating value={item?.rating} readOnly size="small" />
                  </div>
                  {user?.uid === item?.uid && (
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="flat"
                      isDisabled={isLoading}
                      isLoading={isLoading}
                      onClick={handleDelete}
                    >
                      <Trash2 size={12} />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-700 pt-1">{item?.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const CategoryCard = ({ categories }) => { 
  return (
        <div >
          {categories.map((category) => (
           <Link key={category.id} href={`/category/${category?.id}`}>
        
              <motion.div
              key={category.id} 
                className="flex flex-col items-center justify-center 
                            w-[90px] h-[110px] 
                            sm:w-[120px] sm:h-[120px] 
                            rounded-xl bg-purple-100 
                            hover:bg-purple-200 
                            transition-colors duration-300 
                            cursor-pointer 
                            shadow-md hover:shadow-lg 
                            flex-shrink-0 
                            p-2 space-y-2"
                whileTap={{ scale: 0.95 }}
              >
                
                <p className="text-xs sm:text-sm text-gray-500 font-medium text-center">
                  {category.name}
                </p>
              </motion.div>
              </Link>
          ))}
        </div>
     
  );
};

