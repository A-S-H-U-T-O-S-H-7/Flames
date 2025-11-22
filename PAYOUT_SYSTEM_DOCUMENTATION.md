# 💰 SELLER PAYOUT SYSTEM - COMPLETE DOCUMENTATION

**Last Updated**: November 2025  
**Version**: 1.0  
**Status**: ✅ Seller Side Implemented | ⏳ Admin Side Pending

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Structure](#database-structure)
4. [Backend Functions](#backend-functions)
5. [Frontend Components](#frontend-components)
6. [Workflows](#workflows)
7. [Security](#security)
8. [Admin Implementation Guide](#admin-implementation-guide)
9. [Testing](#testing)
10. [Future Enhancements](#future-enhancements)

---

## 🎯 OVERVIEW

### What is the Payout System?

The Seller Payout System is a secure, scalable, and cost-efficient solution for managing seller earnings and withdrawals in a multi-seller marketplace. It automates earning calculations, tracks balances, and facilitates secure payment requests.

### Key Features

✅ **Automatic Earning Addition**: Earnings automatically added to wallet when orders are delivered  
✅ **Real-time Balance Tracking**: Live updates of available balance, total earnings, and withdrawals  
✅ **Commission Calculation**: Automatic calculation of platform fees and GST  
✅ **Withdrawal Requests**: Sellers can request payouts with transparent breakdown  
✅ **Audit Trail**: Complete transaction history for accountability  
✅ **Security**: Firestore security rules prevent unauthorized access  

---

## 🏗️ ARCHITECTURE

### System Flow

```
┌─────────────────┐
│  Order Placed   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Order Delivered │
└────────┬────────┘
         │
         ▼
┌──────────────────┐      ┌─────────────────┐
│ Check Payment    │─────▶│ Prepaid + Paid  │
│ Mode & Status    │      │   OR            │
└──────────────────┘      │ COD + Collected │
         │                └─────────────────┘
         ▼                          │
┌──────────────────┐                │
│ Add Earnings to  │◀───────────────┘
│ Seller Wallet    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Seller Requests  │
│ Withdrawal       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Calculate        │
│ Commission & GST │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Create Withdrawal│
│ Request (Pending)│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Admin Approves  │  ◀── Future Implementation
│  & Pays Seller   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Create Settlement│
│ Record           │
└──────────────────┘
```

---

## 💾 DATABASE STRUCTURE

### 1. `/sellerWallet/{sellerId}`

**Purpose**: Tracks each seller's earnings and withdrawals

**Schema**:
```javascript
{
  sellerId: string,
  totalEarnings: number,        // Sum of all delivered orders' sellerTotal
  totalWithdrawn: number,        // Net amount seller received (after fees)
  availableBalance: number,      // totalEarnings - totalWithdrawn
  pendingBalance: number,        // Optional: Earnings in holding period
  lifetimeRevenue: number,       // Total before any deductions
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Example**:
```json
{
  "sellerId": "seller123",
  "totalEarnings": 50000,
  "totalWithdrawn": 15000,
  "availableBalance": 35000,
  "pendingBalance": 0,
  "lifetimeRevenue": 50000,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-11-16T14:30:00Z"
}
```

**Indexes Required**:
- `sellerId` (Primary Key)

---

### 2. `/sellerWallet/{sellerId}/transactions/{transactionId}`

**Purpose**: Audit trail of all wallet activities

**Schema**:
```javascript
{
  type: "earning" | "withdrawal" | "refund" | "adjustment",
  amount: number,
  orderId: string,              // For earnings
  withdrawalRequestId: string,   // For withdrawals
  paymentMode: string,           // COD or prepaid
  orderTotal: number,            // Full order amount (context)
  createdAt: timestamp,
  description: string
}
```

**Example**:
```json
{
  "type": "earning",
  "amount": 1200,
  "orderId": "prepaid_xyz123",
  "paymentMode": "prepaid",
  "orderTotal": 1200,
  "createdAt": "2025-11-16T12:00:00Z",
  "description": "Earning from order prepaid_xyz123"
}
```

---

### 3. `/withdrawalRequests/{requestId}`

**Purpose**: Central collection of all withdrawal requests for easy admin access

**Schema**:
```javascript
{
  id: string,
  sellerId: string,
  
  // Denormalized seller info (for admin view)
  sellerInfo: {
    businessName: string,
    email: string,
    phone: string,
    fullName: string
  },
  
  // Request details
  amountRequested: number,       // Gross amount seller wants
  breakdown: {
    grossAmount: number,
    commissionRate: number,      // % at time of request
    commissionAmount: number,
    gstOnCommission: number,     // 18% of commission
    totalDeduction: number,
    netPayable: number           // Final amount to transfer
  },
  
  // Bank details snapshot (at request time)
  bankDetails: {
    accountHolder: string,
    accountNumber: string,
    ifscCode: string,
    bankName: string,
    bankBranch: string,
    upiId: string
  },
  
  // Status tracking
  status: "pending" | "approved" | "rejected" | "processing" | "cancelled",
  createdAt: timestamp,
  processedAt: timestamp | null,
  processedBy: string | null,     // Admin ID
  
  // Notes
  sellerNote: string,
  adminNote: string,
  
  // Payment tracking
  paymentReference: string        // UTR/Transaction ID
}
```

**Example**:
```json
{
  "id": "req_abc123",
  "sellerId": "seller123",
  "sellerInfo": {
    "businessName": "ABC Store",
    "email": "seller@abc.com",
    "phone": "+911234567890",
    "fullName": "John Doe"
  },
  "amountRequested": 10000,
  "breakdown": {
    "grossAmount": 10000,
    "commissionRate": 2,
    "commissionAmount": 200,
    "gstOnCommission": 36,
    "totalDeduction": 236,
    "netPayable": 9764
  },
  "bankDetails": {
    "accountHolder": "John Doe",
    "accountNumber": "1234567890",
    "ifscCode": "HDFC0001234",
    "bankName": "HDFC Bank",
    "bankBranch": "Mumbai",
    "upiId": "john@paytm"
  },
  "status": "pending",
  "createdAt": "2025-11-16T14:00:00Z",
  "processedAt": null,
  "processedBy": null,
  "sellerNote": "",
  "adminNote": "",
  "paymentReference": ""
}
```

**Indexes Required**:
- `sellerId` (for seller queries)
- `status` (for admin filtering)
- `createdAt` (for sorting)

---

### 4. `/sellerWallet/{sellerId}/settlements/{settlementId}`

**Purpose**: Record of all completed payments to seller

**Schema**:
```javascript
{
  id: string,
  sellerId: string,
  withdrawalRequestId: string,
  amount: number,                // Net amount paid
  breakdown: { /* same as withdrawal */ },
  bankDetails: { /* snapshot */ },
  paymentReference: string,      // UTR/Transaction ID
  method: "NEFT" | "RTGS" | "UPI" | "IMPS",
  paidAt: timestamp,
  paidBy: string,                // Admin ID
  createdAt: timestamp
}
```

**Example**:
```json
{
  "id": "settlement_xyz789",
  "sellerId": "seller123",
  "withdrawalRequestId": "req_abc123",
  "amount": 9764,
  "breakdown": { /* ... */ },
  "bankDetails": { /* ... */ },
  "paymentReference": "UTR123456789",
  "method": "NEFT",
  "paidAt": "2025-11-18T10:00:00Z",
  "paidBy": "admin001",
  "createdAt": "2025-11-18T10:05:00Z"
}
```

---

## 🔧 BACKEND FUNCTIONS

### Wallet Functions (`/lib/firestore/wallet/`)

#### **read.js**

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `useSellerWallet(sellerId)` | Real-time hook for wallet data | `sellerId: string` | `{ wallet, error, isLoading }` |
| `getSellerWallet(sellerId)` | One-time wallet fetch | `sellerId: string` | `{ success, data, error }` |
| `getWalletTransactions(sellerId, limit)` | Get transaction history | `sellerId: string, limit: number` | `{ success, data, error }` |
| `checkWithdrawalEligibility(sellerId, amount)` | Validate withdrawal | `sellerId: string, amount: number` | `{ eligible, reason, availableBalance }` |

#### **write.js**

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `initializeSellerWallet(sellerId)` | Create new wallet | `sellerId: string` | `{ success, message, error }` |
| `addEarningsToWallet({...})` | Add order earnings | `sellerId, amount, orderId, orderDetails` | `{ success, message, error }` |
| `processWithdrawal({...})` | Deduct on approval | `sellerId, grossAmount, netAmount, requestId` | `{ success, message, error }` |
| `refundWithdrawal({...})` | Refund rejected request | `sellerId, amount, requestId` | `{ success, message, error }` |
| `adjustWalletBalance({...})` | Admin manual adjustment | `sellerId, amount, reason, adminId` | `{ success, message, error }` |

---

### Withdrawal Functions (`/lib/firestore/withdrawals/`)

#### **calculations.js**

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `calculateWithdrawalBreakdown(gross, rate)` | Calculate fees & net | `grossAmount: number, commissionRate: number` | `{ grossAmount, commissionRate, commissionAmount, gstOnCommission, totalDeduction, netPayable }` |
| `validateWithdrawalRequest({...})` | Validate request params | `sellerId, amount, availableBalance, minWithdrawal` | `{ isValid, errors[] }` |
| `formatCurrency(amount, currency)` | Format for display | `amount: number, currency: string` | `string` |

**Calculation Example**:
```javascript
// Input
grossAmount = 10000
commissionRate = 2

// Step 1: Commission
commissionAmount = (10000 * 2) / 100 = 200

// Step 2: GST on Commission
gstOnCommission = (200 * 18) / 100 = 36

// Step 3: Total Deduction
totalDeduction = 200 + 36 = 236

// Step 4: Net Payable
netPayable = 10000 - 236 = 9764
```

#### **read.js**

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `useSellerWithdrawals({...})` | Real-time requests hook | `sellerId, status, limitCount` | `{ withdrawals, error, isLoading }` |
| `getSellerWithdrawals({...})` | One-time fetch | `sellerId, status, limitCount` | `{ success, data, error }` |
| `getWithdrawalRequest(requestId)` | Get single request | `requestId: string` | `{ success, data, error }` |
| `hasPendingWithdrawal(sellerId)` | Check pending status | `sellerId: string` | `{ hasPending, pendingRequest }` |
| `getWithdrawalStats(sellerId)` | Get statistics | `sellerId: string` | `{ success, data: stats, error }` |

#### **write.js**

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `createWithdrawalRequest({...})` | Create new request | `sellerId, amount, note` | `{ success, message, data, error }` |
| `cancelWithdrawalRequest({...})` | Cancel pending request | `requestId, sellerId` | `{ success, message, error }` |
| `updateWithdrawalStatus({...})` | Admin update status | `requestId, status, adminId, adminNote, paymentRef` | `{ success, message, error }` |

---

### Settlement Functions (`/lib/firestore/settlements/`)

#### **read.js**

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `getSellerSettlements({...})` | Get settlement history | `sellerId, limitCount` | `{ success, data, error }` |
| `getSellerSettlementStats(sellerId)` | Get statistics | `sellerId: string` | `{ success, data: stats, error }` |

#### **write.js**

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `createSettlement({...})` | Record payment | `sellerId, withdrawalRequestId, amount, breakdown, bankDetails, paymentReference, adminId, method` | `{ success, message, data, error }` |
| `createBulkSettlements(settlements[])` | Batch payments | `settlements: array` | `{ success, message, results, error }` |

---

## 🎨 FRONTEND COMPONENTS

### 1. **WalletCards.jsx**

**Location**: `/src/components/seller/payout/WalletCards.jsx`

**Purpose**: Display wallet overview with 4 key metrics

**Features**:
- Available Balance (ready to withdraw)
- Total Earnings (from delivered orders)
- Total Withdrawn (net amount received)
- Lifetime Revenue (all-time earnings)
- Request Payout button (only if balance > 0)

**Props**:
```javascript
{
  wallet: object,              // Wallet data
  onRequestPayout: function    // Open modal callback
}
```

---

### 2. **WithdrawalRequestModal.jsx**

**Location**: `/src/components/seller/payout/WithdrawalRequestModal.jsx`

**Purpose**: Modal for creating withdrawal requests

**Features**:
- Amount input with MIN/MAX validation
- Real-time breakdown calculation
- Shows commission & GST deduction
- Optional note field
- "Set MAX" button for full balance

**Props**:
```javascript
{
  isOpen: boolean,
  onClose: function,
  wallet: object,
  sellerId: string,
  sellerCommission: number
}
```

---

### 3. **WithdrawalHistoryTable.jsx**

**Location**: `/src/components/seller/payout/WithdrawalHistoryTable.jsx`

**Purpose**: Display all withdrawal requests with status

**Features**:
- Status badges (Pending, Approved, Rejected, Processing)
- Gross amount & net amount display
- Date sorting (newest first)
- Empty state

**Props**:
```javascript
{
  withdrawals: array,
  isLoading: boolean
}
```

---

### 4. **SellerPayout.jsx** (Updated)

**Location**: `/src/components/seller/payout/SellerPayout.jsx`

**Purpose**: Main payout dashboard

**Features**:
- Integrates all child components
- Real-time data with SWR
- Loading & error states
- Modal state management

**Data Flow**:
```
SellerProfile → Payout Tab → SellerPayout
                                 ├─▶ WalletCards
                                 ├─▶ WithdrawalHistoryTable
                                 └─▶ WithdrawalRequestModal
```

---

## 🔄 WORKFLOWS

### Workflow 1: Automatic Earning Addition

**Trigger**: Order status updated to "delivered"

**Steps**:
1. `updateSellerOrderStatus()` called
2. Check order payment mode & status:
   - **Prepaid**: `paymentMode === "prepaid" && paymentStatus === "paid"`
   - **COD**: `paymentMode === "cod" && paymentStatus === "collected"`
3. If conditions met:
   - Call `addEarningsToWallet()`
   - Add `sellerTotal` to wallet
   - Create transaction record
4. Wallet updated in real-time via SWR subscription

**Code Reference**: `/src/lib/firestore/sellerOrders/write.jsx` (lines 43-86)

---

### Workflow 2: Seller Requests Withdrawal

**Trigger**: Seller clicks "Request Payout" button

**Steps**:
1. Modal opens with current balance
2. Seller enters amount
3. Real-time breakdown calculation shows:
   - Gross amount
   - Commission (X%)
   - GST on commission (18%)
   - Net payable
4. Validation:
   - Min amount: ₹100
   - Max amount: Available balance
   - No pending requests
5. On submit:
   - Create withdrawal request document
   - Status: "pending"
   - Capture bank details snapshot
6. Request appears in history table

**Code Reference**: `/src/components/seller/payout/WithdrawalRequestModal.jsx`

---

### Workflow 3: Admin Processes Withdrawal (Future)

**Trigger**: Admin approves request from admin panel

**Steps**:
1. Admin reviews request
2. Verifies bank details
3. Calculates final amount
4. Makes bank transfer
5. Updates withdrawal request:
   - Status: "approved"
   - Payment reference: UTR number
6. Calls `processWithdrawal()`:
   - Deducts gross amount from available balance
   - Adds net amount to total withdrawn
7. Creates settlement record
8. Seller sees updated balance

**Status**: ⏳ Pending Implementation

---

## 🔐 SECURITY

### Firestore Security Rules

**Add these rules to your `firestore.rules` file**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Seller Wallet - Read-only for sellers
    match /sellerWallet/{sellerId} {
      allow read: if request.auth.uid == sellerId;
      allow write: if false; // Only backend can write
      
      // Wallet transactions subcollection
      match /transactions/{transactionId} {
        allow read: if request.auth.uid == sellerId;
        allow write: if false;
      }
      
      // Settlements subcollection
      match /settlements/{settlementId} {
        allow read: if request.auth.uid == sellerId;
        allow write: if false;
      }
    }
    
    // Withdrawal Requests
    match /withdrawalRequests/{requestId} {
      // Sellers can create and read their own requests
      allow create: if request.auth != null && 
                       request.resource.data.sellerId == request.auth.uid;
      allow read: if request.auth.uid == resource.data.sellerId;
      
      // Only admin can update
      allow update: if hasRole('admin') || hasRole('super-admin');
    }
    
    // Helper function to check admin role
    function hasRole(role) {
      return get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == role;
    }
  }
}
```

### Validation Rules

**Client-side Validation**:
- Minimum withdrawal: ₹100
- Maximum withdrawal: Available balance
- No duplicate pending requests
- Amount must be positive number

**Server-side Validation**:
- Seller exists and is approved
- Wallet exists and has sufficient balance
- Commission rate is valid (0-100%)
- Bank details are complete

---

## 👨‍💼 ADMIN IMPLEMENTATION GUIDE

### Phase 1: Admin Dashboard Overview

**File**: `/src/app/(admin)/admin/payouts/page.jsx`

**Features Needed**:
1. **Summary Cards**:
   - Total Pending Requests
   - Total Amount Pending
   - Processed This Month
   - Total Platform Earnings

2. **Filters**:
   - Status (Pending, Approved, Rejected)
   - Date range
   - Seller search
   - Amount range

3. **Request Table**:
   - Seller info (business name, email, phone)
   - Amount requested
   - Net payable
   - Date
   - Status
   - Actions (View, Approve, Reject)

**Sample Query**:
```javascript
// Get all pending requests
const pendingRequests = await getDocs(
  query(
    collection(db, "withdrawalRequests"),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  )
);
```

---

### Phase 2: Request Details Modal

**File**: `/src/components/admin/payouts/WithdrawalDetailsModal.jsx`

**Features**:
1. **Seller Information**:
   - Business name, email, phone
   - Seller since date
   - Total orders completed

2. **Request Details**:
   - Amount requested
   - Commission breakdown
   - Net payable amount
   - Seller note

3. **Bank Details** (pre-filled):
   - Account holder
   - Account number
   - IFSC code
   - Bank name

4. **Admin Actions**:
   - Approve button
   - Reject button (with reason)
   - Payment reference input

---

### Phase 3: Approval Workflow

**Function**: `approveWithdrawal()`

**Location**: `/src/lib/firestore/admin/payouts.js` (create this)

**Steps**:
```javascript
export async function approveWithdrawal({ 
  requestId, 
  adminId, 
  paymentReference, 
  paymentMethod = "NEFT" 
}) {
  // 1. Get withdrawal request
  const request = await getWithdrawalRequest(requestId);
  
  // 2. Update withdrawal status
  await updateWithdrawalStatus({
    requestId,
    status: "approved",
    adminId,
    paymentReference,
    adminNote: "Payment processed"
  });
  
  // 3. Process wallet deduction
  await processWithdrawal({
    sellerId: request.sellerId,
    grossAmount: request.amountRequested,
    netAmount: request.breakdown.netPayable,
    withdrawalRequestId: requestId
  });
  
  // 4. Create settlement record
  await createSettlement({
    sellerId: request.sellerId,
    withdrawalRequestId: requestId,
    amount: request.breakdown.netPayable,
    breakdown: request.breakdown,
    bankDetails: request.bankDetails,
    paymentReference,
    adminId,
    method: paymentMethod
  });
  
  // 5. Send notification to seller (optional)
  // await sendWithdrawalNotification(request.sellerId, request.id);
  
  return { success: true };
}
```

---

### Phase 4: Rejection Workflow

**Function**: `rejectWithdrawal()`

**Steps**:
```javascript
export async function rejectWithdrawal({ 
  requestId, 
  adminId, 
  reason 
}) {
  // 1. Update withdrawal status
  await updateWithdrawalStatus({
    requestId,
    status: "rejected",
    adminId,
    adminNote: reason
  });
  
  // 2. No wallet changes needed (amount was never deducted)
  
  // 3. Send notification to seller (optional)
  // await sendRejectionNotification(requestId, reason);
  
  return { success: true };
}
```

---

### Phase 5: Bulk Processing

**Feature**: Process multiple requests at once

**Steps**:
1. Admin selects multiple pending requests
2. Enters single payment reference (if batch transfer)
3. System processes each request
4. Shows success/failure for each

**Code**:
```javascript
export async function bulkApproveWithdrawals(requests, adminId) {
  const results = [];
  
  for (const request of requests) {
    try {
      await approveWithdrawal({
        requestId: request.id,
        adminId,
        paymentReference: request.paymentRef || "BULK_" + Date.now()
      });
      results.push({ id: request.id, success: true });
    } catch (error) {
      results.push({ id: request.id, success: false, error: error.message });
    }
  }
  
  return results;
}
```

---

### Phase 6: Reports & Analytics

**Features**:
1. **Payout Reports**:
   - Monthly payout summary
   - Seller-wise breakdown
   - Platform earnings

2. **Export Options**:
   - CSV download
   - PDF invoice generation
   - Excel reports

3. **Charts**:
   - Payout trends (line chart)
   - Top sellers (bar chart)
   - Status distribution (pie chart)

---

## 🧪 TESTING

### Test Scenarios

#### 1. **Wallet Initialization**
- [ ] New seller gets wallet on approval
- [ ] Wallet starts with zero balances
- [ ] Wallet document created in Firestore

#### 2. **Earning Addition**
- [ ] Prepaid order → delivered → earnings added
- [ ] COD order → delivered + collected → earnings added
- [ ] COD order → delivered but not collected → earnings NOT added
- [ ] Multiple orders → correct sum in wallet

#### 3. **Withdrawal Request**
- [ ] Amount < min (₹100) → Error
- [ ] Amount > available balance → Error
- [ ] Pending request exists → Error (no duplicate)
- [ ] Valid amount → Request created successfully
- [ ] Breakdown calculated correctly

#### 4. **Withdrawal Validation**
- [ ] Commission rate applied correctly
- [ ] GST (18%) calculated on commission
- [ ] Net payable = Gross - (Commission + GST)
- [ ] Bank details snapshot captured

#### 5. **Real-time Updates**
- [ ] Wallet balance updates instantly
- [ ] New withdrawal appears in table
- [ ] Status changes reflect immediately

---

### Manual Testing Steps

**Test 1: Complete Flow**
1. Create a test seller account
2. Create and deliver test orders
3. Check if earnings appear in wallet
4. Request withdrawal
5. Verify breakdown calculation
6. Check request appears in history

**Test 2: Edge Cases**
1. Try withdrawal with ₹0 balance → Should fail
2. Try withdrawal with amount = balance + 1 → Should fail
3. Try creating second pending request → Should fail
4. Cancel order after earnings added → Check wallet (future feature)

---

## 🚀 FUTURE ENHANCEMENTS

### Short-term (Next Phase)

1. **Admin Panel**:
   - ✅ Planned
   - Withdrawal approval interface
   - Bulk processing
   - Payment reference tracking

2. **Notifications**:
   - Email on earning addition
   - Email on withdrawal status change
   - SMS for approved payouts

3. **Settlement Invoices**:
   - PDF generation
   - Include breakdown details
   - Downloadable from seller panel

---

### Medium-term

1. **Automatic Payouts**:
   - Weekly auto-transfer (like Amazon)
   - Configurable schedule per seller
   - Minimum threshold settings

2. **Multi-currency Support**:
   - Support multiple currencies
   - Exchange rate integration
   - Currency conversion logs

3. **Tax Reports**:
   - TDS calculation
   - GST reports
   - Annual earning statements

---

### Long-term

1. **Payment Gateway Integration**:
   - Razorpay Payout API
   - Stripe Connect
   - Automatic bank transfers

2. **Advanced Analytics**:
   - Earning predictions
   - Cash flow forecasting
   - Seller performance metrics

3. **Escrow System**:
   - Hold earnings for X days
   - Buyer protection
   - Dispute resolution

---

## 📞 SUPPORT & TROUBLESHOOTING

### Common Issues

**Issue 1: Earnings not added after delivery**
- **Check**: Order status is exactly "delivered"
- **Check**: Payment status for COD orders is "collected"
- **Check**: `sellerTotal` field exists in order
- **Solution**: Review `updateSellerOrderStatus()` function logs

**Issue 2: Withdrawal request fails**
- **Check**: Available balance is sufficient
- **Check**: No pending requests exist
- **Check**: Amount >= ₹100
- **Solution**: Validate using `checkWithdrawalEligibility()`

**Issue 3: Real-time updates not working**
- **Check**: SWR subscriptions are active
- **Check**: Firestore security rules allow read access
- **Check**: Internet connection stable
- **Solution**: Check browser console for WebSocket errors

---

## 📝 CHANGE LOG

### Version 1.0 (November 2025)
- ✅ Wallet system implemented
- ✅ Automatic earning addition
- ✅ Withdrawal request system
- ✅ Seller UI components
- ✅ Real-time updates with SWR
- ✅ Security rules defined
- ⏳ Admin panel (pending)

---

## 🤝 CONTRIBUTING

When modifying this system:
1. Update this documentation
2. Test all affected workflows
3. Add unit tests for new functions
4. Update Firestore security rules if needed
5. Document breaking changes

---

## 📄 LICENSE

This payout system is part of the Flames marketplace project.

---

**Last Review**: November 16, 2025  
**Next Review**: When implementing admin panel  
**Maintained By**: Development Team

---

## 🎯 QUICK REFERENCE

### File Structure
```
src/
├── lib/firestore/
│   ├── wallet/
│   │   ├── read.js          ← Wallet queries
│   │   └── write.js         ← Wallet updates
│   ├── withdrawals/
│   │   ├── read.js          ← Withdrawal queries
│   │   ├── write.js         ← Withdrawal CRUD
│   │   └── calculations.js  ← Fee calculations
│   ├── settlements/
│   │   ├── read.js          ← Settlement history
│   │   └── write.js         ← Settlement creation
│   └── sellerOrders/
│       └── write.jsx        ← Auto-earning addition
└── components/seller/payout/
    ├── SellerPayout.jsx           ← Main dashboard
    ├── WalletCards.jsx            ← Balance cards
    ├── WithdrawalRequestModal.jsx ← Request form
    └── WithdrawalHistoryTable.jsx ← Request list
```

### Key Formulas

**Commission Calculation**:
```
commissionAmount = (grossAmount × commissionRate) ÷ 100
```

**GST Calculation**:
```
gstAmount = (commissionAmount × 18) ÷ 100
```

**Net Payable**:
```
netPayable = grossAmount - (commissionAmount + gstAmount)
```

**Available Balance**:
```
availableBalance = totalEarnings - totalWithdrawn
```

---

**END OF DOCUMENTATION**
