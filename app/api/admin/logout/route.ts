import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true })

  // Clear the admin-auth cookie
  response.headers.set("Set-Cookie", "admin-auth=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0")

  return response
}
