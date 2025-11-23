import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, 
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Basic validation to surface missing env early in dev
if (process.env.NODE_ENV !== "production") {
  const missing = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.warn("Missing Firebase env vars:", missing.join(", "));
  }
}

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const analytics = isSupported().then((yes) =>
  yes ? getAnalytics(app) : null
);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// FIX: Add proper check for messaging initialization
export const messaging = (() => {
  if (typeof window === "undefined") return null; // Server-side
  if (!firebaseConfig.messagingSenderId) return null; // Missing config
  try {
    return getMessaging(app);
  } catch (error) {
    console.warn("Firebase Messaging initialization failed:", error);
    return null;
  }
})();

// Ensure session persists across reloads in the browser
if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    /* ignore */
  });
}