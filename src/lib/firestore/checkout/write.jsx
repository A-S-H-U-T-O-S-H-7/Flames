import { db } from "../firebase";
import { collection, doc, setDoc, getDoc, Timestamp, updateDoc, increment } from "firebase/firestore";

// Helper function to group products by seller
const groupProductsBySeller = (products) => {
  const sellerGroups = {};
  const sellerIds = new Set();
  
  products.forEach((item) => {
    const sellerId = item?.product?.sellerId || 'admin';
    const sellerSnapshot = item?.product?.sellerSnapshot || null;
    const sellerBusinessName = item?.product?.sellerBusinessName || 'Admin';
    const sellerName = item?.product?.sellerName || 'Platform';
    
    sellerIds.add(sellerId);
    
    if (!sellerGroups[sellerId]) {
      sellerGroups[sellerId] = {
        sellerId: sellerId,
        sellerSnapshot: sellerSnapshot,
        sellerBusinessName: sellerBusinessName,
        sellerName: sellerName,
        items: [],
        subtotal: 0,
        itemCount: 0
      };
    }
    
    const itemTotal = (item?.product?.salePrice || 0) * (item?.quantity || 1);
    const itemCount = item?.quantity || 1;
    
    sellerGroups[sellerId].items.push({
      ...item,
      itemTotal: itemTotal
    });
    sellerGroups[sellerId].subtotal += itemTotal;
    sellerGroups[sellerId].itemCount += itemCount;
  });
  
  return {
    sellerGroups: Object.values(sellerGroups),
    sellerIds: Array.from(sellerIds)
  };
};

export const createCheckoutCODAndGetId = async ({ uid, products, address }) => {
  // Create a unique document reference inside the user's checkout collection
  const checkoutRef = doc(collection(db, "users", uid, "checkout_sessions_cod"));
  const checkoutId = `cod_${checkoutRef.id}`;
  
  // Group products by seller
  const { sellerGroups, sellerIds } = groupProductsBySeller(products);
  
  // Format line items with seller information
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
    // Add seller information to each line item
    sellerId: item?.product?.sellerId || 'admin',
    sellerSnapshot: item?.product?.sellerSnapshot || null,
    sellerBusinessName: item?.product?.sellerBusinessName || 'Admin',
    sellerName: item?.product?.sellerName || 'Platform',
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
    // Multi-seller support
    sellerGroups: sellerGroups,
    sellerIds: sellerIds,
    isMultiSeller: sellerIds.length > 1,
  };

  try {
    // Store in user's orders
    await setDoc(checkoutRef, orderData);

    // Store in global 'orders' collection for admin access
    await setDoc(doc(db, "orders", checkoutId), orderData);

    // DUAL-WRITE: Store seller-specific order data for each seller
    for (const sellerGroup of sellerGroups) {
      const sellerId = sellerGroup.sellerId;
      
      // Create seller-specific order data with only their items
      const sellerOrderData = {
        id: checkoutId,
        orderId: checkoutId,
        uid,
        address,
        paymentMode: "cod",
        paymentStatus: "pending",
        createdAt: orderData.createdAt,
        status: "pending",
        
        // Seller-specific data
        sellerId: sellerId,
        sellerSnapshot: sellerGroup.sellerSnapshot,
        sellerBusinessName: sellerGroup.sellerBusinessName,
        sellerName: sellerGroup.sellerName,
        
        // Only items for this seller
        line_items: sellerGroup.items.map(item => ({
          price: item?.product?.salePrice || 0,
          product_data: {
            name: item?.product?.title || "",
            description: item?.product?.shortDescription || "",
            images: [item?.product?.featureImageURL || `${process.env.NEXT_PUBLIC_DOMAIN}/flame1.png`],
            metadata: { productId: item?.id || "" },
          },
          quantity: item?.quantity || 1,
          productId: item?.id,
        })),
        
        // Seller's subtotal (only their items)
        sellerTotal: sellerGroup.subtotal,
        
        // Multi-seller context
        isMultiSellerOrder: sellerGroups.length > 1,
        totalSellers: sellerGroups.length,
        orderTotal: total, // Full order total for context
      };
      
      // Write to sellerOrders/{sellerId}/orders/{orderId}
      const sellerOrderRef = doc(db, "sellerOrders", sellerId, "orders", checkoutId);
      await setDoc(sellerOrderRef, sellerOrderData);
    }

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
    
    // Group products by seller
    const { sellerGroups, sellerIds } = groupProductsBySeller(products);
    
    // Format line items with seller information
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
      // Add seller information to each line item
      sellerId: item?.product?.sellerId || 'admin',
      sellerSnapshot: item?.product?.sellerSnapshot || null,
      sellerBusinessName: item?.product?.sellerBusinessName || 'Admin',
      sellerName: item?.product?.sellerName || 'Platform',
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
      // Multi-seller support
      sellerGroups: sellerGroups,
      sellerIds: sellerIds,
      isMultiSeller: sellerIds.length > 1,
    };

    // Store in user's orders - use setDoc with the document reference
    await setDoc(checkoutRef, orderData);

    // Store in global 'orders' collection for admin access
    await setDoc(doc(db, "orders", checkoutId), orderData);

    // DUAL-WRITE: Store seller-specific order data for each seller
    for (const sellerGroup of sellerGroups) {
      const sellerId = sellerGroup.sellerId;
      
      // Create seller-specific order data with only their items
      const sellerOrderData = {
        id: checkoutId,
        orderId: checkoutId,
        uid,
        address,
        paymentMode: "prepaid",
        paymentStatus: "paid",
        transactionId,
        createdAt: orderData.createdAt,
        status: "pending",
        
        // Seller-specific data
        sellerId: sellerId,
        sellerSnapshot: sellerGroup.sellerSnapshot,
        sellerBusinessName: sellerGroup.sellerBusinessName,
        sellerName: sellerGroup.sellerName,
        
        // Only items for this seller
        line_items: sellerGroup.items.map(item => ({
          price: item?.product?.salePrice || 0,
          product_data: {
            name: item?.product?.title || "",
            description: item?.product?.shortDescription || "",
            images: [item?.product?.featureImageURL || `${process.env.NEXT_PUBLIC_DOMAIN}/flame1.png`],
            metadata: { productId: item?.id || "" },
          },
          quantity: item?.quantity || 1,
          productId: item?.id,
        })),
        
        // Seller's subtotal (only their items)
        sellerTotal: sellerGroup.subtotal,
        
        // Multi-seller context
        isMultiSellerOrder: sellerGroups.length > 1,
        totalSellers: sellerGroups.length,
        orderTotal: total, // Full order total for context
      };
      
      // Write to sellerOrders/{sellerId}/orders/{orderId}
      const sellerOrderRef = doc(db, "sellerOrders", sellerId, "orders", checkoutId);
      await setDoc(sellerOrderRef, sellerOrderData);
    }

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
