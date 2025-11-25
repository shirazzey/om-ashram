export interface NewsletterPost {
  id: string
  slug: string
  title: string
  date: string
  month?: string
  year?: string
  category: string
  summary: string
  content: string
  photo_url: string
  created_at: string
  updated_at: string
}

export interface Resident {
  id: string
  slug: string
  name: string
  role: string
  age?: number
  bio: string
  photo_url: string
  youtube_url?: string
  created_at: string
  updated_at: string
}
