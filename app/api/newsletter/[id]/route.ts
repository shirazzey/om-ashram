import { sql } from "@vercel/postgres"
import { type NextRequest, NextResponse } from "next/server"
import type { NewsletterPost } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const result = await sql<NewsletterPost>`
      SELECT * FROM newsletter_posts WHERE id = ${id} OR slug = ${id}
    `

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Newsletter not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Newsletter GET by ID error:", error)
    return NextResponse.json({ error: "Failed to fetch newsletter" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, date, month, year, category, summary, content, photo_url } = body

    // Check if exists
    const existing = await sql`
      SELECT id FROM newsletter_posts WHERE id = ${id} OR slug = ${id}
    `

    if (existing.rows.length === 0) {
      return NextResponse.json({ error: "Newsletter not found" }, { status: 404 })
    }

    const actualId = existing.rows[0].id

    const result = await sql<NewsletterPost>`
      UPDATE newsletter_posts
      SET title = COALESCE(${title}, title),
          date = COALESCE(${date}, date),
          month = COALESCE(${month}, month),
          year = COALESCE(${year}, year),
          category = COALESCE(${category}, category),
          summary = COALESCE(${summary}, summary),
          content = COALESCE(${content}, content),
          photo_url = COALESCE(${photo_url}, photo_url),
          updated_at = now()
      WHERE id = ${actualId}
      RETURNING *
    `

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Newsletter PUT error:", error)
    return NextResponse.json({ error: "Failed to update newsletter" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const result = await sql`
      DELETE FROM newsletter_posts WHERE id = ${id} OR slug = ${id}
      RETURNING id
    `

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Newsletter not found" }, { status: 404 })
    }

    return NextResponse.json({}, { status: 204 })
  } catch (error) {
    console.error("Newsletter DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete newsletter" }, { status: 500 })
  }
}
