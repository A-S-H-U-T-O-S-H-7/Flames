  "use client";

  import { useProduct } from "@/lib/firestore/products/read";
  import { deleteReview } from "@/lib/firestore/reviews/write";
  import { Rating } from "@mui/material";
  import { Avatar, Button } from "@nextui-org/react";
  import { Trash2, Pencil, ExternalLink } from "lucide-react";
  import Link from "next/link";
  import { useState } from "react";
  import toast from "react-hot-toast";

  export default function ReviewRow({ item, index, onEdit }) {
    const [isLoading, setIsLoading] = useState(false);
    const { data: product } = useProduct({ productId: item?.productId });

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

    // Format date and time from Firestore timestamp
    const formatDateTime = (timestamp) => {
      if (!timestamp || !timestamp.seconds) {
        return "N/A";
      }
      
      // Convert Firestore timestamp to JavaScript Date
      const date = new Date(timestamp.seconds * 1000);
      
      // Format date in DD/MM/YY format
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString().slice(-2);
      
      // Format time in h:MMam/pm format
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12
      
      return `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
    };
    console.log("Timestamp structure:", item?.timestampCreate);

    return (
      <tr className="hover:bg-[#1e2737] transition-colors">
        <td className="px-4 py-3 text-center text-gray-300">
          {index + 1}
        </td>
        <td className="px-4 py-3 text-center text-gray-300">
        {formatDateTime(item?.timestamp)}
        </td>

        <td className="px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            <Avatar src={item?.photoURL} className="h-10 w-10" />
            <span className="text-gray-300">{item?.displayName}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          {item?.reviewPhotoURL ? (
            <div className="w-16 h-16 mx-auto relative rounded-lg overflow-hidden">
              <img
                src={item.reviewPhotoURL}
                alt="Review"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="text-center text-gray-500">-</div>
          )}
        </td>
        <td className="px-4 py-3">
          <Link 
            href={`/product-details/${item?.productId}`}
            className="flex items-center text-sm gap-2 text-blue-400 hover:text-blue-300"
          >
            {product?.title}
            <ExternalLink size={14} />
          </Link>
        </td>
        <td className="px-4 py-3 text-center">
          <div className="flex justify-center">
            <Rating value={item?.rating} readOnly size="small" />
          </div>
        </td>
        <td className="px-4 py-3 text-gray-300">
          <p className="line-clamp-2">{item?.message}</p>
        </td>
        <td className="px-4 py-3 text-center">
          <div className="flex justify-center">
            <div className={`w-3 h-3 rounded-full ${item?.isShowcased ? 'bg-green-500' : 'bg-gray-500'}`} />
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