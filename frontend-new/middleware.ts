/**
 * Next.js Middleware for Authentication and Route Protection
 *
 * This middleware handles:
 * - Authentication state validation
 * - Protected route access control
 * - Redirect logic for authenticated/unauthenticated users
 * - Public route access
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route configuration
 */
const PUBLIC_ROUTES = [
  "/",
  "/health",
  "/demo",
  "/demo/achievements",
  "/demo/celebrations",
  "/demo/data-visualization",
];

const AUTH_ROUTES = ["/login", "/callback", "/register"];

const PROTECTED_ROUTES = [
  "/projects",
  "/leaderboard",
  "/xp",
  "/skills",
  "/profile",
  "/settings",
  "/achievements",
];

/**
 * Check if the user is authenticated by looking for auth token
 */
function isAuthenticated(request: NextRequest): boolean {
  // Check for auth token in cookies
  const authToken = request.cookies.get("auth_token")?.value;

  if (authToken) {
    return true;
  }

  // Fallback: Check localStorage via custom header (set by client)
  // This is useful for initial page loads where cookie might not be set yet
  const clientAuthState = request.headers.get("x-auth-state");
  if (clientAuthState === "authenticated") {
    return true;
  }

  return false;
}

/**
 * Check if route matches a pattern
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    // Exact match
    if (pathname === route) return true;

    // Prefix match for nested routes (e.g., /projects/123)
    if (pathname.startsWith(route + "/")) return true;

    return false;
  });
}

/**
 * Middleware function
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all API routes and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|css|js|json|xml|txt)$/)
  ) {
    return NextResponse.next();
  }

  const authenticated = isAuthenticated(request);

  // Handle auth routes (login, register, callback)
  if (matchesRoute(pathname, AUTH_ROUTES)) {
    if (authenticated) {
      // Redirect authenticated users away from auth pages to dashboard
      const dashboardUrl = new URL("/projects", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    // Allow unauthenticated users to access auth pages
    return NextResponse.next();
  }

  // Handle protected routes
  if (matchesRoute(pathname, PROTECTED_ROUTES)) {
    if (!authenticated) {
      // Redirect unauthenticated users to login
      const loginUrl = new URL("/login", request.url);
      // Store the original URL to redirect back after login
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Allow authenticated users to access protected routes
    return NextResponse.next();
  }

  // Handle public routes (always allow)
  if (matchesRoute(pathname, PUBLIC_ROUTES)) {
    return NextResponse.next();
  }

  // Default: allow access to any other routes
  return NextResponse.next();
}

/**
 * Matcher configuration
 * This defines which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
