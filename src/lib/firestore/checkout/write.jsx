import { db } from "../firebase";
import { collection, doc, setDoc, getDoc, Timestamp, updateDoc, increment } from "firebase/firestore";

export const createCheckoutCODAndGetId = async ({ uid, products, address }) => {
  // Create a unique document reference inside the user's checkout collection
  const checkoutRef = doc(collection(db, "users", uid, "checkout_sessions_cod"));
  const checkoutId = `cod_${checkoutRef.id}`;
  
  // Format line items consistently
  const line_items = products.map((item) => ({
    price: item?.product?.salePrice || 0,
    product_data: {
      name: item?.product?.title || "",
      description: item?.product?.shortDescription || "",
      images: [
        item?.product?.featureImageURL || `${process.env.NEXT_PUBLIC_DOMAIN}/flame1.png`,
      ],
      metadata: {
        productId: item?.id || "",
      },
    },
    quantity: item?.quantity || 1,
  }));
  
  // Calculate total amount
  const total = products.reduce(
    (sum, item) => sum + (item?.product?.salePrice || 0) * (item?.quantity || 1), 
    0
  );

  const orderData = {
    id: checkoutId,
    uid,
    line_items,
    address,
    total,
    paymentMode: "cod",
    paymentStatus: "pending",
    createdAt: Timestamp.now(),
    status: "pending",
  };

  try {
    // Store in user's orders
    await setDoc(checkoutRef, orderData);

    // Store in global 'orders' collection for admin access
    await setDoc(doc(db, "orders", checkoutId), orderData);

    // Update order counts and stock for each product
    for (const item of products) {
      const productId = item?.id;
      const quantity = item?.quantity || 1;
      
      if (productId) {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, {
          orders: increment(quantity),
          stock: increment(-quantity) 
        });
      }
    }

    return checkoutId;
  } catch (error) {
    console.error("Error creating COD order:", error);
    throw error;
  }
};

export const createCheckoutOnlineAndGetId = async ({ uid, products, address, transactionId }) => {
  try {
    // Create a unique ID for the order
    const checkoutRef = doc(collection(db, "users", uid, "checkout_sessions_online"));
    const checkoutId = `prepaid_${checkoutRef.id}`;
    
    // Format line items consistently - using the same format as COD for consistency
    const line_items = products.map((item) => ({
      price: item?.product?.salePrice || 0,
      product_data: {
        name: item?.product?.title || "",
        description: item?.product?.shortDescription || "",
        images: [
          item?.product?.featureImageURL || `${process.env.NEXT_PUBLIC_DOMAIN}/flame1.png`,
        ],
        metadata: {
          productId: item?.id || "",
        },
      },
      quantity: item?.quantity || 1,
    }));
    
    // Calculate total amount
    const total = products.reduce(
      (sum, item) => sum + (item?.product?.salePrice || 0) * (item?.quantity || 1), 
      0
    );

    const orderData = {
      id: checkoutId,
      uid,
      line_items,
      address,
      total,
      paymentMode: "prepaid",
      paymentStatus: "paid",
      transactionId,
      createdAt: Timestamp.now(),
      status: "pending", 
    };

    // Store in user's orders - use setDoc with the document reference
    await setDoc(checkoutRef, orderData);

    // Store in global 'orders' collection for admin access
    await setDoc(doc(db, "orders", checkoutId), orderData);

    // Update order counts and stock for each product
    for (const item of products) {
      const productId = item?.id;
      const quantity = item?.quantity || 1;
      
      if (productId) {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, {
          orders: increment(quantity),
          stock: increment(-quantity) 
        });
      }
    }

    return checkoutId;
  } catch (error) {
    console.error("Error creating online order:", error);
    throw error;
  }
};