import { sql } from "@vercel/postgres"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import Link from "next/link"
import type { NewsletterPost } from "@/lib/types"

export default async function NewsletterDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params

  let post: NewsletterPost | null = null

  try {
    const result = await sql<NewsletterPost>`
      SELECT * FROM newsletter_posts WHERE slug = ${slug} OR id = ${slug}
    `
    if (result.rows.length > 0) {
      post = result.rows[0]
    }
  } catch (error) {
    console.error("Failed to fetch newsletter:", error)
  }

  if (!post) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="container-mobile max-w-2xl mx-auto">
        {/* Back link */}
        <Link href="/newsletter" className="text-sm text-primary hover:text-accent mb-6 inline-block">
          ← Back to Newsletters
        </Link>

        {/* Header */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">{post.category}</p>
          <h1 className="serif-heading text-3xl lg:text-4xl mb-4">{post.title}</h1>
          <p className="text-sm text-muted-foreground">{post.date && <span>{post.date}</span>}</p>
        </div>

        {/* Featured image */}
        <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-8">
          <img src={post.photo_url || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <article className="prose prose-sm max-w-none text-foreground space-y-4 mb-8">
          {post.content.split("\n\n").map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed text-base">
              {paragraph}
            </p>
          ))}
        </article>

        {/* Footer */}
        <div className="border-t border-border pt-6 mt-12">
          <Link href="/newsletter" className="btn-secondary">
            ← Back to All Newsletters
          </Link>
        </div>
      </main>
    </>
  )
}
