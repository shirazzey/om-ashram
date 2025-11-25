import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Validate password
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Set auth cookie
    const response = NextResponse.json({ success: true })

    // Manually set the cookie using Set-Cookie header
    const cookieValue = "valid"
    response.headers.set(
      "Set-Cookie",
      `admin-auth=${cookieValue}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`,
    )

    return response
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
