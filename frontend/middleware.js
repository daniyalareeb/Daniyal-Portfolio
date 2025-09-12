import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;
  
  // Only protect admin routes
  if (url.pathname.startsWith("/admin")) {
    // Skip authentication for the auth page itself and logout
    if (url.pathname === "/admin/auth" || url.pathname === "/admin/logout") {
      return NextResponse.next();
    }
    
    // Check for existing session cookie
    const sessionCookie = req.cookies.get('admin_session');
    if (sessionCookie?.value) {
      try {
        // For JWT tokens, we can't easily validate them in middleware
        // So we'll just check if the cookie exists and let the backend validate
        // The backend will return 401 if the token is invalid
        return NextResponse.next();
      } catch (e) {
        // Invalid session data, continue to auth
        console.log('Session cookie parsing error:', e);
      }
    }
    
    // If no session cookie, redirect to auth page
    return NextResponse.redirect(new URL("/admin/auth", url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin"
  ]
};
