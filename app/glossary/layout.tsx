import type React from "react"
import { Navigation } from "@/components/navigation"

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {children}
    </div>
  )
}
