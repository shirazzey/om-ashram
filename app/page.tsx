import { sql } from "@vercel/postgres"
import { Header } from "@/components/header"
import { NewsletterCard } from "@/components/newsletter-card"
import { ProfilePreview } from "@/components/profile-preview"
import Link from "next/link"
import type { NewsletterPost, Resident } from "@/lib/types"

export default async function HomePage() {
  let newsletters: NewsletterPost[] = []
  let residents: Resident[] = []
  const isConfigured = !!process.env.POSTGRES_URL

  if (isConfigured) {
    try {
      const newsletterResult = await sql<NewsletterPost>`
        SELECT * FROM newsletter_posts
        ORDER BY created_at DESC
        LIMIT 3
      `
      newsletters = newsletterResult.rows

      const residentResult = await sql<Resident>`
        SELECT * FROM residents
        ORDER BY created_at DESC
        LIMIT 4
      `
      residents = residentResult.rows
    } catch (error) {
      console.error("[v0] Failed to fetch content:", error)
      console.warn("[v0] Make sure POSTGRES_URL uses a pooled connection string (ending with ?sslmode=require)")
    }
  }

  return (
    <>
      <Header />
      <main className="container-mobile">
        {/* Vintage date header */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Newsletter section */}
        <section className="mb-12">
          <h2 className="serif-heading text-3xl mb-6">Latest Newsletters</h2>
          {newsletters.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 mb-6">
                {newsletters.map((post) => (
                  <NewsletterCard key={post.id} post={post} />
                ))}
              </div>
              <Link href="/newsletter" className="btn-primary">
                View All Events & Newsletters →
              </Link>
            </>
          ) : (
            <p className="text-muted-foreground">No newsletters yet</p>
          )}
        </section>

        {/* Profiles section */}
        <section className="mb-8">
          <h2 className="serif-heading text-3xl mb-6">Community Members</h2>
          {residents.length > 0 ? (
            <>
              <div className="space-y-4 mb-6">
                {residents.map((resident) => (
                  <ProfilePreview key={resident.id} resident={resident} />
                ))}
              </div>
              <Link href="/profiles" className="btn-primary">
                See All Profiles →
              </Link>
            </>
          ) : (
            <p className="text-muted-foreground">No profiles yet</p>
          )}
        </section>
      </main>
    </>
  )
}
