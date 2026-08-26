import { NextResponse } from "next/server";

// Answers CORS preflight (OPTIONS) requests for every /api/* route.
// Without this, the browser's preflight check gets a 405 from Next.js
// (since none of the route.js files export an OPTIONS handler), the
// preflight fails, and the actual GET/POST/etc. never goes out — which
// shows up in the frontend as a generic "Failed to fetch".
export function proxy(request) {
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};