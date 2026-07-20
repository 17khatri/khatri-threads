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

const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/send-otp",
  "/api/auth/verify-otp",
];

const ADMIN_ROUTES = ["/users", "/categories"];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

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
  const isAdminRoute = ADMIN_ROUTES.some((route) =>
    matchesRoute(pathname, route),
  );

  // 3. Handle APIs
  if (isApiRoute) {
    const isAdminApi =
      matchesRoute(pathname, "/api/users") ||
      matchesRoute(pathname, "/api/categories");

    if (isAdminApi && !isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isAdminApi && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Private authentication endpoints, such as logout and current-user lookup,
    // still require a valid session. All storefront APIs remain public by default.
    if (pathname.startsWith("/api/auth") && !isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  }

  // 4. Storefront and authentication pages are public. Only admin pages
  // require a session and an ADMIN role.
  if (isAdminRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
