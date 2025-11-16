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

export function PhotoGallery() {
  const [showUpload, setShowUpload] = useState(false)
  const [view, setView] = useState<"timeline" | "grid" | "comparison">("timeline")
  const [photos, setPhotos] = useState<any[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    const savedPhotos = localStorage.getItem("photos")
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos))
    }
  }, [])

  const handlePhotoAdded = () => {
    const savedPhotos = localStorage.getItem("photos")
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos))
    }
    setShowUpload(false)
  }

  const handlePhotoUpdate = (updatedPhotos: any[]) => {
    localStorage.setItem("photos", JSON.stringify(updatedPhotos))
    setPhotos(updatedPhotos)
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
            const newPhoto = { ...photo, date: new Date().toISOString() }

            // Save photo first
            localStorage.setItem("photos", JSON.stringify([...savedPhotos, newPhoto]))
            handlePhotoAdded()

            // If analyze is enabled, run AI analysis
            if (photo.analyzeNow) {
              setAnalyzing(true)
              try {
                const result = await analyzePhoto(photo.url)
                setAnalysisResult(result)
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
          {analysisResult && <PhotoAnalysisResult result={analysisResult} onClose={() => setAnalysisResult(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
