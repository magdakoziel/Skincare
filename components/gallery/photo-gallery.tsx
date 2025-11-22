"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Upload, Grid3x3, Clock, Loader2 } from "lucide-react"
import { PhotoUpload } from "./photo-upload"
import { PhotoAnalysisResult } from "./photo-analysis-result"
import { TimelineView } from "./timeline-view"
import { GridView } from "./grid-view"
import { ComparisonView } from "./comparison-view"
import { analyzePhoto, type PhotoAnalysisResult as AnalysisResult } from "@/lib/analyze-photo"

type PersistResult = {
  success: boolean
  trimmed: boolean
  storedPhotos: any[]
}

const isQuotaError = (error: unknown): error is DOMException => {
  if (!(error instanceof DOMException)) return false
  return (
    error.name === "QuotaExceededError" ||
    error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    (typeof error.code === "number" && (error.code === 22 || error.code === 1014))
  )
}

const createPhotoId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `photo-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const buildAnalysisSummary = (analysis: AnalysisResult) => {
  const primaryDetection = analysis.detectedAcneTypes?.[0]
  return {
    acneType: primaryDetection?.type?.name || "AI Insight",
    severity: analysis.severity,
    affectedAreas: analysis.affectedAreas,
  }
}

export function PhotoGallery() {
  const [showUpload, setShowUpload] = useState(false)
  const [view, setView] = useState<"timeline" | "grid" | "comparison">("timeline")
  const [photos, setPhotos] = useState<any[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [storageNotice, setStorageNotice] = useState<string | null>(null)

  const persistPhotos = (nextPhotos: any[]): PersistResult => {
    let workingSet = [...nextPhotos]
    let trimmed = false

    while (true) {
      try {
        localStorage.setItem("photos", JSON.stringify(workingSet))
        return { success: true, trimmed, storedPhotos: workingSet }
      } catch (error) {
        if (isQuotaError(error) && workingSet.length > 0) {
          workingSet = workingSet.slice(1)
          trimmed = true
          continue
        }
        console.error("Failed to store photos:", error)
        break
      }
    }

    return { success: false, trimmed: false, storedPhotos: photos }
  }

  const handlePersistFeedback = (result: PersistResult) => {
    if (!result.success) {
      setStorageNotice("Nie mozemy zapisac zdjecia, poniewaz pamiec przegladarki jest pelna. Usun kilka zdjec i sprobuj ponownie.")
      return false
    }
    setStorageNotice(
      result.trimmed
        ? "Miejsca w pamieci bylo niewiele, wiec najstarsze zdjecia zostaly automatycznie usuniete."
        : null,
    )
    return true
  }

  useEffect(() => {
    const savedPhotos = localStorage.getItem("photos")
    if (!savedPhotos) return

    try {
          const parsed = JSON.parse(savedPhotos)
          let mutated = false
          const normalized = parsed.map((photo: any) => {
            const ensureId = photo.id || createPhotoId()
            const normalizedPhoto = { ...photo, id: ensureId }
            if (!photo.id) mutated = true
            return normalizedPhoto
          })
      if (mutated) {
        localStorage.setItem("photos", JSON.stringify(normalized))
      }
      setPhotos(normalized)
    } catch (error) {
      console.error("Failed to parse stored photos:", error)
      setPhotos([])
    }
  }, [])

  const handlePhotoAdded = () => {
    const savedPhotos = localStorage.getItem("photos")
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos))
    } else {
      setPhotos([])
    }
  }

  const handlePhotoUpdate = (updatedPhotos: any[]) => {
    const result = persistPhotos(updatedPhotos)
    if (!handlePersistFeedback(result)) {
      return
    }
    setPhotos(result.storedPhotos)
  }

  const attachAnalysisToPhoto = (photoId: string, analysis: AnalysisResult) => {
    try {
      const saved = JSON.parse(localStorage.getItem("photos") || "[]")
      const updated = saved.map((photo: any) =>
        photo.id === photoId
          ? {
              ...photo,
              analysisResult: buildAnalysisSummary(analysis),
              analysisDetails: analysis,
            }
          : photo,
      )
      const result = persistPhotos(updated)
      if (handlePersistFeedback(result)) {
        setPhotos(result.storedPhotos)
      }
    } catch (error) {
      console.error("Unable to attach analysis to photo:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 pb-20 md:pb-8">
      <div className="mb-6 md:mb-8 flex flex-col gap-3 md:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Photo Gallery</h1>
          <p className="mt-1 text-sm md:text-base text-muted-foreground">Track your skin journey over time</p>
        </div>
        <Button onClick={() => setShowUpload(true)} className="w-full sm:w-auto" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Upload Photo
        </Button>
      </div>

      {storageNotice && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-200">
          {storageNotice}
        </div>
      )}

      <Tabs value={view} onValueChange={(v: string) => setView(v as typeof view)} className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto h-11">
          <TabsTrigger value="timeline" className="gap-1.5 text-xs md:text-sm">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="grid" className="gap-1.5 text-xs md:text-sm">
            <Grid3x3 className="h-4 w-4" />
            <span className="hidden sm:inline">Grid</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="gap-1.5 text-xs md:text-sm">
            <span>Compare</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <TimelineView photos={photos} onPhotoUpdate={handlePhotoUpdate} />
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          <GridView photos={photos} />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <ComparisonView photos={photos} />
        </TabsContent>
      </Tabs>

      {showUpload && (
        <PhotoUpload
          onClose={() => setShowUpload(false)}
          onUpload={async (photo) => {
            const savedPhotos = JSON.parse(localStorage.getItem("photos") || "[]")
            const photoId = createPhotoId()
            const takenDate = photo.takenAt ? new Date(photo.takenAt) : new Date()
            const { takenAt, ...photoPayload } = photo
            const newPhoto = { ...photoPayload, id: photoId, date: takenDate.toISOString() }

            const persistResult = persistPhotos([...savedPhotos, newPhoto])
            if (!handlePersistFeedback(persistResult)) {
              throw new Error("storage-quota-exceeded")
            }
            handlePhotoAdded()

            // If analyze is enabled, run AI analysis
            if (photo.analyzeNow) {
              setAnalyzing(true)
              try {
                const result = await analyzePhoto(photo.url)
                setAnalysisResult(result)
                attachAnalysisToPhoto(photoId, result)
              } catch (error) {
                console.error("Error analyzing photo:", error)
              } finally {
                setAnalyzing(false)
              }
            }
          }}
        />
      )}

      {/* Analysis Loading Dialog */}
      <Dialog open={analyzing} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Analyzing Photo</DialogTitle>
            <DialogDescription>Our AI is analyzing your photo to detect acne types...</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">This may take a few moments</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Analysis Results Dialog */}
      <Dialog open={!!analysisResult} onOpenChange={() => setAnalysisResult(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader className="sr-only">
            <DialogTitle>AI analysis results</DialogTitle>
          </DialogHeader>
          {analysisResult && <PhotoAnalysisResult result={analysisResult} onClose={() => setAnalysisResult(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
