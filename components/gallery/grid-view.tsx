"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PhotoAnalysisResult } from "@/components/gallery/photo-analysis-result"
import type { PhotoAnalysisResult as AnalysisResult } from "@/lib/analyze-photo"
import { Calendar } from "lucide-react"

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
    affectedAreas: string[]
  }
  analysisDetails?: AnalysisResult
}

type GridViewProps = {
  photos: Photo[]
}

export function GridView({ photos }: GridViewProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
        <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">No photos yet</h3>
        <p className="text-sm text-muted-foreground">Upload your first photo to start tracking your skin journey</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => {
          const photoDate = photo.date ? new Date(photo.date) : (photo.createdAt ? new Date(photo.createdAt) : new Date())

          return (
            <Card
              key={photo.id || photo._id || index}
              className="cursor-pointer overflow-hidden border-border transition-transform hover:scale-105"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.url || "/placeholder.svg"}
                alt={photo.caption || "Skin photo"}
                className="h-64 w-full object-cover"
              />
              <CardContent className="p-3">
                <p className="text-sm font-medium text-muted-foreground">
                  {format(photoDate, "MMM d, yyyy")}
                </p>
                {photo.caption && <p className="mt-1 text-sm text-foreground line-clamp-2">{photo.caption}</p>}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedPhoto && (
        <Dialog open onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Photo details</DialogTitle>
            </DialogHeader>
            <img
              src={selectedPhoto.url || "/placeholder.svg"}
              alt={selectedPhoto.caption || "Skin photo"}
              className="w-full rounded-lg"
            />
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                {format(
                  selectedPhoto.date ? new Date(selectedPhoto.date) : (selectedPhoto.createdAt ? new Date(selectedPhoto.createdAt) : new Date()),
                  "MMMM d, yyyy"
                )}
              </p>
              {selectedPhoto.caption && <p className="text-foreground">{selectedPhoto.caption}</p>}
              {selectedPhoto.analysisResult && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{selectedPhoto.analysisResult.acneType}</Badge>
                    <Badge variant="outline">{selectedPhoto.analysisResult.severity}</Badge>
                  </div>
                  {selectedPhoto.analysisResult.affectedAreas.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Affected areas: {selectedPhoto.analysisResult.affectedAreas.join(", ")}
                    </p>
                  )}
                </div>
              )}
              {selectedPhoto.analysisDetails && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setAnalysisResult(selectedPhoto.analysisDetails!)}
                >
                  View full AI analysis
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={!!analysisResult} onOpenChange={(open) => !open && setAnalysisResult(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          {analysisResult && <PhotoAnalysisResult result={analysisResult} onClose={() => setAnalysisResult(null)} />}
        </DialogContent>
      </Dialog>
    </>
  )
}
