import { sql } from "@vercel/postgres"
import { Header } from "@/components/header"
import { ProfilePreview } from "@/components/profile-preview"
import type { Resident } from "@/lib/types"

export const metadata = {
  title: "Profiles",
  description: "Community member profiles",
}

export default async function ProfilesPage() {
  let residents: Resident[] = []
  const isConfigured = !!process.env.POSTGRES_URL

  if (isConfigured) {
    try {
      const result = await sql<Resident>`
        SELECT * FROM residents
        ORDER BY created_at DESC
        LIMIT 100
      `
      residents = result.rows
    } catch (error) {
      console.error("[v0] Failed to fetch residents:", error)
    }
  }

  return (
    <>
      <Header />
      <main className="container-mobile">
        {/* Header */}
        <div className="mb-8">
          <h1 className="serif-heading text-4xl text-primary mb-2">Community Members</h1>
          <p className="text-muted-foreground">Get to know the people in our community</p>
        </div>

        {/* Profiles list */}
        {residents.length > 0 ? (
          <div className="space-y-4">
            {residents.map((resident) => (
              <ProfilePreview key={resident.id} resident={resident} />
            ))}
          </div>
        ) : (
          <div className="card-minimal text-center py-12">
            <p className="text-muted-foreground">No profiles yet</p>
          </div>
        )}
      </main>
    </>
  )
}
