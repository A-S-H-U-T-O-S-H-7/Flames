"use client";

import React, { createContext, useContext } from 'react';

const MockDataContext = createContext();

// Mock seller data for development
const mockSellerData = {
  id: 'seller_dev_001',
  uid: 'seller_dev_001',
  email: 'seller@demo.com',
  displayName: 'Demo Seller',
  businessName: 'Demo Store',
  role: 'seller',
  status: 'approved',
  permissions: ['dashboard', 'products', 'orders', 'earnings', 'reviews', 'messages', 'settings'],
  totalEarnings: 125000,
  joinedDate: new Date('2023-01-15'),
  address: {
    street: '123 Demo Street',
    city: 'Demo City',
    state: 'Demo State',
    zipCode: '12345'
  },
  bankDetails: {
    accountNumber: '****5678',
    bankName: 'Demo Bank',
    ifscCode: 'DEMO0001'
  }
};

// Mock products data
const mockProducts = [
  {
    id: 'prod_001',
    title: 'Demo Product 1',
    name: 'Demo Product 1',
    category: 'Electronics',
    price: 1299,
    salePrice: 1199,
    stock: 15,
    featureImageURL: 'https://via.placeholder.com/300',
    status: 'active',
    isFeatured: true,
    isNewArrival: false,
    orders: 25,
    createdAt: new Date('2024-01-01'),
    sellerId: 'seller_dev_001'
  },
  {
    id: 'prod_002',
    title: 'Demo Product 2',
    name: 'Demo Product 2',
    category: 'Clothing',
    price: 799,
    salePrice: 799,
    stock: 3,
    featureImageURL: 'https://via.placeholder.com/300',
    status: 'active',
    isFeatured: false,
    isNewArrival: true,
    orders: 12,
    createdAt: new Date('2024-01-05'),
    sellerId: 'seller_dev_001'
  },
  {
    id: 'prod_003',
    title: 'Demo Product 3',
    name: 'Demo Product 3',
    category: 'Home & Garden',
    price: 2499,
    salePrice: 2199,
    stock: 0,
    featureImageURL: 'https://via.placeholder.com/300',
    status: 'out_of_stock',
    isFeatured: false,
    isNewArrival: false,
    orders: 8,
    createdAt: new Date('2024-01-10'),
    sellerId: 'seller_dev_001'
  }
];

// Mock orders data
const mockOrders = [
  {
    id: 'order_001',
    customerId: 'cust_001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    total: 1299,
    status: 'pending',
    createdAt: new Date('2024-02-01'),
    sellerId: 'seller_dev_001',
    line_items: [
      {
        product_id: 'prod_001',
        quantity: 1,
        price: 1299
      }
    ]
  },
  {
    id: 'order_002',
    customerId: 'cust_002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    total: 799,
    status: 'processing',
    createdAt: new Date('2024-02-02'),
    sellerId: 'seller_dev_001',
    line_items: [
      {
        product_id: 'prod_002',
        quantity: 1,
        price: 799
      }
    ]
  },
  {
    id: 'order_003',
    customerId: 'cust_003',
    customerName: 'Bob Johnson',
    customerEmail: 'bob@example.com',
    total: 2098,
    status: 'delivered',
    createdAt: new Date('2024-01-28'),
    sellerId: 'seller_dev_001',
    line_items: [
      {
        product_id: 'prod_002',
        quantity: 2,
        price: 799
      },
      {
        product_id: 'prod_001',
        quantity: 1,
        price: 1299
      }
    ]
  }
];

// Mock earnings data
const mockEarnings = {
  totalEarnings: 125000,
  monthlyEarnings: 15000,
  weeklyEarnings: 3500,
  todayEarnings: 500,
  pendingPayouts: 2500,
  completedPayouts: 122500,
  earningsHistory: [
    { month: 'Jan 2024', amount: 18000 },
    { month: 'Feb 2024', amount: 22000 },
    { month: 'Mar 2024', amount: 19500 },
    { month: 'Apr 2024', amount: 25000 },
    { month: 'May 2024', amount: 21000 },
    { month: 'Jun 2024', amount: 19500 }
  ]
};

// Mock reviews data
const mockReviews = [
  {
    id: 'review_001',
    productId: 'prod_001',
    productName: 'Demo Product 1',
    customerName: 'Alice Brown',
    rating: 5,
    comment: 'Excellent product! Very satisfied with the quality.',
    createdAt: new Date('2024-02-05'),
    sellerId: 'seller_dev_001'
  },
  {
    id: 'review_002',
    productId: 'prod_002',
    productName: 'Demo Product 2',
    customerName: 'Charlie Wilson',
    rating: 4,
    comment: 'Good product, fast delivery.',
    createdAt: new Date('2024-02-03'),
    sellerId: 'seller_dev_001'
  }
];

export default function MockDataProvider({ children }) {
  const mockData = {
    seller: mockSellerData,
    products: mockProducts,
    orders: mockOrders,
    earnings: mockEarnings,
    reviews: mockReviews,
    
    // Helper functions
    getProductById: (id) => mockProducts.find(p => p.id === id),
    getOrderById: (id) => mockOrders.find(o => o.id === id),
    getOrdersByStatus: (status) => mockOrders.filter(o => o.status === status),
    getProductsByStatus: (status) => mockProducts.filter(p => p.status === status),
    
    // Statistics
    stats: {
      totalProducts: mockProducts.length,
      activeProducts: mockProducts.filter(p => p.stock > 0).length,
      outOfStockProducts: mockProducts.filter(p => p.stock === 0).length,
      lowStockProducts: mockProducts.filter(p => p.stock > 0 && p.stock <= 5).length,
      totalOrders: mockOrders.length,
      pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
      processingOrders: mockOrders.filter(o => o.status === 'processing').length,
      deliveredOrders: mockOrders.filter(o => o.status === 'delivered').length,
      monthlyRevenue: mockOrders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0),
      averageRating: mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length,
      totalReviews: mockReviews.length
    }
  };

  return (
    <MockDataContext.Provider value={mockData}>
      {children}
    </MockDataContext.Provider>
  );
}

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};

// Hook for development mode detection
export const useIsDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};