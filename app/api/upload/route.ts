import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { validateImageFile, generateBlobFilename } from "@/lib/blob"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file
    const validation = validateImageFile(file, 5)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Get prefix from query (newsletter or resident)
    const prefix = request.nextUrl.searchParams.get("prefix") || "upload"

    // Generate unique filename
    const filename = generateBlobFilename(file.name, prefix)

    // Convert file to buffer
    const buffer = await file.arrayBuffer()

    // Upload to Blob
    const blob = await put(filename, buffer, {
      contentType: file.type,
      access: "public",
    })

    return NextResponse.json({
      url: blob.publicUrl,
      pathname: blob.pathname,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
