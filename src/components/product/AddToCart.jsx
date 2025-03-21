"use client";

import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter } from "next/navigation";

export default function AddToCart({ productId }) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isAdded = data?.carts?.find((item) => item?.id === productId);

  const handleClick = async () => {
    setIsLoading(true);
    
    try {
      if (!user?.uid) {
        router.push("/login");
        throw new Error("Please Logged In First!");
      }
      
      if (isAdded) {
        // Remove item from cart
        const newList = data?.carts?.filter((item) => item?.id != productId);
        await updateCarts({ list: newList, uid: user?.uid });
      } else {
        // Add item to cart
        await updateCarts({
          list: [...(data?.carts ?? []), { id: productId, quantity: 1 }],
          uid: user?.uid,
        });
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      isDisabled={isLoading}
      onClick={handleClick}
      className={`
        flex flex-1 items-center justify-center
        ${isAdded 
          ? "border border-purple-500 " 
          : "border border-purple-500 "
        }
        text-purple-600 rounded-md py-[23px] px-4
        transition-all duration-300
        disabled:bg-gray-300
      `}
      size="sm"
    >
      {isAdded ? (
        <>
          <ShoppingCartIcon className="text-purple-600 text-xs mr-1" />
          Click To Remove
        </>
      ) : (
        <>
          <AddShoppingCartIcon className="text-purple-600 text-xs mr-1" />
          Add to Cart
        </>
      )}
    </Button>
  );
}