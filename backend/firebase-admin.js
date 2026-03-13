const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

let db, auth;

if (!serviceAccountKey) {
  console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_KEY is missing in .env');
  console.warn('Backend will run in limited mode. Firestore operations will fail.');
  // Initialize with null or dummy to avoid crash on import
  db = null;
  auth = null;
} else {
  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin initialized successfully');
    db = admin.firestore();
    auth = admin.auth();
  } catch (error) {
    console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', error.message);
    db = null;
    auth = null;
  }
}

module.exports = { admin, db, auth };
