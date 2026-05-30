// ============================================================
// AA AI GROUP — Digital Access Management API
// ============================================================
// GET: Fetch digital access records (admin or owner only)
// ============================================================

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.role === "admin" || user.role === "superadmin";
    let query = adminDb.collection("digital_access").orderBy("createdAt", "desc");

    // Customers only see their own active digital access records
    if (!isAdmin) {
      query = query.where("userId", "==", user.uid).where("status", "==", "active");
    }

    const snapshot = await query.get();
    const digitalAccesses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
      expiresAt: doc.data().expiresAt?.toDate?.()?.toISOString() || null,
    }));

    return Response.json({ digitalAccesses });
  } catch (error: any) {
    console.error("Fetch digital access error:", error);
    return Response.json({ error: "Failed to fetch digital access records" }, { status: 500 });
  }
}
