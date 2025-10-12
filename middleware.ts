import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
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
  
  // Check for NextAuth session token
  // Note: Middleware can't access process.env.NEXTAUTH_SECRET directly
  // So we need to hardcode it or use a different approach
  const token = await getToken({ 
    req: request,
    secret: "776ac261bf6a78f244791e5ce72a1c9ff07a10aecd9665aab7b4cf7690a70144"
  });
  
  // If no token and trying to access main app, redirect to signin
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/((?!auth|api|_next/static|_next/image|favicon.ico).*)',
  ],
};