"use client";

import { useAuth } from "@/context/AuthContext";
import { useReviews } from "@/lib/firestore/reviews/read";
import { deleteReview } from "@/lib/firestore/reviews/write";
import { useUser } from "@/lib/firestore/user/read";
import { Rating } from "@mui/material";
import { Button, Modal, ModalContent, ModalBody } from "@nextui-org/react";
import { Trash2, Calendar, Clock } from "lucide-react";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";

export default function Reviews({ productId }) {
  const { data, error } = useReviews({ productId: productId });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { data: userData } = useUser({ uid: user?.uid });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Sort reviews by lastUpdated date in descending order (newest first)
  const sortedReviews = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
      const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });
  }, [data]);

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

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openImagePreview = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 p-6 rounded-xl border border-purple-300 w-full bg-white shadow-sm">
      <h1 className="text-xl md:text-2xl font-heading text-gray-800 font-semibold border-b border-purple-100 pb-3">
        Customer Reviews
      </h1>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
          Error: {error.message}
        </div>
      )}

      {!sortedReviews || sortedReviews.length === 0 ? (
        <div className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
          <div className="mb-2">📝</div>
          <div className="font-medium">No reviews yet</div>
          <div className="text-sm mt-1">Be the first to review this product!</div>
        </div>
      ) : (
        <div className="flex flex-col py-2 border rounded-md border-purple-200 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300">
          {sortedReviews.map((item, index) => (
            <div
              key={item?.uid || index}
              className="flex items-start gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-purple-50 transition-colors"
            >
              {/* Profile Image */}
              <img
                src={item?.photoURL || "/flame1.png"}
                className="w-12 h-12 rounded-full border-2 border-purple-200 object-cover"
                alt={`${item?.displayName || "Anonymous"}'s profile`}
              />

              <div className="flex-1 flex flex-col">
                {/* User Info & Rating */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-gray-800 text-sm md:text-base">
                      {item?.displayName || "Anonymous"}
                    </h2>
                    <div className="flex items-center">
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
                      <span className="text-xs text-gray-500 ml-2">
                        {item?.rating}/5
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {item?.lastUpdated && (
                      <div className="flex flex-col items-end text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {formatDate(item.lastUpdated)}
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock size={12} className="mr-1" />
                          {formatTime(item.lastUpdated)}
                        </div>
                      </div>
                    )}
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
                </div>

                {/* Review Message */}
                <p className="text-gray-600 mt-3 text-sm md:text-base leading-relaxed">
                  {item?.message}
                </p>

                {/* Review Photo (if exists) - with fixed width and height */}
                {item?.reviewPhotoURL && (
                  <div className="mt-3">
                    <img
                      src={item.reviewPhotoURL}
                      alt="Review photo"
                      className="rounded-lg w-20 h-16 object-cover cursor-pointer border border-gray-200 hover:border-purple-300 transition-colors"
                      onClick={() => openImagePreview(item.reviewPhotoURL)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      <Modal 
        isOpen={isImageModalOpen} 
        onClose={() => setIsImageModalOpen(false)}
        size="3xl"
      >
        <ModalContent>
          <ModalBody className="p-0">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Review photo"
                className="w-[400px] h-[450px] object-contain"
                onClick={() => setIsImageModalOpen(false)}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}