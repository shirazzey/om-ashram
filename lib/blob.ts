import { put } from "@vercel/blob"

export interface BlobUploadOptions {
  filename: string
  contentType: string
  file: ArrayBuffer
}

/**
 * Uploads a file to Vercel Blob and returns the public URL
 */
export async function uploadToBlob(options: BlobUploadOptions): Promise<string> {
  const { filename, contentType, file } = options

  const blob = await put(filename, file, {
    contentType,
    access: "public",
  })

  return blob.publicUrl
}

/**
 * Validates image file type and size
 */
export function validateImageFile(file: File, maxSizeMB = 5): { valid: boolean; error?: string } {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: "Invalid image type. Only JPEG, PNG, WebP, and GIF are allowed." }
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File too large. Maximum size is ${maxSizeMB}MB.` }
  }

  return { valid: true }
}

/**
 * Generates a unique filename for blob storage
 */
export function generateBlobFilename(originalName: string, prefix: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const ext = originalName.split(".").pop()
  return `${prefix}-${timestamp}-${random}.${ext}`
}
