-- Create tables for NGO app
-- Run this in the Vercel Postgres SQL shell

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS newsletter_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  date TEXT,
  month TEXT,
  year TEXT,
  category TEXT,
  summary TEXT,
  content TEXT,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  role TEXT,
  age INTEGER,
  bio TEXT,
  photo_url TEXT,
  youtube_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Optional: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_newsletter_date ON newsletter_posts(date);
CREATE INDEX IF NOT EXISTS idx_newsletter_category ON newsletter_posts(category);
CREATE INDEX IF NOT EXISTS idx_residents_name ON residents(name);
