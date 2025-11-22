"use client";

import { useSellerReviews, useAdminReviews } from "@/lib/firestore/reviews/read";
import { useReviewAnalytics } from "@/lib/firestore/reviews/analytics";
import { useDisclosure } from "@nextui-org/react";
import { useState, useMemo } from "react";
import { useAuth } from '@/context/AuthContext';
import { useSeller } from '@/lib/firestore/sellers/read';

// Import components
import ReviewAnalytics from "./ReviewAnalytics";
import ReviewFilters from "./ReviewFilter";
import ReviewTable from "./ReviewTable";
import SellerReviewModal from "./SellerReviewModal";

import { updateReview } from "@/lib/firestore/reviews/write";
import toast from "react-hot-toast";

export default function SellerReview() {
  const { user } = useAuth();
  const { data: seller, isLoading: sellerLoading } = useSeller({ email: user?.email });
  
  // Modal states
  const [selectedReview, setSelectedReview] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);

  // Get seller ID - will be null for admin users
  const sellerId = seller?.id || null;

  // Fetch analytics
  const { analytics, isLoading: analyticsLoading } = useReviewAnalytics(sellerId);

  // Fetch reviews based on user type
  const sellerReviewsResult = useSellerReviews({ 
    sellerId: sellerId, 
    pageLimit: 1000 
  });
  
  const adminReviewsResult = useAdminReviews({ 
    pageLimit: 1000 
  });

  // Choose which data to use based on seller status
  const { data: reviews, error, isLoading } = useMemo(() => {
    if (sellerLoading) {
      return { data: [], error: null, isLoading: true };
    }
    
    if (sellerId) {
      return sellerReviewsResult;
    }
    
    return adminReviewsResult;
  }, [sellerLoading, sellerId, sellerReviewsResult, adminReviewsResult]);

  // Calculate filtered reviews
  const filteredReviews = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    
    let filtered = [...reviews];
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(review => 
        review?.displayName?.toLowerCase().includes(query) ||
        review?.message?.toLowerCase().includes(query)
      );
    }
    
    // Rating filter
    if (selectedRating !== "all") {
      filtered = filtered.filter(review => 
        review?.rating === parseInt(selectedRating)
      );
    }
    
    // Sort by timestamp descending (newest first)
    filtered.sort((a, b) => {
      const dateA = a.timestamp?.seconds || 0;
      const dateB = b.timestamp?.seconds || 0;
      return dateB - dateA;
    });
    
    return filtered;
  }, [reviews, searchQuery, selectedRating]);

  // Calculate pagination values
  const totalItems = filteredReviews.length;
  const totalPages = Math.ceil(totalItems / pageLimit);

  // Handler functions
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditClick = (review) => {
    setSelectedReview(review);
    setReplyText(review.sellerReply || "");
    onOpen();
  };

  const handleUpdate = async () => {
    if (!replyText.trim()) {
      toast.error("Please write a reply");
      return;
    }

    setIsUpdateLoading(true);
    try {
      const updateData = {
        uid: selectedReview.uid,
        productId: selectedReview.productId,
        sellerReply: replyText
      };
      
      await updateReview(updateData);
      toast.success("Reply sent successfully");
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.message || "Failed to send reply");
    }
    setIsUpdateLoading(false);
  };

  const handleModalClose = () => {
    setSelectedReview(null);
    setReplyText("");
    onClose();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedRating("all");
    setCurrentPage(1);
  };

  const handlePageReset = () => {
    setCurrentPage(1);
  };

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-lg">
        <p className="font-semibold mb-2">Error loading reviews</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
              Customer Reviews
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm sm:text-base">
              Manage and respond to customer reviews
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-600">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {analytics.totalReviews} total reviews
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <ReviewAnalytics 
        analytics={analytics} 
        isLoading={analyticsLoading || sellerLoading} 
      />

      {/* Filters */}
      <ReviewFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        onClearFilters={handleClearFilters}
        onPageReset={handlePageReset}
      />

      {/* Table */}
      <ReviewTable
  reviews={filteredReviews}
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  itemsPerPage={pageLimit}
  onPageChange={handlePageChange}
  onEdit={handleEditClick}
  isLoading={sellerLoading || isLoading}
/>

      {/* Modal */}
      <SellerReviewModal
        isOpen={isOpen}
        onClose={handleModalClose}
        selectedReview={selectedReview}
        replyText={replyText}
        setReplyText={setReplyText}
        isUpdateLoading={isUpdateLoading}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}