import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define which routes require authentication
const protectedRoutes = ["/dashboard", "/generate", "/itinerary"]

export function middleware(request: NextRequest) {
  const session = request.cookies.get("firebase-auth-token")
  const { pathname } = request.nextUrl

  console.log("Middleware processing route:", pathname)

  // Check if the route is protected and user is not authenticated
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute && !session) {
    // Redirect to sign-in page if trying to access protected route without authentication
    const url = new URL("/signin", request.url)
    url.searchParams.set("callbackUrl", encodeURI(pathname))
    console.log("Redirecting unauthenticated user to:", url.toString())
    return NextResponse.redirect(url)
  }

  // Explicitly handle itinerary routes
  if (pathname.match(/^\/itinerary\/[^/]+$/)) {
    console.log("Base itinerary route detected, continuing to page handler")
  }

  if (pathname.match(/^\/itinerary\/[^/]+\/view$/)) {
    console.log("View itinerary route detected, continuing to page handler")
  }

  if (pathname.match(/^\/itinerary\/[^/]+\/view\/pdf$/)) {
    console.log("PDF itinerary route detected, continuing to page handler")
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/generate/:path*", "/itinerary/:path*"],
}
