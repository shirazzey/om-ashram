"use client"

export function Header() {
  return (
    <header className="sticky top-0 bg-background border-b border-border z-10">
      <div className="container-mobile flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          {/* NGO Logo - minimal SVG */}
          <svg width="32" height="32" viewBox="0 0 32 32" className="fill-primary">
            <circle cx="16" cy="16" r="14" />
            <text x="16" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-background">
              NGO
            </text>
          </svg>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-primary leading-tight">Community</h1>
            <p className="text-xs text-muted-foreground">Connect & Share</p>
          </div>
        </div>
      </div>
    </header>
  )
}
