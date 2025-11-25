import { sql } from "@vercel/postgres"
import { type NextRequest, NextResponse } from "next/server"
import { generateSlug } from "@/lib/db"
import type { NewsletterPost } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "10"), 100)
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const result = await sql<NewsletterPost>`
      SELECT * FROM newsletter_posts
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    return NextResponse.json({
      data: result.rows,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Newsletter GET error:", error)
    return NextResponse.json({ error: "Failed to fetch newsletters" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, date, month, year, category, summary, content, photo_url } = body

    // Validate required fields
    if (!title || !category || !summary || !content || !photo_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const slug = generateSlug(title)

    const result = await sql<NewsletterPost>`
      INSERT INTO newsletter_posts (slug, title, date, month, year, category, summary, content, photo_url)
      VALUES (${slug}, ${title}, ${date || null}, ${month || null}, ${year || null}, ${category}, ${summary}, ${content}, ${photo_url})
      RETURNING *
    `

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Newsletter POST error:", error)
    return NextResponse.json({ error: "Failed to create newsletter" }, { status: 500 })
  }
}
