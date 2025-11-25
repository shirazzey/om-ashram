import { sql } from "@vercel/postgres"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import Link from "next/link"
import type { Resident } from "@/lib/types"

export default async function ProfileDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params

  let resident: Resident | null = null

  try {
    const result = await sql<Resident>`
      SELECT * FROM residents WHERE slug = ${slug} OR id = ${slug}
    `
    if (result.rows.length > 0) {
      resident = result.rows[0]
    }
  } catch (error) {
    console.error("Failed to fetch resident:", error)
  }

  if (!resident) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="container-mobile max-w-2xl mx-auto">
        {/* Back link */}
        <Link href="/profiles" className="text-sm text-primary hover:text-accent mb-6 inline-block">
          ← Back to Profiles
        </Link>

        {/* Profile image */}
        <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-8 bg-muted">
          <img
            src={resident.photo_url || "/placeholder.svg"}
            alt={resident.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile info */}
        <div className="mb-8">
          <h1 className="serif-heading text-4xl mb-2">{resident.name}</h1>
          {resident.role && (
            <p className="text-lg text-accent font-medium uppercase tracking-wide mb-4">{resident.role}</p>
          )}
          {resident.age && <p className="text-sm text-muted-foreground mb-4">Age: {resident.age}</p>}
        </div>

        {/* YouTube embed */}
        {resident.youtube_url && (
          <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-8 bg-muted">
            <iframe
              width="100%"
              height="100%"
              src={resident.youtube_url}
              title={resident.name}
              allowFullScreen
              className="absolute inset-0"
            />
          </div>
        )}

        {/* Biography */}
        <article className="prose prose-sm max-w-none text-foreground space-y-4 mb-8 leading-relaxed">
          {resident.bio.split("\n\n").map((paragraph, idx) => (
            <p key={idx} className="text-base">
              {paragraph}
            </p>
          ))}
        </article>

        {/* Footer */}
        <div className="border-t border-border pt-6 mt-12">
          <Link href="/profiles" className="btn-secondary">
            ← Back to All Profiles
          </Link>
        </div>
      </main>
    </>
  )
}
