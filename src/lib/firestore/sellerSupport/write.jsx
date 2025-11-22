// lib/firestore/support/write.js
import { db } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

const SUPPORT_COLLECTION = "supportTickets";

/**
 * Create a new support ticket
 */
export const createSupportTicket = async (ticketData) => {
  try {
    const ticketRef = collection(db, SUPPORT_COLLECTION);
    
    const ticketWithMetadata = {
      ...ticketData,
      status: 'open', // open, in_progress, resolved, closed
      ticketNumber: generateTicketNumber(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(ticketRef, ticketWithMetadata);
    
    return {
      success: true,
      ticketId: docRef.id,
      ticketNumber: ticketWithMetadata.ticketNumber
    };
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update an existing support ticket
 */
export const updateSupportTicket = async (ticketId, updateData) => {
  try {
    const ticketRef = doc(db, SUPPORT_COLLECTION, ticketId);
    
    const updateWithTimestamp = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(ticketRef, updateWithMetadata);
    
    return {
      success: true,
      ticketId: ticketId
    };
  } catch (error) {
    console.error("Error updating support ticket:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete a support ticket
 */
export const deleteSupportTicket = async (ticketId) => {
  try {
    const ticketRef = doc(db, SUPPORT_COLLECTION, ticketId);
    await deleteDoc(ticketRef);
    
    return {
      success: true,
      ticketId: ticketId
    };
  } catch (error) {
    console.error("Error deleting support ticket:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Add a reply to a support ticket
 */
export const addTicketReply = async (ticketId, replyData) => {
  try {
    const ticketRef = doc(db, SUPPORT_COLLECTION, ticketId);
    
    const reply = {
      ...replyData,
      repliedAt: serverTimestamp(),
      id: generateReplyId()
    };

    await updateDoc(ticketRef, {
      replies: arrayUnion(reply),
      updatedAt: serverTimestamp(),
      // If admin is replying, change status to in_progress
      ...(replyData.isAdmin && { status: 'in_progress' })
    });
    
    return {
      success: true,
      replyId: reply.id
    };
  } catch (error) {
    console.error("Error adding ticket reply:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Close a support ticket
 */
export const closeSupportTicket = async (ticketId, resolution = '') => {
  try {
    const ticketRef = doc(db, SUPPORT_COLLECTION, ticketId);
    
    await updateDoc(ticketRef, {
      status: 'closed',
      resolution: resolution,
      closedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return {
      success: true,
      ticketId: ticketId
    };
  } catch (error) {
    console.error("Error closing support ticket:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper functions
const generateTicketNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TKT-${timestamp.slice(-6)}-${random}`;
};

const generateReplyId = () => {
  return `REP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};