"use client"

import type React from "react"

import { useState } from "react"
import type { NewsletterPost } from "@/lib/types"
import { FileUpload } from "@/components/file-upload"

interface NewsletterFormProps {
  initial?: NewsletterPost
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function NewsletterForm({ initial, onSubmit, isLoading }: NewsletterFormProps) {
  const [formData, setFormData] = useState({
    title: initial?.title || "",
    date: initial?.date || "",
    category: initial?.category || "",
    summary: initial?.summary || "",
    content: initial?.content || "",
    photo_url: initial?.photo_url || "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-primary mb-2">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Date</label>
          <input
            type="text"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="e.g., 15 Nov 2025"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Category *</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            required
            disabled={isLoading}
            placeholder="e.g., News, Event"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-2">Summary *</label>
        <textarea
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent min-h-20"
          required
          disabled={isLoading}
          placeholder="Brief summary of the newsletter"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-2">Full Content *</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent min-h-40"
          required
          disabled={isLoading}
          placeholder="Full newsletter content"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-2">Newsletter Photo *</label>
        <FileUpload
          prefix="newsletter"
          preview={formData.photo_url}
          isLoading={isLoading}
          onUpload={(url) => setFormData({ ...formData, photo_url: url })}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={isLoading || !formData.photo_url} className="btn-primary disabled:opacity-50">
          {isLoading ? "Saving..." : initial ? "Update Newsletter" : "Create Newsletter"}
        </button>
      </div>
    </form>
  )
}
