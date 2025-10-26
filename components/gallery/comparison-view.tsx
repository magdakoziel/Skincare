"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Photo = {
  _id: string
  url: string
  caption?: string
  createdAt: number
  analysisResult?: {
    acneType: string
    severity: string
  }
}

type ComparisonViewProps = {
  photos: Photo[]
}

export function ComparisonView({ photos }: ComparisonViewProps) {
  const [beforePhoto, setBeforePhoto] = useState<string>("")
  const [afterPhoto, setAfterPhoto] = useState<string>("")
  const [selectingFor, setSelectingFor] = useState<"before" | "after" | null>(null)

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
        <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">No photos yet</h3>
        <p className="text-sm text-muted-foreground">Upload at least 2 photos to compare your progress</p>
      </div>
    )
  }

  if (photos.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
        <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">Need more photos</h3>
        <p className="text-sm text-muted-foreground">Upload at least one more photo to compare your progress</p>
      </div>
    )
  }

  const sortedPhotos = [...photos].sort((a, b) => a.createdAt - b.createdAt)
  const before = sortedPhotos.find((p) => p._id === beforePhoto)
  const after = sortedPhotos.find((p) => p._id === afterPhoto)

  const handlePhotoSelect = (photoId: string) => {
    if (selectingFor === "before") {
      setBeforePhoto(photoId)
      setSelectingFor(null)
    } else if (selectingFor === "after") {
      setAfterPhoto(photoId)
      setSelectingFor(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Select Photos to Compare</CardTitle>
          <p className="text-sm text-muted-foreground">
            {selectingFor
              ? `Click on a photo to select it as ${selectingFor === "before" ? "Before" : "After"}`
              : "Click the Before or After buttons below, then select a photo"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => setSelectingFor("before")}
              className={cn(
                "rounded-lg border-2 p-3 text-left transition-colors",
                selectingFor === "before" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Before Photo</span>
                {before && <Check className="h-5 w-5 text-primary" />}
              </div>
              {before && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {format(new Date(before.createdAt), "MMM d, yyyy")}
                </p>
              )}
            </button>

            <button
              onClick={() => setSelectingFor("after")}
              className={cn(
                "rounded-lg border-2 p-3 text-left transition-colors",
                selectingFor === "after" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">After Photo</span>
                {after && <Check className="h-5 w-5 text-primary" />}
              </div>
              {after && (
                <p className="mt-1 text-sm text-muted-foreground">{format(new Date(after.createdAt), "MMM d, yyyy")}</p>
              )}
            </button>
          </div>

          {selectingFor && (
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {sortedPhotos.map((photo) => (
                <button
                  key={photo._id}
                  onClick={() => handlePhotoSelect(photo._id)}
                  className={cn(
                    "group relative overflow-hidden rounded-lg border-2 transition-all",
                    photo._id === beforePhoto || photo._id === afterPhoto
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
                  {(photo._id === beforePhoto || photo._id === afterPhoto) && (
                    <div className="absolute right-2 top-2 rounded-full bg-primary p-1">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-xs font-medium text-white">{format(new Date(photo.createdAt), "MMM d, yyyy")}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {before && after && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Before</CardTitle>
              <p className="text-sm text-muted-foreground">{format(new Date(before.createdAt), "MMMM d, yyyy")}</p>
            </CardHeader>
            <CardContent>
              <img src={before.url || "/placeholder.svg"} alt="Before" className="w-full rounded-lg" />
              {before.analysisResult && (
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Type: <span className="font-medium text-foreground">{before.analysisResult.acneType}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Severity: <span className="font-medium text-foreground">{before.analysisResult.severity}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">After</CardTitle>
              <p className="text-sm text-muted-foreground">{format(new Date(after.createdAt), "MMMM d, yyyy")}</p>
            </CardHeader>
            <CardContent>
              <img src={after.url || "/placeholder.svg"} alt="After" className="w-full rounded-lg" />
              {after.analysisResult && (
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Type: <span className="font-medium text-foreground">{after.analysisResult.acneType}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Severity: <span className="font-medium text-foreground">{after.analysisResult.severity}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {before && after && (
        <Card className="border-border bg-primary/5">
          <CardContent className="flex items-center justify-center gap-4 p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Time Difference</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.floor((after.createdAt - before.createdAt) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
            <ArrowRight className="h-6 w-6 text-primary" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-2xl font-bold text-primary">Tracking</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
