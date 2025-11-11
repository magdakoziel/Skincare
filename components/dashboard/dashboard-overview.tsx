"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Sparkles, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import { CollapsibleRoutine } from "./collapsible-routine"
import { SkinJournalCalendar } from "./skin-journal-calendar"
import { SavedProduct } from "./product-library"
import { getProducts, saveProducts } from "@/lib/product-storage"

export function DashboardOverview() {
  const [productLibrary, setProductLibrary] = useState<SavedProduct[]>([])

  useEffect(() => {
    setProductLibrary(getProducts())

    // Listen for changes from other tabs/components
    const handleStorageChange = () => {
      setProductLibrary(getProducts())
    }

    window.addEventListener('storage', handleStorageChange)
    // Custom event for same-tab updates
    window.addEventListener('productsUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('productsUpdated', handleStorageChange)
    }
  }, [])

  const addProductToLibrary = (product: Omit<SavedProduct, 'id' | 'dateAdded'>) => {
    const newProduct: SavedProduct = {
      ...product,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString()
    }
    const updated = [...productLibrary, newProduct]
    setProductLibrary(updated)
    saveProducts(updated)
  }

  // Mock data for now since Convex is not set up
  const stats = {
    totalPhotos: 12,
    improvementScore: 68,
  }

  const recentPhotos = [
    {
      id: "1",
      url: "/face-skincare-progress.jpg",
      date: new Date().toISOString(),
      analysis: { severity: "moderate", type: "inflammatory" },
    },
    {
      id: "2",
      url: "/face-skincare-before.jpg",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      analysis: { severity: "moderate", type: "comedonal" },
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground text-balance">Welcome back to your skin journey</h1>
        <p className="mt-2 text-muted-foreground">Track your progress and stay consistent with your routine</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.improvementScore}%</div>
            <p className="text-xs text-muted-foreground">Based on AI analysis</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Photos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Photos</CardTitle>
                <CardDescription>Your latest skin progress photos</CardDescription>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Camera className="h-4 w-4" />
                  <span className="text-2xl font-bold text-foreground">{stats.totalPhotos}</span>
                </div>
                <p className="text-xs text-muted-foreground">total</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPhotos.map((photo) => (
                <div key={photo.id} className="flex items-center gap-4">
                  <img
                    src={photo.url || "/placeholder.svg"}
                    alt="Progress photo"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {new Date(photo.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {photo.analysis.severity} {photo.analysis.type} acne
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
              <Link href="/gallery">
                View All Photos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Continue your skincare journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start" size="lg">
              <Link href="/gallery">
                <Camera className="mr-2 h-5 w-5" />
                Upload New Photo
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent" size="lg">
              <Link href="/chat">
                <Sparkles className="mr-2 h-5 w-5" />
                Ask AI Assistant
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Skin Journal & Routine - Side by Side */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SkinJournalCalendar />
        <CollapsibleRoutine library={productLibrary} onProductAdd={addProductToLibrary} />
      </div>
    </div>
  )
}
