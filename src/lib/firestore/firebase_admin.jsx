export const admin = require("firebase-admin");

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEYS) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEYS in environment variables.");
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEYS);


if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminDB = admin.firestore();

