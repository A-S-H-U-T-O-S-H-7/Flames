"use client";

import { useUser } from "@/lib/firestore/user/read";
import { updateFavorites } from "@/lib/firestore/user/write";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function FavoriteButton({ productId }) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const [isLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    event.stopPropagation();
    try {
      if (!user?.uid) {
        router.push("/login");
        throw new Error("Please Log In First!");
      }
      if (data?.favorites?.includes(productId)) {
        const newList = data?.favorites?.filter((item) => item != productId);
        await updateFavorites({ list: newList, uid: user?.uid });
      } else {
        await updateFavorites({
          list: [...(data?.favorites ?? []), productId],
          uid: user?.uid,
        });
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const isLiked = data?.favorites?.includes(productId);

  return (
    <Button
    isLoading={isLoading}
    isDisabled={isLoading}
    onClick={handleClick}
    className="p-2"
  >
    {!isLiked ? (
      <IoIosHeartEmpty size={25} className="text-purple-500" />
    ) : (
      <IoMdHeart size={25} className="text-purple-500" />
    )}
  </Button>
  );
}
