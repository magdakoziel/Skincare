"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar, Check, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PhotoAnalysisResult as AnalysisDetails } from "@/lib/analyze-photo"
import { Button } from "@/components/ui/button"

type Photo = {
  id?: string
  _id?: string
  url: string
  caption?: string
  date?: string
  createdAt?: number
  analysisResult?: {
    acneType: string
    severity: string
  }
  analysisDetails?: AnalysisDetails
}

type ComparisonViewProps = {
  photos: Photo[]
}

type PhotoProgressInsight = {
  improvementScore: number
  headline: string
  summary: string
  notableChanges: string[]
  nextSteps: string[]
}

export function ComparisonView({ photos }: ComparisonViewProps) {
  const [photo1, setPhoto1] = useState<string>("")
  const [photo2, setPhoto2] = useState<string>("")
  const [selectingFor, setSelectingFor] = useState<"photo1" | "photo2" | null>(null)
  const [progressInsight, setProgressInsight] = useState<PhotoProgressInsight | null>(null)
  const [progressLoading, setProgressLoading] = useState(false)
  const [progressError, setProgressError] = useState<string | null>(null)
  const latestRequestRef = useRef<string>("")
  const [showComparison, setShowComparison] = useState(false)

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
        <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">No photos yet</h3>
        <p className="text-sm text-muted-foreground">Upload at least 2 photos to compare</p>
      </div>
    )
  }

  if (photos.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
        <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">Need more photos</h3>
        <p className="text-sm text-muted-foreground">Upload at least one more photo to compare</p>
      </div>
    )
  }

  const sortedPhotos = useMemo(() => {
    return [...photos].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : a.createdAt || 0
      const dateB = b.date ? new Date(b.date).getTime() : b.createdAt || 0
      return dateA - dateB
    })
  }, [photos])

  const resolveIdentifier = (photo: Photo, index: number) => photo.id || photo._id || String(index)
  const getTimestamp = (photo?: Photo) => (photo?.date ? new Date(photo.date).getTime() : photo?.createdAt || 0)

  const firstPhoto = sortedPhotos.find((p, index) => resolveIdentifier(p, index) === photo1)
  const secondPhoto = sortedPhotos.find((p, index) => resolveIdentifier(p, index) === photo2)

  useEffect(() => {
    const hasFirst = photo1 ? sortedPhotos.some((p, index) => resolveIdentifier(p, index) === photo1) : false
    const hasSecond = photo2 ? sortedPhotos.some((p, index) => resolveIdentifier(p, index) === photo2) : false
    if (photo1 && !hasFirst) {
      setPhoto1("")
      setShowComparison(false)
    }
    if (photo2 && !hasSecond) {
      setPhoto2("")
      setShowComparison(false)
    }
  }, [sortedPhotos, photo1, photo2])

  const handlePhotoSelect = (photoId: string) => {
    if (selectingFor === "photo1") {
      setPhoto1(photoId)
      setSelectingFor(null)
      setShowComparison(false)
    } else if (selectingFor === "photo2") {
      setPhoto2(photoId)
      setSelectingFor(null)
      setShowComparison(false)
    }
  }

  useEffect(() => {
    if (
      !showComparison ||
      !firstPhoto ||
      !secondPhoto ||
      !firstPhoto.analysisDetails ||
      !secondPhoto.analysisDetails
    ) {
      setProgressInsight(null)
      setProgressError(null)
      setProgressLoading(false)
      return
    }

    const firstTime = getTimestamp(firstPhoto)
    const secondTime = getTimestamp(secondPhoto)
    const earlier = firstTime <= secondTime ? firstPhoto : secondPhoto
    const later = earlier === firstPhoto ? secondPhoto : firstPhoto
    const requestKey = `${resolveIdentifier(firstPhoto, 0)}-${resolveIdentifier(secondPhoto, 0)}`
    latestRequestRef.current = requestKey
    setProgressLoading(true)
    setProgressError(null)

    const severityMap: Record<string, number> = {
      severe: 100,
      moderate: 60,
      mild: 30,
      clear: 0,
    }
    const earlierSeverity = severityMap[earlier.analysisResult?.severity?.toLowerCase() || ""] ?? 50
    const laterSeverity = severityMap[later.analysisResult?.severity?.toLowerCase() || ""] ?? 50

    fetch("/api/photo-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        earlier: earlier.analysisDetails,
        later: later.analysisDetails,
        metadata: {
          earlierDate: earlier.date,
          laterDate: later.date,
          earlierCaption: earlier.caption,
          laterCaption: later.caption,
          severityChange: earlierSeverity - laterSeverity,
        },
      }),
    })
      .then(async (response) => {
        const payload = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(payload?.error || "Gemini progress unavailable")
        }
        if (latestRequestRef.current === requestKey) {
          setProgressInsight(payload)
        }
      })
      .catch((error) => {
        console.error("AI progress error:", error)
        if (latestRequestRef.current === requestKey) {
          setProgressError("AI progress summary is unavailable right now.")
        }
      })
      .finally(() => {
        if (latestRequestRef.current === requestKey) {
          setProgressLoading(false)
        }
      })
  }, [firstPhoto, secondPhoto, showComparison])

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Select Photos to Compare</CardTitle>
          <p className="text-xs md:text-sm text-muted-foreground">
            {selectingFor
              ? `Click on a photo to select it as ${selectingFor === "photo1" ? "Photo 1" : "Photo 2"}`
              : "Click Photo 1 or Photo 2 buttons below, then select a photo"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 md:gap-3 sm:grid-cols-2">
            <button
              onClick={() => setSelectingFor("photo1")}
              className={cn(
                "rounded-lg border-2 p-3 text-left transition-colors",
                selectingFor === "photo1" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Photo 1</span>
                {firstPhoto && <Check className="h-5 w-5 text-primary" />}
              </div>
              {firstPhoto && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {format(
                    firstPhoto.date ? new Date(firstPhoto.date) : (firstPhoto.createdAt ? new Date(firstPhoto.createdAt) : new Date()),
                    "MMM d, yyyy"
                  )}
                </p>
              )}
            </button>

            <button
              onClick={() => setSelectingFor("photo2")}
              className={cn(
                "rounded-lg border-2 p-3 text-left transition-colors",
                selectingFor === "photo2" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Photo 2</span>
                {secondPhoto && <Check className="h-5 w-5 text-primary" />}
              </div>
              {secondPhoto && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {format(
                    secondPhoto.date ? new Date(secondPhoto.date) : (secondPhoto.createdAt ? new Date(secondPhoto.createdAt) : new Date()),
                    "MMM d, yyyy"
                  )}
                </p>
              )}
            </button>
          </div>

          {selectingFor && (
            <div className="grid gap-2 md:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {sortedPhotos.map((photo, index) => {
                const photoId = resolveIdentifier(photo, index)
                const photoDate = photo.date ? new Date(photo.date) : (photo.createdAt ? new Date(photo.createdAt) : new Date())

                return (
                  <button
                    key={photoId}
                    onClick={() => handlePhotoSelect(photoId)}
                    className={cn(
                      "group relative overflow-hidden rounded-lg border-2 transition-all",
                      photoId === photo1 || photoId === photo2
                        ? "border-primary"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <img
                      src={photo.url || "/placeholder.svg"}
                      alt={photo.caption || "Skin photo"}
                      className="aspect-square w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                    {(photoId === photo1 || photoId === photo2) && (
                      <div className="absolute right-2 top-2 rounded-full bg-primary p-1">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-xs font-medium text-white">{format(photoDate, "MMM d, yyyy")}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs md:text-sm text-muted-foreground">
              {firstPhoto && secondPhoto
                ? "Click compare to view AI progress summary."
                : "Select Photo 1 and Photo 2 to enable comparison."}
            </p>
            <Button
              variant="outline"
              onClick={() => setShowComparison(true)}
              disabled={!firstPhoto || !secondPhoto}
            >
              Compare selected
            </Button>
          </div>
        </CardContent>
      </Card>

      {showComparison && firstPhoto && secondPhoto && (
        <>
          {/* Side-by-side comparison */}
          <Card className="border-border">
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-2 gap-3 md:gap-6">
                {/* Photo 1 */}
                <div className="space-y-2 md:space-y-3">
                  <div className="text-center">
                    <h3 className="text-base md:text-lg font-semibold">Photo 1</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {format(
                        firstPhoto.date ? new Date(firstPhoto.date) : (firstPhoto.createdAt ? new Date(firstPhoto.createdAt) : new Date()),
                        "MMM d, yyyy"
                      )}
                    </p>
                  </div>
                  <img
                    src={firstPhoto.url || "/placeholder.svg"}
                    alt="Photo 1"
                    className="w-full rounded-lg border-2 border-border"
                  />
                  {firstPhoto.analysisResult && (
                    <div className="space-y-1 text-center">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{firstPhoto.analysisResult.acneType}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Severity: <span className="font-medium text-foreground">{firstPhoto.analysisResult.severity}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Photo 2 */}
                <div className="space-y-2 md:space-y-3">
                  <div className="text-center">
                    <h3 className="text-base md:text-lg font-semibold">Photo 2</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {format(
                        secondPhoto.date ? new Date(secondPhoto.date) : (secondPhoto.createdAt ? new Date(secondPhoto.createdAt) : new Date()),
                        "MMM d, yyyy"
                      )}
                    </p>
                  </div>
                  <img
                    src={secondPhoto.url || "/placeholder.svg"}
                    alt="Photo 2"
                    className="w-full rounded-lg border-2 border-border"
                  />
                  {secondPhoto.analysisResult && (
                    <div className="space-y-1 text-center">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{secondPhoto.analysisResult.acneType}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Severity: <span className="font-medium text-foreground">{secondPhoto.analysisResult.severity}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress indicator */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5">
            <CardContent className="p-4 md:p-6">
              <div className="text-center space-y-3 md:space-y-4">
                <h3 className="text-base md:text-lg font-semibold">📊 Progress Analysis</h3>

                {/* Calculate improvement based on severity */}
                {(() => {
                  const severityMap: Record<string, number> = {
                    'severe': 100,
                    'moderate': 60,
                    'mild': 30,
                    'clear': 0
                  }

                  // Check if both have AI analysis
                  const hasAIAnalysis = firstPhoto.analysisResult && secondPhoto.analysisResult

                  const firstSeverity = hasAIAnalysis
                    ? (severityMap[firstPhoto.analysisResult.severity.toLowerCase()] || 50)
                    : 50
                  const secondSeverity = hasAIAnalysis
                    ? (severityMap[secondPhoto.analysisResult.severity.toLowerCase()] || 50)
                    : 50
                  const improvement = firstSeverity > 0 ? Math.round(((firstSeverity - secondSeverity) / firstSeverity) * 100) : 0

                    const daysDiff = Math.abs(
                      Math.floor(
                        ((secondPhoto.date ? new Date(secondPhoto.date).getTime() : (secondPhoto.createdAt || 0)) -
                         (firstPhoto.date ? new Date(firstPhoto.date).getTime() : (firstPhoto.createdAt || 0))) /
                        (1000 * 60 * 60 * 24)
                      )
                    )

                  return (
                    <>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-8">
                        <div className="text-center">
                          <p className="text-xs md:text-sm text-muted-foreground">Time Difference</p>
                          <p className="text-2xl md:text-3xl font-bold text-foreground">{daysDiff}</p>
                          <p className="text-xs md:text-sm text-muted-foreground">days</p>
                        </div>

                        <ArrowRight className="h-6 w-6 md:h-8 md:w-8 text-primary rotate-90 sm:rotate-0" />

                        <div className="text-center">
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {hasAIAnalysis ? 'AI-Detected Progress' : 'Timeline Progress'}
                          </p>
                          <p className={cn(
                            "text-2xl md:text-3xl font-bold",
                            improvement > 0 ? "text-green-600 dark:text-green-400" :
                            improvement < 0 ? "text-red-600 dark:text-red-400" :
                            "text-muted-foreground"
                          )}>
                            {improvement > 0 ? '+' : ''}{improvement}%
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {improvement > 0 ? '✨ Better' : improvement < 0 ? '⚠️ Worse' : 'No change'}
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      {improvement !== 0 && (
                        <div className="space-y-2">
                          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full transition-all duration-500",
                                improvement > 0 ? "bg-gradient-to-r from-green-500 to-emerald-400" : "bg-gradient-to-r from-red-500 to-orange-400"
                              )}
                              style={{ width: `${Math.abs(improvement)}%` }}
                            />
                          </div>
                          <p className="text-xs sm:text-sm text-center text-muted-foreground px-2">
                            {improvement > 0
                              ? "🎉 Keep up the great work! Your skin is improving."
                              : "💪 Don't worry - skin healing takes time. Stay consistent with your routine!"}
                          </p>
                          {hasAIAnalysis && (
                            <p className="text-xs text-center text-muted-foreground/80 italic">
                              Based on AI severity analysis
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

