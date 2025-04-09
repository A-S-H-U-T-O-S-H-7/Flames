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

export default function AddToCartButton({ productId, type }) {
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
        throw new Error("Please Login First!");
      }
      
      if (isAdded) {
        const newList = data?.carts?.filter((item) => item?.id !== productId);
        await updateCarts({ list: newList, uid: user?.uid });
        toast.success("Item removed from cart successfully!");
      } else {
        await updateCarts({
          list: [...(data?.carts ?? []), { id: productId, quantity: 1 }],
          uid: user?.uid,
        });
        toast.success("Item added to cart successfully!");
      }
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  if (type === "large") {
    return (
      <Button
        isDisabled={isLoading}
        onClick={handleClick}
        variant="bordered"
        color="primary"
        size="sm"
      >
        {!isAdded ? (
          <>
            <AddShoppingCartIcon className="text-xs" />
            Add To Cart
          </>
        ) : (
          <>
            <ShoppingCartIcon className="text-xs" />
            Click To Remove
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      isDisabled={isLoading}
      onClick={handleClick}
      variant="flat"
      isIconOnly
      size="sm"
    >
      {!isAdded ? (
        <AddShoppingCartIcon className="text-xs text-purple-700" />
      ) : (
        <ShoppingCartIcon className="text-xs text-purple-700" />
      )}
    </Button>
  );
}