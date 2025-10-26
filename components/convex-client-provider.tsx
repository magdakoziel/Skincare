"use client"

import { ConvexProvider, ConvexReactClient } from "convex/react"
import type { ReactNode } from "react"

// Initialize Convex only if URL is provided
const convex = process.env.NEXT_PUBLIC_CONVEX_URL
  ? new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)
  : null

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // If no Convex URL, just render children without Convex provider
  if (!convex) {
    return <>{children}</>
  }
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
