"use client";

import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button
} from "@nextui-org/react";
import { X } from "lucide-react";

export default function SellerReviewModal({
  isOpen,
  onClose,
  selectedReview,
  editedMessage,
  setEditedMessage,
  replyText,
  setReplyText,
  isUpdateLoading,
  handleUpdate
}) {

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="lg"
      classNames={{
        base: "bg-white dark:bg-slate-800 border max-w-[90%] md:max-w-[600px] max-h-[85%] my-auto border-emerald-300 dark:border-emerald-600 shadow-lg rounded-2xl",
        header: "border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center text-lg font-semibold text-slate-900 dark:text-white",
        body: "p-6 max-h-[60vh] overflow-y-auto no-scrollbar",
        footer: "border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4"
      }}
    >
      <ModalContent>
        <ModalHeader>
          <span className="text-slate-900 dark:text-white">Reply to Review</span>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition duration-300"
          >
            <X size={20} />
          </button>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-5">
            {/* Review Image (Read-only) */}
            {selectedReview?.reviewPhotoURL && (
              <div className="flex justify-center">
                <div className="w-40 h-40 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
                  <img
                    src={selectedReview.reviewPhotoURL}
                    alt="Review"
                    className="w-full h-full object-cover bg-slate-100 dark:bg-slate-700"
                  />
                </div>
              </div>
            )}

            {/* Review Text (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Customer Review</label>
              <div className="w-full min-h-[70px] p-3 text-sm rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                {editedMessage || "No review message"}
              </div>
            </div>

            {/* Seller Reply Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Your Reply</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full min-h-[100px] p-3 text-sm rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 dark:placeholder-slate-400"
                placeholder="Write a reply to this review..."
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={onClose}
            className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleUpdate}
            isLoading={isUpdateLoading}
            className="px-4 py-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            Send Reply
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}