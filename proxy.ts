// ============================================================
// AA AI GROUP — Proxy (Route Protection)
// ============================================================
// Next.js 16: middleware.ts is deprecated → use proxy.ts
// Uses Firebase session cookie (__session) for auth checks.
// ============================================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/admin", "/checkout"];

// Auth routes that should redirect to dashboard if already logged in
const authRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Firebase uses "__session" as the cookie name
  const sessionCookie = request.cookies.get("__session")?.value;

  // Check if user is accessing a protected route without a session
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files, API routes, and metadata files
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
