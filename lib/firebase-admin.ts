// ============================================================
// AA AI GROUP — Firebase Admin SDK Configuration
// ============================================================
// Server-side Firebase Admin for session verification & Firestore.
// Project: aa-ai-group
// ============================================================

import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getFirebaseAdmin(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Option 1: Service Account JSON (recommended for production)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    return initializeApp({
      credential: cert(serviceAccount),
      projectId: "aa-ai-group",
    });
  }

  // Option 2: Default credentials (works in Google Cloud / Firebase hosting)
  return initializeApp({
    projectId: "aa-ai-group",
  });
}

const adminApp = getFirebaseAdmin();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export default adminApp;
