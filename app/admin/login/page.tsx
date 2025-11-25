"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        router.push("/admin")
      } else {
        setError("Invalid password")
      }
    } catch (err) {
      setError("Error logging in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="container-mobile flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-sm card-minimal">
          <h2 className="serif-heading text-2xl mb-6 text-center">Admin Access</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter admin password"
                disabled={loading}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </main>
    </>
  )
}
