"use client";

import { useProduct } from "@/lib/firestore/products/read";
import { useAllReview } from "@/lib/firestore/reviews/read";
import { deleteReview, updateReview } from "@/lib/firestore/reviews/write";
import { Rating } from "@mui/material";
import { 
  Avatar, 
  Button, 
  CircularProgress,
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Checkbox,
  useDisclosure
} from "@nextui-org/react";
import { Trash2, Pencil, ChevronLeft, ChevronRight, ExternalLink, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
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
  const fileInputRef = useRef(null);

  useEffect(() => {
    setLastSnapDocList([]);
  }, [pageLimit]);

  const { data: reviews, error, isLoading, lastSnapDoc } = useAllReview({
    pageLimit,
    lastSnapDoc: lastSnapDocList?.length === 0 ? null : lastSnapDocList[lastSnapDocList?.length - 1],
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewReviewPhoto(file);
    }
  };

  const handleUpdate = async () => {
    setIsUpdateLoading(true);
    try {
      await updateReview({
        uid: selectedReview.uid,
        productId: selectedReview.productId,
        message: editedMessage,
        isShowcased,
        reviewPhoto: newReviewPhoto
      });
      toast.success("Review updated successfully");
      onClose();
      setNewReviewPhoto(null);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsUpdateLoading(false);
  };

  // Rest of the state management code remains the same...

  return (
    <div className="flex-1 flex flex-col gap-4 bg-[#0e1726] rounded-xl p-4 border border-[#22c7d5] shadow-sm transition-all duration-200">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <table className="w-full">
            <thead>
              <tr className="bg-[#22c7d5]">
                <th className="font-semibold px-4 py-3 text-center text-white rounded-l-lg">
                  #
                </th>
                <th className="font-semibold px-4 py-3 text-center text-white">
                  User
                </th>
                <th className="font-semibold px-4 py-3 text-center text-white">
                  Review Image
                </th>
                <th className="font-semibold px-4 py-3 text-left text-white">
                  Product
                </th>
                <th className="font-semibold px-4 py-3 text-center text-white">
                  Rating (count)
                </th>
                <th className="font-semibold px-4 py-3 text-left text-white">
                  Review
                </th>
                <th className="font-semibold px-4 py-3 text-center text-white">
                  Showcased
                </th>
                <th className="font-semibold px-4 py-3 text-center text-white rounded-r-lg">
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

      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="lg"
        classNames={{
          base: "bg-[#0e1726] border border-[#22c7d5]",
          header: "border-b border-gray-700",
          body: "py-6",
          footer: "border-t border-gray-700"
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Edit Review
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {/* Image Preview/Upload Section */}
              <div className="flex flex-col items-center gap-3">
                {(selectedReview?.reviewPhotoURL || newReviewPhoto) ? (
                  <div className="relative w-64 h-64 rounded-lg overflow-hidden">
                    <img
                      src={newReviewPhoto ? URL.createObjectURL(newReviewPhoto) : selectedReview?.reviewPhotoURL}
                      alt="Review"
                      className="w-full h-full object-contain bg-black"
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      className="absolute top-2 right-2"
                      onClick={() => setNewReviewPhoto(null)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-64 h-64 flex flex-col items-center justify-center bg-black rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <Upload size={32} className="text-gray-400" />
                    <p className="text-gray-400 mt-2">Click to upload image</p>
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

              <textarea
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                className="w-full min-h-[120px] p-3 rounded-lg bg-[#1e2737] border border-gray-700 text-gray-300 focus:outline-none focus:border-[#22c7d5]"
              />
              
              <div className="flex items-center gap-2">
                <Checkbox
                  isSelected={isShowcased}
                  onValueChange={setIsShowcased}
                  color="primary"
                >
                  Show in Showcase
                </Checkbox>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleUpdate}
              isLoading={isUpdateLoading}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

function ReviewRow({ item, index, onEdit }) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: product } = useProduct({ productId: item?.productId });
  const ratingCount = reviews?.filter(r => r.rating === item.rating).length || 0;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setIsLoading(true);
    try {
      await deleteReview({
        uid: item?.uid,
        productId: item?.productId,
      });
      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <tr className="hover:bg-[#1e2737] transition-colors">
      {/* Existing columns remain the same */}
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <Rating value={item?.rating} readOnly size="small" />
          <span className="text-gray-400">({ratingCount})</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <Button
            isIconOnly
            size="sm"
            className="bg-[#22c7d5] text-white"
            onClick={() => onEdit(item)}
          >
            <Pencil size={16} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            className="bg-red-500 text-white"
            isDisabled={isLoading}
            isLoading={isLoading}
            onClick={handleDelete}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </td>
    </tr>
  );
}