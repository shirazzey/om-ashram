"use client"

import { useRef, useState } from "react"
import type React from "react"

interface FileUploadProps {
  onUpload: (url: string) => void
  isLoading?: boolean
  preview?: string
  prefix?: string
}

export function FileUpload({ onUpload, isLoading, preview, prefix = "upload" }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [previewUrl, setPreviewUrl] = useState(preview)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError("")
    setUploading(true)

    try {
      // Create local preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to blob
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`/api/upload?prefix=${prefix}`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Upload failed")
      }

      const data = await response.json()
      onUpload(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setPreviewUrl(undefined)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading || uploading}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 text-sm font-medium"
        >
          {uploading ? "Uploading..." : "Choose Image"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isLoading || uploading}
          className="hidden"
        />
      </div>

      {previewUrl && (
        <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-border">
          <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
