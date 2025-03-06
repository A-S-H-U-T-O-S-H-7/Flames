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

// COD
export const createCheckoutCODAndGetId = async ({ uid, products, address }) => {
  // Create a unique document reference inside the user's checkout collection
  const checkoutRef = doc(collection(db, "users", uid, "checkout_sessions_cod"));
  const checkoutId = `cod_${checkoutRef.id}`;

  let line_items = products.map((item) => ({
    price: item?.product?.salePrice,
    product_data: {
      name: item?.product?.title ?? "",
      description: item?.product?.shortDescription ?? "",
      images: [
        item?.product?.featureImageURL ?? `${process.env.NEXT_PUBLIC_DOMAIN}/flame1.png`,
      ],
      metadata: {
        productId: item?.id,
      },
    },
    quantity: item?.quantity ?? 1,
  }));

  const orderData = {
    id: checkoutId,
    uid,
    line_items,
    address,
    total: products.reduce((sum, item) => sum + item?.product?.salePrice * (item?.quantity ?? 1), 0), // Calculate total
    paymentMode: "cod",
    createdAt: Timestamp.now(),
    status: "pending",
  };

  // Store in user's orders
  await setDoc(checkoutRef, orderData);

  // Store in global 'orders' collection for admin access
  await addDoc(collection(db, "orders"), orderData);

  return checkoutId;
};
