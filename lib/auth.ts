import { cookies } from "next/headers"

const SECRET = new TextEncoder().encode(process.env.ADMIN_PASSWORD || "secret")

export async function checkAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin-auth")?.value

    if (!token) return false

    // Simple validation: token should equal 'valid'
    return token === "valid"
  } catch (error) {
    return false
  }
}

export async function setAdminCookie() {
  const cookieStore = await cookies()
  cookieStore.set("admin-auth", "valid", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function clearAdminCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("admin-auth")
}
