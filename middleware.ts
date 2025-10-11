import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to auth pages without authentication
  if (pathname.startsWith('/auth/')) {
    return NextResponse.next();
  }
  
  // Allow access to API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Allow access to static files
  if (pathname.startsWith('/_next/') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }
  
  // Check for authentication token in cookies
  const authToken = request.cookies.get('auth-token');
  
  // If no auth token and trying to access main app, redirect to signin
  if (!authToken) {
    return NextResponse.redirect(new URL('/auth/simple-signin', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/((?!auth|api|_next/static|_next/image|favicon.ico).*)',
  ],
};
