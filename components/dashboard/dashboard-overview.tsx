"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Sparkles, ArrowRight, Droplets } from "lucide-react"
import Link from "next/link"
import { CollapsibleRoutine } from "./collapsible-routine"
import { SkinJournalCalendar } from "./skin-journal-calendar"
import { SavedProduct } from "./product-library"
import { getProducts, saveProducts } from "@/lib/product-storage"
import { cn } from "@/lib/utils"

export function DashboardOverview() {
  const [productLibrary, setProductLibrary] = useState<SavedProduct[]>([])
  const [photos, setPhotos] = useState<any[]>([])
  const [skinProfile, setSkinProfile] = useState<any>(null)

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
        const profileRaw = localStorage.getItem("skinProfile")
        if (profileRaw) {
          setSkinProfile(JSON.parse(profileRaw))
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

  const latestProgress = (() => {
    if (sortedPhotos.length < 2) return null
    const [latest, previous] = sortedPhotos
    if (!latest || !previous || !latest.analysisResult || !previous.analysisResult) return null
    const severityMap: Record<string, number> = {
      severe: 100,
      moderate: 60,
      mild: 30,
      clear: 0,
    }
    const prevValue = severityMap[previous.analysisResult.severity?.toLowerCase()] ?? null
    const latestValue = severityMap[latest.analysisResult.severity?.toLowerCase()] ?? null
    if (prevValue === null || latestValue === null || prevValue <= 0) return null
    const improvement = Math.round(((prevValue - latestValue) / prevValue) * 100)
    return {
      value: improvement,
      latest,
      previous,
      label: improvement > 0 ? "Better vs last photo" : improvement < 0 ? "Worse vs last photo" : "No change",
    }
  })()

  const primaryConcern =
    skinProfile?.aiInsights?.primaryType ||
    skinProfile?.concerns?.[0] ||
    (skinProfile?.breakoutAppearance ? `Focus: ${skinProfile.breakoutAppearance}` : null)

  return (
    <div className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(1200px 800px at 10% -10%, hsl(320 60% 80% / 0.3), transparent 60%),
          radial-gradient(1000px 700px at 110% 10%, hsl(280 70% 75% / 0.25), transparent 55%),
          radial-gradient(900px 600px at 50% 120%, hsl(340 65% 85% / 0.2), transparent 60%),
          hsl(var(--background))
        `
      }}>
      <div className="container mx-auto px-4 py-4 md:py-8 pb-20 md:pb-8">
        <div className="mb-3 md:mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance text-center">Welcome back to your skin journey</h1>
        </div>

        {/* Skin Journal - Top Priority */}
        <div className="mb-6 md:mb-8">
          <SkinJournalCalendar />
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-2 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4 md:space-y-6">
            {/* Skin Profile Summary */}
            <Card className="bg-background/60 backdrop-blur-md border-border/40 shadow-xl h-full">
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <CardTitle>Your Skin Profile</CardTitle>
                  <CardDescription>From onboarding + Gemini analysis</CardDescription>
                </div>
                {skinProfile ? (
                  <div className="flex items-center gap-2 rounded-full border border-primary/30 px-3 py-1 text-sm font-medium text-primary">
                    <Droplets className="h-4 w-4" />
                    <span className="capitalize">{skinProfile.skinType || "Unknown type"}</span>
                  </div>
                ) : (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/onboarding">Complete quiz</Link>
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {skinProfile ? (
                  <>
                    {/* User demographics */}
                    {(skinProfile.age || skinProfile.gender || skinProfile.country) && (
                      <div className="flex flex-wrap gap-2 pb-2 border-b border-border/40">
                        {skinProfile.age && (
                          <Badge variant="outline" className="text-xs">
                            Age {skinProfile.age}
                          </Badge>
                        )}
                        {skinProfile.gender && (
                          <Badge variant="outline" className="text-xs capitalize">
                            {skinProfile.gender}
                          </Badge>
                        )}
                        {skinProfile.country && (
                          <Badge variant="outline" className="text-xs">
                            {skinProfile.country}
                          </Badge>
                        )}
                      </div>
                    )}

                    {primaryConcern && (
                      <p className="text-sm text-muted-foreground">
                        Primary concern:&nbsp;
                        <span className="font-semibold text-foreground">{primaryConcern}</span>
                      </p>
                    )}
                    {skinProfile.aiInsights?.focusAreas?.length ? (
                      <div className="rounded-md border border-border/60 bg-muted/40 p-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Gemini focus areas
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-foreground">
                          {skinProfile.aiInsights.focusAreas.slice(0, 3).map((item: string, idx: number) => (
                            <li key={idx}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/glossary">Explore recommendations</Link>
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Complete the onboarding quiz to generate your profile.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Quick Actions */}
            <Card className="bg-background/60 backdrop-blur-md border-border/40 shadow-xl h-full">
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
                <Button asChild variant="ghost" className="w-full justify-start rounded-xl" size="sm">
                  <Link href="/onboarding">
                    Update Skin Quiz
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Routine + Recent Photos */}
        <div className="mt-4 md:mt-6 grid gap-4 md:gap-6 md:grid-cols-2">
          <Card className="bg-background/60 backdrop-blur-md border-border/40 shadow-xl">
            <CardContent className="p-0">
              <CollapsibleRoutine library={productLibrary} onProductAdd={addProductToLibrary} />
            </CardContent>
          </Card>

          <Card className="bg-background/60 backdrop-blur-md border-border/40 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Photos</CardTitle>
                  <CardDescription>Your latest skin progress photos</CardDescription>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Camera className="h-4 w-4" />
                    <span className="text-2xl font-bold text-foreground">{photos.length}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">total</p>
                  {latestProgress && (
                    <div className="text-xs font-semibold">
                      <span
                        className={cn(
                          latestProgress.value > 0
                            ? "text-green-600"
                            : latestProgress.value < 0
                              ? "text-red-600"
                              : "text-muted-foreground",
                        )}
                      >
                        {latestProgress.value > 0 ? "+" : ""}
                        {latestProgress.value}%
                      </span>
                      <p className="text-[11px] text-muted-foreground">{latestProgress.label}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {recentPhotos.length === 0 ? (
                <div className="py-8 text-center">
                  <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">No photos yet</p>
                  <Button asChild variant="outline" className="mt-4" size="sm">
                    <Link href="/gallery">Upload Your First Photo</Link>
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
                            {photo.caption && <p className="text-xs text-muted-foreground line-clamp-1">{photo.caption}</p>}
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
        </div>
      </div>
    </div>
  )
}
