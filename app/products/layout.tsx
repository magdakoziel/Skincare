import type React from "react"
import { Navigation } from "@/components/navigation"

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pb-24 md:pb-8">{children}</div>
    </div>
  )
}
