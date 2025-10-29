import type React from "react"
import { Navigation } from "@/components/navigation"

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pb-20 md:pb-0">{children}</div>
    </div>
  )
}
