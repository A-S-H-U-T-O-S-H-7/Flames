"use client";

import { useAllReview } from "@/lib/firestore/reviews/read";
import { CircularProgress, Button, useDisclosure } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import ReviewRow from "./ReviewRow";
import ReviewModal from "./ReviewModal";
import { updateReview } from "@/lib/firestore/reviews/write";
import toast from "react-hot-toast";

export default function ListView() {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editedMessage, setEditedMessage] = useState("");
  const [isShowcased, setIsShowcased] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [newReviewPhoto, setNewReviewPhoto] = useState(null);

  useEffect(() => {
    setLastSnapDocList([]);
  }, [pageLimit]);

  const { data: reviews, error, isLoading, lastSnapDoc } = useAllReview({
    pageLimit,
    lastSnapDoc: lastSnapDocList?.length === 0 ? null : lastSnapDocList[lastSnapDocList?.length - 1],
  });

  const handleNextPage = () => {
    setLastSnapDocList([...lastSnapDocList, lastSnapDoc]);
  };

  const handlePrePage = () => {
    setLastSnapDocList(lastSnapDocList.slice(0, -1));
  };

  const handleEditClick = (review) => {
    setSelectedReview(review);
    setEditedMessage(review.message);
    setIsShowcased(review.isShowcased || false);
    setNewReviewPhoto(null);
    onOpen();
  };

  const handleUpdate = async () => {
    setIsUpdateLoading(true);
    try {
      // Create update object with mandatory fields
      const updateData = {
        uid: selectedReview.uid,
        productId: selectedReview.productId,
        message: editedMessage,
        isShowcased
      };

      // Only include reviewPhotoURL if newReviewPhoto exists
      // This prevents sending undefined for reviewPhotoURL
      if (newReviewPhoto) {
        updateData.reviewPhotoURL = newReviewPhoto;
      }
      
      await updateReview(updateData);
      toast.success("Review updated successfully");
      onClose();
    } catch (error) {
      toast.error(error?.message || "Failed to update review");
    }
    setIsUpdateLoading(false);
  };

  const handleModalClose = () => {
    setSelectedReview(null);
    setEditedMessage("");
    setIsShowcased(false);
    setNewReviewPhoto(null);
    onClose();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 bg-[#0e1726] rounded-xl p-4 border border-[#22c7d5] shadow-sm transition-all duration-200">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1e2737]">
                <th className="font-semibold px-4 py-3 text-center text-gray-300 rounded-l-lg">
                  #
                </th>
                <th className="font-semibold px-4 py-3 text-center text-gray-300">
                  User
                </th>
                <th className="font-semibold px-4 py-3 text-center text-gray-300">
                  Review Image
                </th>
                <th className="font-semibold px-4 py-3 text-left text-gray-300">
                  Product
                </th>
                <th className="font-semibold px-4 py-3 text-center text-gray-300">
                  Rating
                </th>
                <th className="font-semibold px-4 py-3 text-left text-gray-300">
                  Review
                </th>
                <th className="font-semibold px-4 py-3 text-center text-gray-300">
                  Showcased
                </th>
                <th className="font-semibold px-4 py-3 text-center text-gray-300 rounded-r-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {reviews?.map((item, index) => (
                <ReviewRow
                  key={item?.id || index}
                  item={item}
                  index={index + lastSnapDocList?.length * pageLimit}
                  onEdit={handleEditClick}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pt-4 border-t border-gray-700">
        <Button
          isDisabled={isLoading || lastSnapDocList?.length === 0}
          onClick={handlePrePage}
          size="sm"
          variant="bordered"
          className="w-full sm:w-auto flex items-center gap-1 border rounded-lg border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <ChevronLeft size={16} /> Previous
        </Button>

        <select
          value={pageLimit}
          onChange={(e) => setPageLimit(Number(e.target.value))}
          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-700 bg-[#1e2737] text-gray-300 focus:outline-none focus:border-[#22c7d5] shadow-sm hover:shadow-md transition-shadow"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>

        <Button
          isDisabled={isLoading || reviews?.length === 0}
          onClick={handleNextPage}
          size="sm"
          variant="bordered"
          className="w-full sm:w-auto flex items-center gap-1 border rounded-lg border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          Next <ChevronRight size={16} />
        </Button>
      </div>

      <ReviewModal
        isOpen={isOpen}
        onClose={handleModalClose}
        selectedReview={selectedReview}
        editedMessage={editedMessage}
        setEditedMessage={setEditedMessage}
        isShowcased={isShowcased}
        setIsShowcased={setIsShowcased}
        isUpdateLoading={isUpdateLoading}
        handleUpdate={handleUpdate}
        newReviewPhoto={newReviewPhoto}
        setNewReviewPhoto={setNewReviewPhoto}
      />
    </div>
  );
}