"use client"

import { useState, useEffect } from "react"
import type { Resident } from "@/lib/types"

interface ResidentListProps {
  onEdit?: (resident: Resident) => void
}

export function ResidentList({ onEdit }: ResidentListProps) {
  const [residents, setResidents] = useState<Resident[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResidents()
  }, [])

  async function fetchResidents() {
    try {
      const response = await fetch("/api/residents?limit=50")
      const result = await response.json()
      setResidents(result.data || [])
    } catch (error) {
      console.error("Error fetching:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this resident?")) return

    try {
      const response = await fetch(`/api/residents/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setResidents(residents.filter((r) => r.id !== id))
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
      {residents.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No residents yet</p>
      ) : (
        <div className="space-y-2">
          {residents.map((resident) => (
            <div key={resident.id} className="card-minimal flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-primary truncate">{resident.name}</h4>
                <p className="text-xs text-muted-foreground">{resident.role || "No role"}</p>
              </div>
              <div className="flex gap-2 ml-4 flex-shrink-0">
                <button
                  onClick={() => onEdit?.(resident)}
                  className="text-sm px-3 py-1 rounded bg-accent text-primary hover:opacity-80"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(resident.id)}
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
