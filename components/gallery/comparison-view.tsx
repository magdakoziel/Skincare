"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Photo = {
  _id?: string
  url: string
  caption?: string
  date?: string
  createdAt?: number
  analysisResult?: {
    acneType: string
    severity: string
  }
}

type ComparisonViewProps = {
  photos: Photo[]
}

export function ComparisonView({ photos }: ComparisonViewProps) {
  const [photo1, setPhoto1] = useState<string>("")
  const [photo2, setPhoto2] = useState<string>("")
  const [selectingFor, setSelectingFor] = useState<"photo1" | "photo2" | null>(null)

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

  const sortedPhotos = [...photos].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : a.createdAt || 0
    const dateB = b.date ? new Date(b.date).getTime() : b.createdAt || 0
    return dateA - dateB
  })
  const firstPhoto = sortedPhotos.find((p, index) => (p._id || String(index)) === photo1)
  const secondPhoto = sortedPhotos.find((p, index) => (p._id || String(index)) === photo2)

  const handlePhotoSelect = (photoId: string) => {
    if (selectingFor === "photo1") {
      setPhoto1(photoId)
      setSelectingFor(null)
    } else if (selectingFor === "photo2") {
      setPhoto2(photoId)
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
              ? `Click on a photo to select it as ${selectingFor === "photo1" ? "Photo 1" : "Photo 2"}`
              : "Click Photo 1 or Photo 2 buttons below, then select a photo"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
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
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {sortedPhotos.map((photo, index) => {
                const photoId = photo._id || String(index)
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
        </CardContent>
      </Card>

      {firstPhoto && secondPhoto && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Photo 1</CardTitle>
              <p className="text-sm text-muted-foreground">
                {format(
                  firstPhoto.date ? new Date(firstPhoto.date) : (firstPhoto.createdAt ? new Date(firstPhoto.createdAt) : new Date()),
                  "MMMM d, yyyy"
                )}
              </p>
            </CardHeader>
            <CardContent>
              <img src={firstPhoto.url || "/placeholder.svg"} alt="Photo 1" className="w-full rounded-lg" />
              {firstPhoto.analysisResult && (
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Type: <span className="font-medium text-foreground">{firstPhoto.analysisResult.acneType}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Severity: <span className="font-medium text-foreground">{firstPhoto.analysisResult.severity}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Photo 2</CardTitle>
              <p className="text-sm text-muted-foreground">
                {format(
                  secondPhoto.date ? new Date(secondPhoto.date) : (secondPhoto.createdAt ? new Date(secondPhoto.createdAt) : new Date()),
                  "MMMM d, yyyy"
                )}
              </p>
            </CardHeader>
            <CardContent>
              <img src={secondPhoto.url || "/placeholder.svg"} alt="Photo 2" className="w-full rounded-lg" />
              {secondPhoto.analysisResult && (
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Type: <span className="font-medium text-foreground">{secondPhoto.analysisResult.acneType}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Severity: <span className="font-medium text-foreground">{secondPhoto.analysisResult.severity}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
