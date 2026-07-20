import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/cookie";
import { verifyToken } from "@/lib/auth/jwt";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];
const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/send-otp",
  "/api/auth/verify-otp",
];

const ADMIN_ROUTES = ["/users", "/categories"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip check for public API routes
  if (PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 2. Extract and verify JWT
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  let userPayload = null;

  if (token) {
    try {
      userPayload = verifyToken(token);
    } catch {
      // Invalid token, treat as unauthenticated
    }
  }

  const isAuthenticated = !!userPayload;
  const isAdmin = userPayload?.role === "ADMIN";

  const isApiRoute = pathname.startsWith("/api");
  // The home page is available to everyone. Keep the exact-match check separate
  // so that "/" does not accidentally make every route public.
  const isHomeRoute = pathname === "/";
  const isAuthRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isPublicRoute = isHomeRoute || isAuthRoute;
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  // 3. Handle APIs
  if (isApiRoute) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Protect Admin APIs
    const isAdminApi =
      pathname.startsWith("/api/users") ||
      (pathname.startsWith("/api/categories") &&
        ["POST", "PUT", "DELETE"].includes(request.method));

    if (isAdminApi && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.next();
  }

  // 4. Handle Frontend routes
  if (!isAuthenticated) {
    // If not authenticated and trying to access a protected route, redirect to login
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // If authenticated:
  // - Redirect away from public auth pages to dashboard
  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // - Restrict admin-only pages to ADMIN users
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
