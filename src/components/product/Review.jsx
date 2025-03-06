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
    <div className="flex flex-col gap-4 p-6 rounded-xl border border-purple-300 w-full bg-white ">
      <h1 className="text-xl md:text-2xl font-heading text-gray-800 font-semibold">
        Reviews
      </h1>

      {error && (
        <div className="text-red-500 text-sm">Error: {error.message}</div>
      )}

      {!data || data.length === 0 ? (
        <div className="text-gray-500 text-center py-6">
          No reviews yet. Be the first to review this product!
        </div>
      ) : (
        <div className="flex flex-col py-2 border rounded-md border-dotted border-purple-500 max-h-[340px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300">
          {data?.map((item, index) => (
            <div
              key={item?.uid || index}
              className="flex items-start gap-3 p-3 border-b border-gray-100 last:border-b-0"
            >
              {/* Profile Image */}
              <Avatar
                src={item?.photoURL || "/flame1.png"}
                className="w-10 h-10 rounded-full"
                fallback={item?.displayName?.[0]}
              />

              <div className="flex-1 flex flex-col">
                {/* User Info & Rating */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-gray-800 text-sm md:text-base">
                      {item?.displayName || "Anonymous"}
                    </h2>
                    <Rating
                      value={item?.rating}
                      readOnly
                      size="small"
                      sx={{
                        color: "#EAB308",
                        "& .MuiRating-iconFilled": {
                          color: "#EAB308",
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
                      className="w-8 h-8 text-red-500"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>

                {/* Review Photo (if exists) */}
                {item?.reviewPhoto && (
                  <img
                    src={item.reviewPhoto}
                    alt="Review photo"
                    className="mt-2 rounded-lg max-h-32 w-full object-cover"
                  />
                )}

                {/* Review Message */}
                <p className="text-gray-600 mt-1 text-xs md:text-sm leading-relaxed">
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
