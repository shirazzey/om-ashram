import { sql } from "@vercel/postgres"
import { type NextRequest, NextResponse } from "next/server"
import type { Resident } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const result = await sql<Resident>`
      SELECT * FROM residents WHERE id = ${id} OR slug = ${id}
    `

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Resident not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Resident GET error:", error)
    return NextResponse.json({ error: "Failed to fetch resident" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, role, age, bio, photo_url, youtube_url } = body

    // Check if exists
    const existing = await sql`
      SELECT id FROM residents WHERE id = ${id} OR slug = ${id}
    `

    if (existing.rows.length === 0) {
      return NextResponse.json({ error: "Resident not found" }, { status: 404 })
    }

    const actualId = existing.rows[0].id

    const result = await sql<Resident>`
      UPDATE residents
      SET name = COALESCE(${name}, name),
          role = COALESCE(${role}, role),
          age = COALESCE(${age}, age),
          bio = COALESCE(${bio}, bio),
          photo_url = COALESCE(${photo_url}, photo_url),
          youtube_url = COALESCE(${youtube_url}, youtube_url),
          updated_at = now()
      WHERE id = ${actualId}
      RETURNING *
    `

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Resident PUT error:", error)
    return NextResponse.json({ error: "Failed to update resident" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const result = await sql`
      DELETE FROM residents WHERE id = ${id} OR slug = ${id}
      RETURNING id
    `

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Resident not found" }, { status: 404 })
    }

    return NextResponse.json({}, { status: 204 })
  } catch (error) {
    console.error("Resident DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete resident" }, { status: 500 })
  }
}
