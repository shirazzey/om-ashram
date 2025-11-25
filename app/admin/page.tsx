"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { NewsletterForm } from "@/components/admin/newsletter-form"
import { NewsletterList } from "@/components/admin/newsletter-list"
import { ResidentForm } from "@/components/admin/resident-form"
import { ResidentList } from "@/components/admin/resident-list"
import type { NewsletterPost, Resident } from "@/lib/types"

type TabType = "newsletters" | "residents"
type ActionType = "list" | "create" | "edit"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("newsletters")
  const [action, setAction] = useState<ActionType>("list")
  const [selectedItem, setSelectedItem] = useState<NewsletterPost | Resident | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleNewsletterSubmit(data: any) {
    setIsLoading(true)
    try {
      const url = selectedItem && "title" in selectedItem ? `/api/newsletter/${selectedItem.id}` : "/api/newsletter"
      const method = selectedItem && "title" in selectedItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setAction("list")
        setSelectedItem(null)
        window.location.reload()
      }
    } catch (error) {
      console.error("Error submitting:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResidentSubmit(data: any) {
    setIsLoading(true)
    try {
      const url = selectedItem && "name" in selectedItem ? `/api/residents/${selectedItem.id}` : "/api/residents"
      const method = selectedItem && "name" in selectedItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setAction("list")
        setSelectedItem(null)
        window.location.reload()
      }
    } catch (error) {
      console.error("Error submitting:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    window.location.href = "/"
  }

  return (
    <>
      <Header />
      <main className="container-mobile">
        {/* Admin header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="serif-heading text-3xl">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded border border-border text-primary hover:bg-card"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => {
              setActiveTab("newsletters")
              setAction("list")
            }}
            className={`px-4 py-3 font-medium border-b-2 -mb-px ${
              activeTab === "newsletters" ? "border-accent text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            Newsletters
          </button>
          <button
            onClick={() => {
              setActiveTab("residents")
              setAction("list")
            }}
            className={`px-4 py-3 font-medium border-b-2 -mb-px ${
              activeTab === "residents" ? "border-accent text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            Residents
          </button>
        </div>

        {/* Newsletter tab */}
        {activeTab === "newsletters" && (
          <div>
            {action === "list" && (
              <>
                <div className="mb-6">
                  <button onClick={() => setAction("create")} className="btn-primary">
                    + New Newsletter
                  </button>
                </div>
                <NewsletterList
                  onEdit={(post) => {
                    setSelectedItem(post)
                    setAction("edit")
                  }}
                />
              </>
            )}
            {(action === "create" || action === "edit") && (
              <div>
                <button
                  onClick={() => {
                    setAction("list")
                    setSelectedItem(null)
                  }}
                  className="mb-6 text-sm text-primary hover:text-accent"
                >
                  ← Back to List
                </button>
                <div className="card-minimal">
                  <h2 className="serif-heading text-2xl mb-6">
                    {action === "create" ? "New Newsletter" : "Edit Newsletter"}
                  </h2>
                  <NewsletterForm
                    initial={selectedItem && "title" in selectedItem ? selectedItem : undefined}
                    onSubmit={handleNewsletterSubmit}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Residents tab */}
        {activeTab === "residents" && (
          <div>
            {action === "list" && (
              <>
                <div className="mb-6">
                  <button onClick={() => setAction("create")} className="btn-primary">
                    + New Resident
                  </button>
                </div>
                <ResidentList
                  onEdit={(resident) => {
                    setSelectedItem(resident)
                    setAction("edit")
                  }}
                />
              </>
            )}
            {(action === "create" || action === "edit") && (
              <div>
                <button
                  onClick={() => {
                    setAction("list")
                    setSelectedItem(null)
                  }}
                  className="mb-6 text-sm text-primary hover:text-accent"
                >
                  ← Back to List
                </button>
                <div className="card-minimal">
                  <h2 className="serif-heading text-2xl mb-6">
                    {action === "create" ? "New Resident" : "Edit Resident"}
                  </h2>
                  <ResidentForm
                    initial={selectedItem && "name" in selectedItem ? selectedItem : undefined}
                    onSubmit={handleResidentSubmit}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  )
}
