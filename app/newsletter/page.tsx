import { sql } from "@vercel/postgres"
import { Header } from "@/components/header"
import { NewsletterCard } from "@/components/newsletter-card"
import type { NewsletterPost } from "@/lib/types"

export const metadata = {
  title: "Newsletters",
  description: "All community newsletters and updates",
}

export default async function NewsletterPage() {
  let newsletters: NewsletterPost[] = []
  const isConfigured = !!process.env.POSTGRES_URL

  if (isConfigured) {
    try {
      const result = await sql<NewsletterPost>`
        SELECT * FROM newsletter_posts
        ORDER BY created_at DESC
        LIMIT 50
      `
      newsletters = result.rows
    } catch (error) {
      console.error("[v0] Failed to fetch newsletters:", error)
    }
  }

  return (
    <>
      <Header />
      <main className="container-mobile">
        {/* Vintage date header */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-2">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="serif-heading text-4xl text-primary">Newsletters & Updates</h1>
        </div>

        {/* Newsletter grid */}
        {newsletters.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {newsletters.map((post) => (
              <NewsletterCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="card-minimal text-center py-12">
            <p className="text-muted-foreground">No newsletters yet</p>
          </div>
        )}
      </main>
    </>
  )
}
