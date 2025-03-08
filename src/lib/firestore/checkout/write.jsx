// import { db } from "../firebase";
// import { collection, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

// export const createCheckoutAndGetURL = async ({ uid, products, address }) => {
//   const checkoutId = doc(collection(db, `ids`)).id;

//   const ref = doc(db, `users/${uid}/checkout_sessions/${checkoutId}`);

//   let line_items = [];

//   products.forEach((item) => {
//     line_items.push({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: item?.product?.title ?? "",
//           description: item?.product?.shortDescription ?? "",
//           images: [
//             item?.product?.featureImageURL ??
//               `${process.env.NEXT_PUBLIC_DOMAIN}/logo.png`,
//           ],
//           metadata: {
//             productId: item?.id,
//           },
//         },
//         unit_amount: item?.product?.salePrice * 100,
//       },
//       quantity: item?.quantity ?? 1,
//     });
//   });

//   await setDoc(ref, {
//     id: checkoutId,
//     payment_method_types: ["card"],
//     mode: "payment",
//     line_items: line_items,
//     metadata: {
//       checkoutId: checkoutId,
//       uid: uid,
//       address: JSON.stringify(address),
//     },
//     success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout-success?checkout_id=${checkoutId}`,
//     cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout-failed?checkout_id=${checkoutId}`,
//   });

//   await new Promise((res) => setTimeout(res, 2000));

//   const checkoutSession = await getDoc(ref);

//   if (!checkoutSession?.exists()) {
//     throw new Error("Checkout Session Not Found");
//   }

//   if (checkoutSession?.data()?.error?.message) {
//     throw new Error(checkoutSession?.data()?.error?.message);
//   }

//   const url = checkoutSession.data()?.url;

//   if (url) {
//     return url;
//   } else {
//     await new Promise((res) => setTimeout(res, 3000));

//     const checkoutSession = await getDoc(ref);

//     if (checkoutSession?.data()?.error?.message) {
//       throw new Error(checkoutSession?.data()?.error?.message);
//     }

//     if (checkoutSession.data()?.url) {
//       return checkoutSession.data()?.url;
//     } else {
//       await new Promise((res) => setTimeout(res, 5000));

//       const checkoutSession = await getDoc(ref);

//       if (checkoutSession?.data()?.error?.message) {
//         throw new Error(checkoutSession?.data()?.error?.message);
//       }

//       if (checkoutSession.data()?.url) {
//         return checkoutSession.data()?.url;
//       } else {
//         throw new Error("Something went wrong! Please Try Again");
//       }
//     }
//   }
// };


import { db } from "../firebase";
import { collection, doc, setDoc, addDoc, Timestamp } from "firebase/firestore";


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
    await addDoc(collection(db, "orders"), orderData);

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
    const checkoutId = `online_${checkoutRef.id}`;
    
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
      paymentMode: "online",
      paymentStatus: "paid",
      transactionId,
      createdAt: Timestamp.now(),
      status: "confirmed", // Online payments are confirmed immediately
    };

    // Store in user's orders - use setDoc with the document reference
    await setDoc(checkoutRef, orderData);

    // Store in global 'orders' collection for admin access
    await addDoc(collection(db, "orders"), orderData);

    return checkoutId;
  } catch (error) {
    console.error("Error creating online order:", error);
    throw error;
  }
};