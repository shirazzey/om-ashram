"use client"

import type React from "react"

import { useState } from "react"
import type { Resident } from "@/lib/types"
import { FileUpload } from "@/components/file-upload"

interface ResidentFormProps {
  initial?: Resident
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function ResidentForm({ initial, onSubmit, isLoading }: ResidentFormProps) {
  const [formData, setFormData] = useState({
    name: initial?.name || "",
    role: initial?.role || "",
    age: initial?.age ? String(initial.age) : "",
    bio: initial?.bio || "",
    photo_url: initial?.photo_url || "",
    youtube_url: initial?.youtube_url || "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit({
      ...formData,
      age: formData.age ? Number.parseInt(formData.age) : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-primary mb-2">Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Role</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="e.g., Director, Founder"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Age</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            min="1"
            max="150"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-2">Biography *</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent min-h-40"
          required
          disabled={isLoading}
          placeholder="Full biography"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-2">Profile Photo *</label>
        <FileUpload
          prefix="resident"
          preview={formData.photo_url}
          isLoading={isLoading}
          onUpload={(url) => setFormData({ ...formData, photo_url: url })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-2">YouTube Embed URL</label>
        <input
          type="url"
          value={formData.youtube_url}
          onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="https://www.youtube.com/embed/..."
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={isLoading || !formData.photo_url} className="btn-primary disabled:opacity-50">
          {isLoading ? "Saving..." : initial ? "Update Resident" : "Create Resident"}
        </button>
      </div>
    </form>
  )
}
