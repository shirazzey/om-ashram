import { sql } from "@vercel/postgres"

export const db = {
  query: async (query: string, values?: any[]) => {
    if (!process.env.POSTGRES_URL) {
      console.warn("[v0] POSTGRES_URL not configured. Set it in your Vercel environment variables.")
      return { rows: [] }
    }
    try {
      return await sql.query(query, values)
    } catch (error) {
      console.error("[v0] Database query error:", error)
      throw error // Re-throw to let caller handle
    }
  },
}

// Helper function to generate URL-friendly slugs
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

// Helper to format dates
export function formatDateUS(date: string): string {
  const d = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return d.toLocaleDateString("en-US", options)
}
