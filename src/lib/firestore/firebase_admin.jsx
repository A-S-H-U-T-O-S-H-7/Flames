export const admin = require("firebase-admin");

// Check if the app has already been initialized
if (admin.apps.length === 0) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID, // ← Change this
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Make sure newlines are properly handled
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.log("Firebase admin initialization error", error);
  }
}

export const adminDB = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();