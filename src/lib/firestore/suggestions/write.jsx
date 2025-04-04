import { db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export const addSuggestion = async ({
  displayName,
  message,
  uid,
  email,
  phone, // Added phone parameter
  type = "suggestion"
}) => {
  if (!uid) {
    throw new Error("User authentication required");
  }
  
  if (!message || message.trim() === "") {
    throw new Error("Message cannot be empty");
  }

  // Create a new document ID
  const newId = doc(collection(db, "ids")).id;
  
  // Add the suggestion to Firestore
  await setDoc(doc(db, `suggestions/${newId}`), {
    id: newId,
    displayName,
    message,
    uid,
    email,
    phone, // Store phone number in Firestore
    type, // This will be "feedback" when called from the contact form
    status: "pending", // For tracking suggestion status (pending, reviewed, implemented, etc.)
    timestampCreate: Timestamp.now(),
  });
  
  return newId;
};

export const updateSuggestionStatus = async ({ id, status }) => {
  if (!id) {
    throw new Error("Suggestion ID is required");
  }
  
  if (!status) {
    throw new Error("Status is required");
  }
  
  // Update the suggestion status in Firestore
  await updateDoc(doc(db, `suggestions/${id}`), {
    status
  });
  
  return true;
};