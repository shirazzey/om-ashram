# NGO Newsletter & Profiles App

A mobile-first Next.js app for managing newsletters and resident profiles using Vercel Postgres and Vercel Blob storage.

## Quick Setup

### 1. Vercel Postgres - Important!

When setting up Vercel Postgres, you must use a **pooled connection string**:

- Go to your Vercel project → Postgres integration
- Copy the **"Pooled Connection String"** (NOT the direct connection string)
- It should end with `?sslmode=require`
- Set this as `POSTGRES_URL` in your environment variables

### 2. Environment Variables

Add these to your Vercel project (**Settings** → **Environment Variables**):

\`\`\`
POSTGRES_URL=postgresql://user:password@... (POOLED connection)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
BLOB_PUBLIC_URL=https://your-blob-url.vercel-storage.com
ADMIN_PASSWORD=your-secure-password
\`\`\`

### 3. Create Database Tables

Run this SQL in your Vercel Postgres dashboard (SQL editor tab):

\`\`\`sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS newsletter_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  date TEXT,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  role TEXT,
  age INTEGER,
  bio TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  youtube_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_created ON newsletter_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_resident_created ON residents(created_at);
\`\`\`

### 4. Start Using the App

- **Public Site**: `/` (Homepage with featured newsletters and profiles)
- **Admin Login**: `/admin/login` (Use your `ADMIN_PASSWORD`)
- **Newsletters**: `/newsletter` (View all newsletters)
- **Profiles**: `/profiles` (View all community members)

## Features

### Public Pages
- **Homepage**: Featured newsletters and community members
- **Newsletter Listing**: All newsletters with pagination
- **Newsletter Detail**: Full content with featured image
- **Profile Listing**: All community members
- **Profile Detail**: Full profile with photo, role, bio, and embedded YouTube

### Admin Dashboard (`/admin/login`)

**Newsletter Management**:
- Create/edit/delete newsletters
- Upload featured images directly to Vercel Blob
- Fields: title, date, category, summary, content, photo

**Resident Profile Management**:
- Create/edit/delete resident profiles
- Upload profile photos to Vercel Blob
- Fields: name, role, age, biography, photo, YouTube URL

### File Uploads
- Images upload directly to Vercel Blob storage
- Automatic validation (JPEG, PNG, WebP, GIF only)
- Max file size: 5MB
- Unique filenames with timestamps
- Public URLs stored in database

## API Endpoints

**Newsletters**:
- `GET /api/newsletter` - List all (supports `limit` and `offset`)
- `POST /api/newsletter` - Create
- `GET /api/newsletter/:id` - Get single
- `PUT /api/newsletter/:id` - Update
- `DELETE /api/newsletter/:id` - Delete

**Residents**:
- `GET /api/residents` - List all (supports `limit` and `offset`)
- `POST /api/residents` - Create
- `GET /api/residents/:id` - Get single
- `PUT /api/residents/:id` - Update
- `DELETE /api/residents/:id` - Delete

**Upload**:
- `POST /api/upload?prefix=newsletter` - Upload image
- `POST /api/upload?prefix=resident` - Upload image

## Design

- **Mobile-first** responsive layout
- **Colors**: Dark brown (#3B2F2F), beige (#F5EDE3), medium brown (#5C4033), white
- **Typography**: Georgia (serif) for headings, Inter for body
- **Vintage aesthetic** with light animations

## Troubleshooting

### Database Connection Error
- Make sure you're using the **pooled connection string** (not direct)
- Pooled string ends with `?sslmode=require`

### No data showing up
- Run the SQL initialization in Vercel Postgres dashboard
- Check that `POSTGRES_URL` is set correctly
- Try refreshing the page

### File upload not working
- Verify `BLOB_READ_WRITE_TOKEN` is set
- Check file size is under 5MB
- Only JPEG, PNG, WebP, GIF formats supported

## Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Add all environment variables
4. Run SQL initialization
5. Deploy!

The app uses Vercel's native integrations so no additional setup needed.
\`\`\`
