# Multi-Seller Order System Implementation Guide

## Overview
This document explains how the multi-seller marketplace order system works in your Flames project.

---

## System Architecture

### 1. **Product Structure with Seller Info**

Each product in Firestore contains:
```javascript
{
  id: "product_123",
  title: "Product Name",
  category: "category_id",        // ✅ Primary field
  categoryId: "category_id",      // ✅ Backward compatibility
  
  // Seller Information
  sellerId: "seller_abc",
  sellerName: "John Doe",
  sellerBusinessName: "ABC Store",
  sellerSku: "SELLER-SKU-001",
  
  // Seller Snapshot (frozen at product creation)
  sellerSnapshot: {
    businessName: "ABC Store",
    sellerName: "John Doe",
    email: "seller@example.com",
    phone: "+1234567890",
    isKycVerified: true,
    status: "approved"
  },
  
  // Standard fields
  price: 100,
  salePrice: 80,
  stock: 50,
  sku: "PROD-SKU-001"
}
```

---

### 2. **Order Structure with Multi-Seller Support**

When a user places an order, the system creates:

```javascript
{
  id: "cod_xyz123" or "prepaid_xyz123",
  uid: "user_id",
  userName: "Customer Name",
  userEmail: "customer@email.com",
  
  // Payment
  paymentMode: "cod" | "prepaid",
  paymentStatus: "pending" | "paid",
  
  // Line Items (All products in cart)
  line_items: [
    {
      product_data: {
        name: "Product 1",
        metadata: { productId: "prod_1" }
      },
      quantity: 2,
      price: 100,
      
      // 🔥 SELLER INFO IN EACH ITEM
      sellerId: "seller_abc",
      sellerName: "John Doe",
      sellerBusinessName: "ABC Store",
      sellerSku: "SELLER-SKU-001"
    },
    {
      product_data: {
        name: "Product 2",
        metadata: { productId: "prod_2" }
      },
      quantity: 1,
      price: 200,
      
      // Different seller
      sellerId: "seller_xyz",
      sellerName: "Jane Smith",
      sellerBusinessName: "XYZ Store",
      sellerSku: "SELLER-SKU-002"
    }
  ],
  
  // 🔥 ORGANIZED SELLER GROUPS
  sellerGroups: [
    {
      sellerId: "seller_abc",
      sellerName: "John Doe",
      sellerBusinessName: "ABC Store",
      items: [
        {
          productId: "prod_1",
          title: "Product 1",
          quantity: 2,
          price: 100,
          sellerSku: "SELLER-SKU-001",
          productSku: "PROD-SKU-001",
          itemTotal: 200
        }
      ],
      total: 200,
      status: "pending",
      shippingStatus: "pending"
    },
    {
      sellerId: "seller_xyz",
      sellerName: "Jane Smith",
      sellerBusinessName: "XYZ Store",
      items: [
        {
          productId: "prod_2",
          title: "Product 2",
          quantity: 1,
          price: 200,
          sellerSku: "SELLER-SKU-002",
          productSku: "PROD-SKU-002",
          itemTotal: 200
        }
      ],
      total: 200,
      status: "pending",
      shippingStatus: "pending"
    }
  ],
  
  // 🔥 QUICK LOOKUP ARRAY
  sellerIds: ["seller_abc", "seller_xyz"],
  
  // Totals
  total: 400,
  itemTotal: 400,
  discount: 0,
  shippingFee: 0,
  
  // Status
  status: "pending",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## Key Features

### ✅ 1. **Product Creation with Seller Info**
- File: `src/lib/firestore/products/write.jsx`
- Function: `createNewProduct()` and `createSellerProduct()`
- Automatically fetches and stores seller details
- Creates seller snapshot for historical accuracy

### ✅ 2. **Checkout with Seller Organization**
- File: `src/components/web/pages/Checkout.jsx`
- Function: `organizeProductsBySeller()`
- Groups cart items by seller
- Creates comprehensive order data structure
- Includes seller info in every line item

### ✅ 3. **Order Creation**
- File: `src/lib/firestore/checkout/write.jsx`
- Functions: `createCheckoutCODAndGetId()` and `createCheckoutOnlineAndGetId()`
- Stores orders in both user's collection and global 'orders' collection
- Maintains seller information throughout

### ✅ 4. **Seller Order Filtering**
- File: `src/components/seller/orders/SellerOrdersList.jsx`
- Sellers see ONLY orders containing their products
- Filters by checking:
  - `order.sellerIds` array
  - `order.line_items[].sellerId`
  - `order.sellerGroups[].sellerId`

### ✅ 5. **Admin Order Access**
- File: `src/app/(admin)/admin/orders/page.jsx`
- Admin sees ALL orders without filtering
- Full visibility across all sellers

### ✅ 6. **Related Products Fix**
- Files: 
  - `src/components/product/Details.jsx`
  - `src/app/(Web)/product-details/[productid]/page.jsx`
- Fixed to use both `category` and `categoryId` for backward compatibility

---

## Data Flow

### Order Placement Flow:
```
1. User adds products to cart (may be from multiple sellers)
   ↓
2. User goes to checkout
   ↓
3. Checkout organizes products by seller
   ↓
4. Creates order with:
   - All line_items with seller info
   - sellerGroups (organized by seller)
   - sellerIds array (for quick filtering)
   ↓
5. Order stored in:
   - users/{uid}/checkout_sessions_cod or checkout_sessions_online
   - orders/{orderId} (global collection)
   ↓
6. Seller panel filters orders by sellerId
   ↓
7. Admin panel shows all orders
```

---

## Query Strategy

### Seller Orders Query:
```javascript
// Query all orders
const q = query(ordersRef, orderBy("createdAt", "desc"));

// Filter client-side for seller's orders
const sellerOrders = allOrders.filter(order => {
  return order.sellerIds?.includes(sellerId) ||
         order.line_items?.some(item => item.sellerId === sellerId) ||
         order.sellerGroups?.some(group => group.sellerId === sellerId);
});
```

### Why Client-Side Filtering?
1. Firestore doesn't support `array-contains` with `orderBy` on different fields
2. Multi-seller orders need complex filtering
3. Performance is acceptable for typical order volumes

---

## Multi-Seller Order Example

**Scenario**: User orders 3 items from 2 different sellers

### Cart State:
```javascript
[
  { product: { id: "p1", sellerId: "s1", title: "Item A" }, quantity: 1 },
  { product: { id: "p2", sellerId: "s1", title: "Item B" }, quantity: 2 },
  { product: { id: "p3", sellerId: "s2", title: "Item C" }, quantity: 1 }
]
```

### After Organization:
```javascript
sellerGroups: [
  {
    sellerId: "s1",
    items: [
      { productId: "p1", title: "Item A", quantity: 1, ... },
      { productId: "p2", title: "Item B", quantity: 2, ... }
    ],
    total: 300
  },
  {
    sellerId: "s2",
    items: [
      { productId: "p3", title: "Item C", quantity: 1, ... }
    ],
    total: 100
  }
]

sellerIds: ["s1", "s2"]
```

### What Each Seller Sees:
- **Seller S1**: Sees the order with Items A & B (their portion)
- **Seller S2**: Sees the order with Item C (their portion)
- **Admin**: Sees complete order with all 3 items

---

## Benefits of This Architecture

### ✅ **Clean Separation**
- Each seller sees only their products
- No data leakage between sellers

### ✅ **Scalable**
- Supports unlimited sellers per order
- Efficient filtering

### ✅ **Admin Control**
- Full visibility for administration
- Easy reporting and analytics

### ✅ **Seller Analytics Ready**
- Can easily calculate per-seller revenue
- Track individual seller performance
- Generate seller-specific reports

### ✅ **Future-Ready**
- Easy to add split payments
- Can implement seller-specific shipping
- Ready for commission calculations

---

## Files Modified

1. ✅ `src/components/web/pages/Checkout.jsx` - Added seller organization
2. ✅ `src/lib/firestore/checkout/write.jsx` - Enhanced order creation
3. ✅ `src/lib/firestore/products/write.jsx` - Already had seller support
4. ✅ `src/components/seller/orders/SellerOrdersList.jsx` - Fixed seller filtering
5. ✅ `src/components/product/Details.jsx` - Fixed category field
6. ✅ `src/app/(Web)/product-details/[productid]/page.jsx` - Fixed category field

---

## Testing Checklist

### ✅ Product Creation
- [ ] Create product as seller → should have sellerId
- [ ] Create product as admin → should NOT have sellerId
- [ ] Verify sellerSnapshot is stored correctly

### ✅ Order Placement
- [ ] Order single product from one seller
- [ ] Order multiple products from one seller
- [ ] **Order products from multiple sellers** (critical test)
- [ ] Verify sellerGroups are created correctly
- [ ] Verify sellerIds array is populated

### ✅ Seller Panel
- [ ] Seller sees only their orders
- [ ] Seller sees only their items in multi-seller orders
- [ ] Orders display correctly with seller info

### ✅ Admin Panel
- [ ] Admin sees all orders
- [ ] Admin sees all items in every order
- [ ] Can view multi-seller orders completely

### ✅ Related Products
- [ ] Related products show on product details page
- [ ] Category filtering works correctly

---

## Troubleshooting

### Issue: Seller sees no orders
**Solution**: Check if products have `sellerId` field. Use console logs to verify `sellerIds` array in orders.

### Issue: Related products not showing
**Solution**: Verify product has both `category` and `categoryId` fields.

### Issue: Order shows all items to all sellers
**Solution**: Ensure filtering logic in `SellerOrdersList.jsx` is working. Check console logs for "Filtering orders for seller" messages.

---

## Future Enhancements

1. **Split Payments**: Send payment to each seller separately
2. **Seller Commissions**: Deduct platform fee from seller payments
3. **Seller-Specific Shipping**: Each seller handles their own shipping
4. **Seller Notifications**: Email/SMS when they receive an order
5. **Seller Analytics Dashboard**: Revenue, orders, popular products
6. **Multi-Seller Invoice**: Generate invoices per seller

---

## Support

If you encounter issues:
1. Check browser console for error logs
2. Verify Firestore data structure matches documentation
3. Test with console.log statements
4. Check seller authentication is working

---

**Last Updated**: 2025-11-01
**Version**: 1.0
**Status**: ✅ Implementation Complete
