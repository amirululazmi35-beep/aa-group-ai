// ============================================================
// AA AI GROUP — Auth Guard Helpers for API Routes (Firebase)
// ============================================================
// Use these in Route Handlers to validate authentication & roles.
// ============================================================

import { getCurrentUser, type AuthUser } from "@/lib/auth";

export type AuthSession = {
  user: AuthUser;
};

/**
 * Require authentication for an API route.
 * Returns the user, or throws a Response with 401.
 */
export async function requireAuth(): Promise<AuthSession> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Response(
      JSON.stringify({ error: "Unauthorized. Please log in." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  return { user };
}

/**
 * Require admin role for an API route.
 * Returns the user, or throws a Response with 401/403.
 */
export async function requireAdmin(): Promise<AuthSession> {
  const authSession = await requireAuth();

  const adminRoles = ["admin", "superadmin"];
  if (!adminRoles.includes(authSession.user.role || "")) {
    throw new Response(
      JSON.stringify({ error: "Forbidden. Admin access required." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  return authSession;
}
