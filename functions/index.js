import { initializeApp } from "firebase-admin/app";
initializeApp();

// Import all notification functions
import { newOrderNotification } from "./triggers/orderNotifications.js";
import { newReviewNotification } from "./triggers/reviewNotifications.js";
import { adminAnnouncementNotification } from "./triggers/adminNotifications.js";

// Export all functions
export {
  newOrderNotification,
  newReviewNotification,
  adminAnnouncementNotification
};