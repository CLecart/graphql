import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/_next",
  "/api",
  "/favicon.ico",
  "/assets",
  "/public",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublic) return NextResponse.next();

  const token = request.cookies.get("jwt_token")?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  // TODO: Optionally, add JWT validation here for extra security
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/profile/:path*"],
};
