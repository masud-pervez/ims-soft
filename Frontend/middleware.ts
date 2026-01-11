import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define paths that do not require authentication
const publicPaths = ["/login", "/signup", "/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // Or however you store the token in cookies on the client side

  // NOTE: Integrating with Zustand in middleware is not directly possible because middleware runs on the Edge.
  // We rely on cookies for the token check in middleware.
  // Ensure your authentication logic sets a cookie named "token" (or similar) upon login.
  // If you are only using localStorage, middleware cannot access it.
  // For strict middleware protection, you MUST use cookies.

  // Assuming strict cookie-based auth is a future or parallel goal given "first of all add middleware".
  // For now, I will implement the logic. If token is missing from cookies, valid logic applies.
  // User might need to ensure cookies are set.

  const { pathname } = request.nextUrl;

  // Check if the path is public
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // If the user has a token and tries to access authentication pages, redirect to overview
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  // If the user is not authenticated and tries to access a protected route
  // Protected routes are all routes EXCEPT public paths, static files, and api routes (optional)
  if (!isPublicPath && !token) {
    // Exclude static assets/api if needed to avoid loops or broken assets
    if (
      !pathname.startsWith("/_next") &&
      !pathname.startsWith("/api") &&
      !pathname.startsWith("/favicon.ico") &&
      !pathname.includes(".") // rudimentary check for files like images
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect root to overview (which will then be protected or allowed)
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
