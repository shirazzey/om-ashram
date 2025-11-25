import Link from "next/link"
import type { Resident } from "@/lib/types"

interface ProfilePreviewProps {
  resident: Resident
}

export function ProfilePreview({ resident }: ProfilePreviewProps) {
  return (
    <Link href={`/profiles/${resident.slug || resident.id}`}>
      <div className="flex gap-4 p-4 rounded-lg bg-card border border-border hover:shadow-md transition-shadow cursor-pointer">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
            <img
              src={resident.photo_url || "/placeholder.svg"}
              alt={resident.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-primary font-semibold text-base">{resident.name}</h3>
          {resident.role && <p className="text-xs text-accent font-medium uppercase tracking-wide">{resident.role}</p>}
          <p className="text-sm text-foreground line-clamp-2 mt-1">{resident.bio}</p>
        </div>
      </div>
    </Link>
  )
}
