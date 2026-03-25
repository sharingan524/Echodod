/**
 * Next.js Middleware
 * - Propagates a unique X-Request-ID on every request (generated if absent)
 * - Logs API requests with method, path, and duration for observability
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const start = Date.now();
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

  // Clone request headers and inject request-id for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set("X-Request-ID", requestId);

  // Log API requests (skip static assets to reduce noise)
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const durationMs = Date.now() - start;
    const logEntry = {
      level: "info",
      message: "api_request",
      timestamp: new Date().toISOString(),
      context: {
        method: request.method,
        path: request.nextUrl.pathname,
        requestId,
        durationMs,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    };

    if (process.env.NODE_ENV === "production") {
      console.log(JSON.stringify(logEntry));
    } else {
      console.log(
        `[API] ${request.method} ${request.nextUrl.pathname} (${durationMs}ms) [${requestId.slice(0, 8)}]`
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match API routes
    "/api/:path*",
    // Match app routes (skip static files, _next assets, favicon)
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
