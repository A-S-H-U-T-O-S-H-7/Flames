import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getOrderById = async (orderId) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("id", "==", orderId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("Order not found");
    }
    
    // Get the first matching document
    const orderDoc = querySnapshot.docs[0];
    const orderData = orderDoc.data();
    
    // Convert Firestore timestamp to JavaScript Date if needed
    if (orderData.orderDate) {
      orderData.orderDate = orderData.orderDate.toDate();
    }
    
    return {
      id: orderDoc.id,
      ...orderData
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};