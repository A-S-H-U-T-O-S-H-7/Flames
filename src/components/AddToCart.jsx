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

export default function AddToCart({ productId, type }) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isAdded = data?.carts?.find((item) => item?.id === productId);

  const handlClick = async () => {
    
    try {
      if (!user?.uid) {
        router.push("/login");
        throw new Error("Please Logged In First!");
      }
      if (isAdded) {
        const newList = data?.carts?.filter((item) => item?.id != productId);
        await updateCarts({ list: newList, uid: user?.uid });
      } else {
        await updateCarts({
          list: [...(data?.carts ?? []), { id: productId, quantity: 1 }],
          uid: user?.uid,
        });
      }
    } catch (error) {
      toast.error(error?.message);
    }
    
  };

  if (type === "cute") {
    return (
      <Button
        
        isDisabled={isLoading}
        onClick={handlClick}
        variant="bordered"
        className="text-purple-500 border border-purple-500 rounded-md py-2 px-8 font-semibold hover:shadow-md"
      >
        {!isAdded ? "Add To Cart" : "Click To Remove"}
      </Button>
    );
  }
  
  if (type === "large") {
    return (
      <Button
       
        isDisabled={isLoading}
        onClick={handlClick}
        variant="bordered"
        className=" text-purple-500 border border-purple-500 rounded-md  disabled:bg-blue-300"
        size="sm"
      >
        {!isAdded ? <AddShoppingCartIcon className="text-white text-xs" /> : <ShoppingCartIcon className="text-white text-xs" />}
        {!isAdded ? " Add To Cart" : " Click To Remove"}
      </Button>
    );
  }
  
  // Default Button (for non-categorized cases)
  return (
    <Button
      
      isDisabled={isLoading}
      onClick={handlClick}
      className="bg-blue-500 text-white rounded-lg p-2 transition-all duration-300 hover:bg-blue-600 disabled:bg-blue-300"
      size="sm"
    >
      {!isAdded ? <AddShoppingCartIcon className="text-white text-xs" /> : <ShoppingCartIcon className="text-white text-xs" />}
    </Button>
  );
  
}