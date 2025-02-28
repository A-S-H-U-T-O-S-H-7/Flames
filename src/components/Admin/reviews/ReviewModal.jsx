"use client";

import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Checkbox
} from "@nextui-org/react";
import { Upload, X, Trash2 } from "lucide-react";
import { useRef } from "react";

export default function ReviewModal({
  isOpen,
  onClose,
  selectedReview,
  editedMessage,
  setEditedMessage,
  isShowcased,
  setIsShowcased,
  isUpdateLoading,
  handleUpdate,
  newReviewPhoto,
  setNewReviewPhoto
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewReviewPhoto(file);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="lg"
      classNames={{
        base: "bg-[#0e1726] border max-w-[90%] md:max-w-[600px] max-h-[85%] my-auto border-[#22c7d5] shadow-lg rounded-lg",
        header: "border-b border-gray-700 px-6 py-4 flex justify-between items-center text-lg font-semibold text-white",
        body: "p-6 max-h-[60vh] overflow-y-auto no-scrollbar", // Makes content scrollable if it overflows
        footer: "border-t border-gray-700 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4"
      }}
    >
      <ModalContent>
        <ModalHeader>
          <span>Edit Review</span>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 transition duration-300"
          >
            <X size={20} />
          </button>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-5">
            {/* Image Preview/Upload Section */}
            <div className="flex flex-col items-center gap-4">
              {(selectedReview?.reviewPhotoURL || newReviewPhoto) ? (
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-lg overflow-hidden border border-gray-700">
                  <img
                    src={newReviewPhoto ? URL.createObjectURL(newReviewPhoto) : selectedReview?.reviewPhotoURL}
                    alt="Review"
                    className="w-full h-full object-cover bg-black"
                  />
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 p-1 rounded-full"
                    onClick={() => setNewReviewPhoto(null)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-36 h-32 sm:w-40 sm:h-36 flex flex-col items-center justify-center bg-[#1e2737] border border-gray-700 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Upload size={24} className="text-gray-400" />
                  <p className="text-gray-400 mt-2 text-sm">Upload Image</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Review Text Input */}
            <textarea
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              className="w-full min-h-[70px] p-3 text-sm rounded-lg bg-[#1e2737] border border-gray-700 text-gray-300 focus:outline-none focus:border-[#22c7d5] placeholder-gray-400"
              placeholder="Write your review..."
            />
            
            {/* Checkbox for Showcased Review */}
            <div className="flex items-center gap-3">
              <Checkbox
                isSelected={isShowcased}
                onValueChange={setIsShowcased}
                color="primary"
                className="text-gray-300"
              >
                <span className="text-sm text-gray-300">Show in Showcase</span>
              </Checkbox>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleUpdate}
            isLoading={isUpdateLoading}
            className="bg-gradient-to-r from-[#22c7d5] to-[#0e9aa7] hover:from-[#1baab2] hover:to-[#0b8c93] text-white px-4 py-2 rounded-md"
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}