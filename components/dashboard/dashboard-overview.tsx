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
  const [photos, setPhotos] = useState<any[]>([])

  useEffect(() => {
    setProductLibrary(getProducts())

    // Load photos from localStorage
    const loadPhotos = () => {
      try {
        const storedPhotos = localStorage.getItem("photos")
        if (storedPhotos) {
          const parsedPhotos = JSON.parse(storedPhotos)
          setPhotos(parsedPhotos)
        }
      } catch (error) {
        console.error("Error loading photos:", error)
      }
    }

    loadPhotos()

    // Listen for changes from other tabs/components
    const handleStorageChange = () => {
      setProductLibrary(getProducts())
      loadPhotos()
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

  // Get real photo count and recent photos
  const sortedPhotos = [...photos].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : (a.createdAt ? new Date(a.createdAt) : new Date()).getTime()
    const dateB = b.date ? new Date(b.date).getTime() : (b.createdAt ? new Date(b.createdAt) : new Date()).getTime()
    return dateB - dateA // Most recent first
  })

  const recentPhotos = sortedPhotos.slice(0, 3) // Get 3 most recent photos

  return (
    <div className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(1200px 800px at 10% -10%, hsl(var(--primary) / 0.15), transparent 60%),
          radial-gradient(1000px 700px at 110% 10%, hsl(var(--pink-400) / 0.12), transparent 55%),
          radial-gradient(900px 600px at 50% 120%, hsl(var(--yellow-200) / 0.1), transparent 60%),
          hsl(var(--background))
        `
      }}>
      <div className="container mx-auto px-4 py-4 md:py-8 pb-20 md:pb-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">Welcome back to your skin journey</h1>
          <p className="mt-1 md:mt-2 text-sm md:text-base text-muted-foreground">Track your progress and stay consistent with your routine</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 md:mb-8 grid gap-4">
          <Card className="bg-background/60 backdrop-blur-md border-border/40 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Improvement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">Track Progress</div>
              <p className="text-xs text-muted-foreground">Upload photos to see AI analysis</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          {/* Recent Photos */}
          <Card className="bg-background/60 backdrop-blur-md border-border/40 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Photos</CardTitle>
                  <CardDescription>Your latest skin progress photos</CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Camera className="h-4 w-4" />
                    <span className="text-2xl font-bold text-foreground">{photos.length}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">total</p>
                </div>
              </div>
            </CardHeader>
          <CardContent>
            {recentPhotos.length === 0 ? (
              <div className="py-8 text-center">
                <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">No photos yet</p>
                <Button asChild variant="outline" className="mt-4" size="sm">
                  <Link href="/gallery">
                    Upload Your First Photo
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {recentPhotos.map((photo, index) => {
                    const photoDate = photo.date ? new Date(photo.date) : (photo.createdAt ? new Date(photo.createdAt) : new Date())

                    return (
                      <div key={photo._id || index} className="flex items-center gap-4">
                        <img
                          src={photo.url || "/placeholder.svg"}
                          alt="Progress photo"
                          className="h-16 w-16 rounded-lg object-cover border border-border"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {photoDate.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          {photo.caption && (
                            <p className="text-xs text-muted-foreground line-clamp-1">{photo.caption}</p>
                          )}
                          {photo.analysisResult && (
                            <p className="text-xs text-muted-foreground">
                              {photo.analysisResult.severity} - {photo.analysisResult.acneType}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <Button asChild variant="outline" className="mt-4 w-full rounded-xl">
                  <Link href="/gallery">
                    View All Photos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

          {/* Quick Actions */}
          <Card className="bg-background/60 backdrop-blur-md border-border/40 shadow-xl">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Continue your skincare journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start rounded-xl shadow-lg shadow-primary/20" size="lg">
                <Link href="/gallery">
                  <Camera className="mr-2 h-5 w-5" />
                  Upload New Photo
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start rounded-xl" size="lg">
                <Link href="/chat">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Ask AI Assistant
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Skin Journal & Routine - Side by Side */}
        <div className="mt-4 md:mt-6 grid gap-4 md:gap-6 lg:grid-cols-2">
          <SkinJournalCalendar />
          <CollapsibleRoutine library={productLibrary} onProductAdd={addProductToLibrary} />
        </div>
      </div>
    </div>
  )
}
