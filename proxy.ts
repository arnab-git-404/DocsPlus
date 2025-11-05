import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

// Define route patterns
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/activate",
  "/reset-password",
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/activate",
  "/api/auth/verify-token",
  "/api/auth/password/reset-password",
  "/api/auth/password/request-reset-password",
  "/_next",
  "/favicon.ico",
  "/logo.jpeg",
  "/public",
];

const ADMIN_ONLY_ROUTES = [
  "/dashboard/admin",
  "/api/admin",
  "/api/invoice",
  "/api/offer-letter",
  "/api/salary-slip",
];

const EMPLOYEE_ROUTES = ["/dashboard/employee"];

// Helper function to check if path matches pattern
function matchesPattern(path: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    if (pattern.endsWith("*")) {
      return path.startsWith(pattern.slice(0, -1));
    }
    return path === pattern || path.startsWith(pattern + "/");
  });
}

// Helper function to verify JWT token
async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value;

  // If user is authenticated and trying to access auth pages
if (token && (pathname === "/login" || pathname === "/signup")) {
  const payload = await verifyToken(token);
  
  if (payload) {
    const userRole = payload.role as string;
    
    // Redirect to role-specific dashboard
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard/employee", request.url));
    }
  }
}

  // Allow public routes
  if (matchesPattern(pathname, PUBLIC_ROUTES)) {
    return NextResponse.next();
  }


  // If no token, redirect to login
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  const payload = await verifyToken(token);

  if (!payload) {
    // Invalid token
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Clear invalid token and redirect
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth-token");
    return response;
  }

  const userRole = payload.role as string;

  // ADMIN role validation
  if (matchesPattern(pathname, ADMIN_ONLY_ROUTES)) {
    if (userRole !== "ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Forbidden - Admin access only" },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL("/dashboard/employee", request.url));
    }
  }

  // EMPLOYEE role validation - prevent accessing admin routes
  if (userRole === "EMPLOYEE" && pathname.startsWith("/dashboard/admin")) {
    return NextResponse.redirect(new URL("/dashboard/employee", request.url));
  }

  
  // Redirect root dashboard to role-specific dashboard
  if (pathname === "/dashboard") {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard/employee", request.url));
    }
  }

    

  // Add user info to request headers (for API routes to access)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", payload.userId as string);
  requestHeaders.set("x-user-role", userRole);
  requestHeaders.set("x-user-email", payload.email as string);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
