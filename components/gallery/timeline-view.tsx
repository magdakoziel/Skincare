"use client"

import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

type Photo = {
  _id: string
  url: string
  caption?: string
  createdAt: number
  analysisResult?: {
    acneType: string
    severity: string
    affectedAreas: string[]
  }
}

type TimelineViewProps = {
  photos: Photo[]
}

export function TimelineView({ photos }: TimelineViewProps) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
        <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">No photos yet</h3>
        <p className="text-sm text-muted-foreground">Upload your first photo to start tracking your skin journey</p>
      </div>
    )
  }

  const sortedPhotos = [...photos].sort((a, b) => b.createdAt - a.createdAt)

  return (
    <div className="space-y-6">
      {sortedPhotos.map((photo, index) => (
        <div key={photo._id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              {index + 1}
            </div>
            {index < sortedPhotos.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
          </div>

          <Card className="flex-1 border-border">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <img
                  src={photo.url || "/placeholder.svg"}
                  alt={photo.caption || "Skin photo"}
                  className="h-48 w-full rounded-lg object-cover sm:w-48"
                />
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {format(new Date(photo.createdAt), "MMMM d, yyyy")}
                      </p>
                      {photo.caption && <p className="mt-1 text-foreground">{photo.caption}</p>}
                    </div>
                  </div>

                  {photo.analysisResult && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{photo.analysisResult.acneType}</Badge>
                        <Badge variant="outline">{photo.analysisResult.severity}</Badge>
                      </div>
                      {photo.analysisResult.affectedAreas.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Affected areas: {photo.analysisResult.affectedAreas.join(", ")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
