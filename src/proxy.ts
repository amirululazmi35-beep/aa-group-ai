import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionId = request.cookies.get('aa_session_id')?.value;

  // Lindungi Laluan Admin
  if (pathname.startsWith('/admin')) {
    // Abaikan halaman log masuk admin
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }
    if (!sessionId) {
      return NextResponse.redirect(new URL('/login?role=admin', request.url));
    }
  }

  // Lindungi Laluan Dashboard Pelanggan
  if (pathname.startsWith('/dashboard')) {
    if (!sessionId) {
      return NextResponse.redirect(new URL('/login?role=customer', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
