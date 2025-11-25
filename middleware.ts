import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Protect /admin routes
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const adminAuth = request.cookies.get("admin-auth")?.value

    if (!adminAuth || adminAuth !== "valid") {
      // Redirect to login
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
