import { sql } from "@vercel/postgres"
import { type NextRequest, NextResponse } from "next/server"
import { generateSlug } from "@/lib/db"
import type { Resident } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "10"), 100)
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const result = await sql<Resident>`
      SELECT * FROM residents
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    return NextResponse.json({
      data: result.rows,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Residents GET error:", error)
    return NextResponse.json({ error: "Failed to fetch residents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, role, age, bio, photo_url, youtube_url } = body

    // Validate required fields
    if (!name || !bio || !photo_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const slug = generateSlug(name)

    const result = await sql<Resident>`
      INSERT INTO residents (slug, name, role, age, bio, photo_url, youtube_url)
      VALUES (${slug}, ${name}, ${role || null}, ${age || null}, ${bio}, ${photo_url}, ${youtube_url || null})
      RETURNING *
    `

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Residents POST error:", error)
    return NextResponse.json({ error: "Failed to create resident" }, { status: 500 })
  }
}
