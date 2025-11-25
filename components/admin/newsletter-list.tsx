"use client"

import { useState, useEffect } from "react"
import type { NewsletterPost } from "@/lib/types"

interface NewsletterListProps {
  onEdit?: (newsletter: NewsletterPost) => void
}

export function NewsletterList({ onEdit }: NewsletterListProps) {
  const [newsletters, setNewsletters] = useState<NewsletterPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNewsletters()
  }, [])

  async function fetchNewsletters() {
    try {
      const response = await fetch("/api/newsletter?limit=50")
      const result = await response.json()
      setNewsletters(result.data || [])
    } catch (error) {
      console.error("Error fetching:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this newsletter?")) return

    try {
      const response = await fetch(`/api/newsletter/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setNewsletters(newsletters.filter((n) => n.id !== id))
      }
    } catch (error) {
      console.error("Error deleting:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-4">
      {newsletters.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No newsletters yet</p>
      ) : (
        <div className="space-y-2">
          {newsletters.map((post) => (
            <div key={post.id} className="card-minimal flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-primary truncate">{post.title}</h4>
                <p className="text-xs text-muted-foreground">{post.category}</p>
              </div>
              <div className="flex gap-2 ml-4 flex-shrink-0">
                <button
                  onClick={() => onEdit?.(post)}
                  className="text-sm px-3 py-1 rounded bg-accent text-primary hover:opacity-80"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-sm px-3 py-1 rounded bg-red-100 text-red-700 hover:opacity-80"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
