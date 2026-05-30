// ============================================================
// AA AI GROUP — Client Auth Utilities (Firebase)
// ============================================================
// Client-side authentication using Firebase Auth SDK.
// ============================================================

"use client";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { firebaseAuth, firebaseDb } from "@/lib/firebase";

/**
 * Sign in with email and password, then create a server session.
 */
export async function signIn(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password
  );

  // Get ID token and create server-side session cookie
  const idToken = await userCredential.user.getIdToken();
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    throw new Error("Failed to create session");
  }

  const data = await res.json();
  return { user: userCredential.user, role: data.role };
}

/**
 * Register a new user with email and password.
 */
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  referredBy?: string
) {
  const userCredential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password
  );

  // Update display name
  await updateProfile(userCredential.user, {
    displayName: fullName,
  });

  let referrerUid = null;
  if (referredBy) {
    try {
      const { collection, query, where, getDocs } = await import("firebase/firestore");
      const q = query(collection(firebaseDb, "users"), where("referralCode", "==", referredBy.trim()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        referrerUid = snap.docs[0].id;
      }
    } catch (err) {
      console.error("Error verifying referral code:", err);
    }
  }

  const referralCode = `AA-${fullName.split(" ")[0].toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Create user document in Firestore
  await setDoc(doc(firebaseDb, "users", userCredential.user.uid), {
    email,
    fullName,
    role: "customer",
    isActive: true,
    emailVerified: false,
    membershipTier: "free",
    membershipExpiresAt: null,
    specialDiscount: 0,
    referralCode,
    referralBalance: 0,
    referredBy: referrerUid ? referredBy.trim() : null,
    referrerUid: referrerUid || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // If there's a valid referrer, log it in referrals collection
  if (referrerUid) {
    try {
      const { collection, addDoc } = await import("firebase/firestore");
      await addDoc(collection(firebaseDb, "referrals"), {
        referrerUid,
        referredUid: userCredential.user.uid,
        referredName: fullName,
        referredEmail: email,
        status: "registered",
        commissionPaid: 0,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error creating referral record:", err);
    }
  }

  // Create server session
  const idToken = await userCredential.user.getIdToken();
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  return userCredential.user;
}

/**
 * Sign out from Firebase and destroy the server session.
 */
export async function signOut() {
  await firebaseSignOut(firebaseAuth);
  await fetch("/api/auth/session", { method: "DELETE" });
}

/**
 * Get user role from Firestore.
 */
export async function getUserRole(uid: string): Promise<string> {
  try {
    const userDoc = await getDoc(doc(firebaseDb, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data()?.role || "customer";
    }
  } catch {
    // Firestore error, default
  }
  return "customer";
}

/**
 * Subscribe to auth state changes.
 */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(firebaseAuth, callback);
}
