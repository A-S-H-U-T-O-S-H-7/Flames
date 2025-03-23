"use client";

import { useAllReview } from "@/lib/firestore/reviews/read";
import { CircularProgress, Button, useDisclosure } from "@nextui-org/react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import ReviewRow from "./ReviewRow";
import ReviewModal from "./ReviewModal";
import { updateReview } from "@/lib/firestore/reviews/write";
import toast from "react-hot-toast";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ListView() {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editedMessage, setEditedMessage] = useState("");
  const [isShowcased, setIsShowcased] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [newReviewPhoto, setNewReviewPhoto] = useState(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedShowcased, setSelectedShowcased] = useState("all");
  const [filteredReviews, setFilteredReviews] = useState([]);

  useEffect(() => {
    setLastSnapDocList([]);
  }, [pageLimit, searchQuery, selectedRating, selectedShowcased]);

  const { data: reviews, error, isLoading, lastSnapDoc } = useAllReview({
    pageLimit,
    lastSnapDoc: lastSnapDocList?.length === 0 ? null : lastSnapDocList[lastSnapDocList?.length - 1],
  });

  // Apply filters whenever reviews or search/filter criteria change
  useEffect(() => {
    if (!reviews) return;
    
    let filtered = [...reviews];
    
    // Apply search filter for username or product name
    if (searchQuery) {
      filtered = filtered.filter(review => 
        (review?.displayName?.toLowerCase().includes(searchQuery.toLowerCase())) || 
        // Assuming product.title is accessible in the review object, otherwise
        // you may need to modify this based on how product info is stored
        (review?.productName?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply rating filter
    if (selectedRating !== "all") {
      filtered = filtered.filter(review => 
        review?.rating === parseInt(selectedRating)
      );
    }
    
    // Apply showcased filter
    if (selectedShowcased !== "all") {
      const isShowcasedBool = selectedShowcased === "yes";
      filtered = filtered.filter(review => 
        review?.isShowcased === isShowcasedBool
      );
    }
    
    setFilteredReviews(filtered);
  }, [reviews, searchQuery, selectedRating, selectedShowcased]);

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
      const updateData = {
        uid: selectedReview.uid,
        productId: selectedReview.productId,
        message: editedMessage,
        isShowcased
      };
  
      if (newReviewPhoto) {
        const storage = getStorage();
        const imageRef = ref(storage, `reviews/${selectedReview.productId}/${selectedReview.uid}/${newReviewPhoto.name}`);
        await uploadBytes(imageRef, newReviewPhoto);
        const downloadURL = await getDownloadURL(imageRef);
        updateData.reviewPhotoURL = downloadURL;
      } else {
        if (selectedReview.reviewPhotoURL) {
          updateData.reviewPhotoURL = selectedReview.reviewPhotoURL;
        }
      }
      
      await updateReview(updateData);
      toast.success("Review updated successfully");
      onClose();
    } catch (error) {
      console.error("Update error:", error);
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

  if (isLoading && lastSnapDocList.length === 0) {
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

  const displayReviews = searchQuery || selectedRating !== "all" || selectedShowcased !== "all" 
    ? filteredReviews 
    : reviews;

  return (
    <div className="flex-1 flex flex-col gap-4 bg-[#0e1726] rounded-xl p-4 border border-[#22c7d5] shadow-sm transition-all duration-200">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
        <h1 className="text-2xl font-semibold text-white">
          Reviews
          <span className="ml-2 px-2 py-1 rounded-md text-xs border font-normal text-gray-400">
            {displayReviews?.length ?? 0} items
          </span>
        </h1>
        
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user or product..."
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-700 bg-[#1e2737] text-gray-300 focus:outline-none focus:border-[#22c7d5] shadow-sm hover:shadow-md transition-shadow"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
          </div>
          
          {/* Rating filter */}
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="w-full sm:w-48 px-4 py-2 rounded-lg border border-gray-700 bg-[#1e2737] text-gray-300 focus:outline-none focus:border-[#22c7d5] shadow-sm hover:shadow-md transition-shadow"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          
          {/* Showcased filter */}
          <select
            value={selectedShowcased}
            onChange={(e) => setSelectedShowcased(e.target.value)}
            className="w-full sm:w-48 px-4 py-2 rounded-lg border border-gray-700 bg-[#1e2737] text-gray-300 focus:outline-none focus:border-[#22c7d5] shadow-sm hover:shadow-md transition-shadow"
          >
            <option value="all">All Reviews</option>
            <option value="yes">Showcased: Yes</option>
            <option value="no">Showcased: No</option>
          </select>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1e2737]">
                <th className="font-semibold px-4 py-3 text-center text-gray-300 rounded-l-lg">
                  #
                </th>
                <th className="font-semibold px-4 py-3 text-center text-gray-300 rounded-l-lg">
                  Date&Time
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
              {displayReviews?.length > 0 ? (
                displayReviews.map((item, index) => (
                  <ReviewRow
                    key={item?.id || index}
                    item={item}
                    index={index + lastSnapDocList?.length * pageLimit}
                    onEdit={handleEditClick}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                    {searchQuery || selectedRating !== "all" || selectedShowcased !== "all" ? 
                      "No reviews match your search criteria" : 
                      "No reviews found"}
                  </td>
                </tr>
              )}
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
          isDisabled={isLoading || displayReviews?.length < pageLimit}
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