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
  const { data, error } = useReviews({ productId: productId });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { data: userData } = useUser({ uid: user?.uid });

  // Debug logs
  console.log("Reviews Data:", data);
  console.log("Product ID:", productId);
  console.log("Error:", error);

  const handleDelete = async (reviewUid) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("Please Log In First");
      }
      await deleteReview({
        uid: reviewUid,
        productId: productId,
      });
      toast.success("Review Successfully Deleted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 p-6 rounded-xl border border-purple-300 w-full">
      <h1 className="text-2xl font-heading text-gray-800 font-semibold">
        Reviews
      </h1>

      {error && (
        <div className="text-red-500 text-sm">
          Error loading reviews: {error.message}
        </div>
      )}

      {!data || data.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No reviews yet. Be the first to review this product!
        </div>
      ) : (
        <div className="flex flex-col py-2 border rounded-md border-dotted border-purple-500 gap-6">
          {data?.map((item, index) => (
            <div key={item?.uid || index} className="flex gap-4 border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
              <div>
                <Avatar 
                  src={item?.photoURL} 
                  className="w-10 h-10"
                  fallback={item?.displayName?.[0]}
                />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <h2 className="font-semibold text-gray-800">
                      {item?.displayName || 'Anonymous'}
                    </h2>
                    <Rating 
                      value={item?.rating} 
                      readOnly 
                      size="small"
                      sx={{ 
                        color: '#EAB308',
                        '& .MuiRating-iconFilled': {
                          color: '#EAB308',
                        },
                      }}
                    />
                  </div>
                  {user?.uid === item?.uid && (
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="flat"
                      isDisabled={isLoading}
                      isLoading={isLoading}
                      onPress={() => handleDelete(item?.uid)}
                      className="min-w-unit-8 text-red-500 w-8 h-8"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
                {item?.reviewPhoto && (
                  <img 
                    src={item.reviewPhoto} 
                    alt="Review photo" 
                    className="mt-2 rounded-lg max-h-48 object-cover"
                  />
                )}
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                  {item?.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}