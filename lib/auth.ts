// ============================================================
// AA AI GROUP — Server Auth Utilities (Firebase)
// ============================================================
// Server-side authentication helpers using Firebase Admin SDK.
// ============================================================

import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

export type AuthUser = {
  uid: string;
  email: string;
  name: string;
  role: string;
};

/**
 * Create a session cookie from a Firebase ID token.
 * Called after client-side sign-in to establish server-side session.
 */
export async function createSessionCookie(idToken: string) {
  // Session cookie expires in 7 days
  const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 days in ms

  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn,
  });

  const cookieStore = await cookies();
  cookieStore.set("__session", sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: expiresIn / 1000, // Convert to seconds
  });

  return sessionCookie;
}

/**
 * Get the currently authenticated user from the session cookie.
 * Returns null if no valid session exists.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("__session")?.value;

    if (!sessionCookie) return null;

    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true // Check revoked
    );

    // Get user role from Firestore
    let role = "customer";
    try {
      const userDoc = await adminDb
        .collection("users")
        .doc(decodedClaims.uid)
        .get();
      if (userDoc.exists) {
        role = userDoc.data()?.role || "customer";
      }
    } catch {
      // Firestore not available, default to customer
    }

    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email || "",
      name: decodedClaims.name || decodedClaims.email || "",
      role,
    };
  } catch {
    return null;
  }
}

/**
 * Destroy the session cookie (logout).
 */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("__session");
}
