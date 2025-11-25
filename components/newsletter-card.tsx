import Link from "next/link"
import type { NewsletterPost } from "@/lib/types"

interface NewsletterCardProps {
  post: NewsletterPost
}

export function NewsletterCard({ post }: NewsletterCardProps) {
  return (
    <article className="card-minimal overflow-hidden hover:shadow-lg transition-shadow">
      {/* Newsletter image */}
      <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-4">
        <img src={post.photo_url || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="serif-heading text-lg line-clamp-2">{post.title}</h3>
          {post.date && <span className="text-xs text-muted-foreground whitespace-nowrap">{post.date}</span>}
        </div>

        {post.category && <p className="text-xs font-semibold text-accent uppercase tracking-wide">{post.category}</p>}

        <p className="text-sm text-foreground line-clamp-2">{post.summary}</p>

        <Link
          href={`/newsletter/${post.slug || post.id}`}
          className="inline-block text-sm font-medium text-primary hover:text-accent mt-2"
        >
          Read More →
        </Link>
      </div>
    </article>
  )
}
