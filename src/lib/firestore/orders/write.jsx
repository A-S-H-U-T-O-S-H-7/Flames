import { db } from "../firebase";
import { doc, Timestamp, updateDoc, serverTimestamp } from "firebase/firestore";

export const updateOrderStatus = async ({ id, status, cancellationReason }) => {
  if (!id || !status) {
    throw new Error("Order ID and status are required");
  }
  
  // Create the base update object
  const updateData = {
    status: status,
    timestampStatusUpdate: serverTimestamp(),
    statusHistory: {
      [status]: serverTimestamp()
    }
  };
  
  // Add cancellationReason to the update if provided and status is cancelled
  if (cancellationReason && status === "cancelled") {
    updateData.cancellationReason = cancellationReason;
  }
  
  await updateDoc(doc(db, `orders/${id}`), updateData);
};