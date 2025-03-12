"use client";

/**
 * Format a date string or timestamp into separate date and time components
 * @param {string|number} dateTimeValue - The date/time value to format
 * @returns {Object} Object containing formatted date and time strings
 */
export function formatDateTime(dateTimeValue) {
  const dateObj = new Date(dateTimeValue);
  
  // Format date as DD/MM/YYYY
  const date = dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  // Format time as HH:MM AM/PM
  const time = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  return { date, time };
}

/**
 * Get the appropriate CSS class for order status badges
 * @param {string} status - The order status
 * @returns {string} CSS classes for the status badge
 */
export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'shipped':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'transit':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'delivered':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

// Additional order-related utility functions can be added here
export function formatCurrency(amount, currency = "₹") {
  return `${currency}${parseFloat(amount).toFixed(2)}`;
}

export function getDeliveryEstimate(status, createdAt) {
  const orderDate = new Date(createdAt);
  
  // Typical delivery times based on status (in days)
  const deliveryTimes = {
    pending: 5,
    shipped: 3,
    transit: 2,
    delivered: 0,
    cancelled: 0
  };
  
  const deliveryDays = deliveryTimes[status?.toLowerCase()] || 5;
  
  if (deliveryDays === 0) {
    return status?.toLowerCase() === 'delivered' ? 'Delivered' : 'Cancelled';
  }
  
  const estimatedDate = new Date(orderDate);
  estimatedDate.setDate(orderDate.getDate() + deliveryDays);
  
  return estimatedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}