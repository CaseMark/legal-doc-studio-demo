/**
 * Next.js Middleware for Route Protection
 *
 * Protects routes by checking for authentication before allowing access.
 * Uncomment and configure as needed for your application.
 *
 * @see skills/auth/SKILL.md for detailed documentation
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Routes that don't require authentication
 * Add public routes here (marketing pages, login, signup, etc.)
 */
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/api/auth", // Better Auth API routes
];

/**
 * Check if a path matches any of the public routes
 */
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for session cookie
  // Better Auth uses "better-auth.session_token" by default
  const sessionCookie = request.cookies.get("better-auth.session_token");

  if (!sessionCookie) {
    // Redirect to login with callback URL
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/**
 * Configure which routes the middleware runs on
 *
 * This pattern excludes:
 * - _next/static (static files)
 * - _next/image (image optimization)
 * - favicon.ico
 * - public files (svg, png, jpg, etc.)
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
