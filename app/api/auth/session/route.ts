// ============================================================
// AA AI GROUP — Auth Session API (Firebase)
// ============================================================
// POST: Create session cookie from Firebase ID token
// DELETE: Destroy session cookie (logout)
// GET: Get current user info
// ============================================================

import { createSessionCookie, getCurrentUser, destroySession } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return Response.json(
        { error: "ID token is required" },
        { status: 400 }
      );
    }

    await createSessionCookie(idToken);

    // Get user role
    const user = await getCurrentUser();
    const role = user?.role || "customer";

    return Response.json({
      success: true,
      role,
      redirect: role === "admin" || role === "superadmin" ? "/admin" : "/dashboard",
    });
  } catch (error: any) {
    console.error("Session creation error:", error);
    return Response.json(
      { error: "Failed to create session" },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  try {
    await destroySession();
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Session deletion error:", error);
    return Response.json(
      { error: "Failed to destroy session" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    return Response.json({ user });
  } catch (error: any) {
    return Response.json(
      { error: "Failed to get user" },
      { status: 500 }
    );
  }
}
