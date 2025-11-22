"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MoreVertical, Pencil, Trash2, Sparkles } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PhotoAnalysisResult } from "@/components/gallery/photo-analysis-result"
import type { PhotoAnalysisResult as AnalysisResult } from "@/lib/analyze-photo"

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

type TimelineViewProps = {
  photos: Photo[]
  onPhotoUpdate?: (updatedPhotos: Photo[]) => void
}

export function TimelineView({ photos, onPhotoUpdate }: TimelineViewProps) {
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
  const [editCaption, setEditCaption] = useState("")
  const [deletingPhoto, setDeletingPhoto] = useState<Photo | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  const getPhotoKey = (photo: Photo) => photo.id || photo._id || photo.url

  const handleEditClick = (photo: Photo) => {
    setEditingPhoto(photo)
    setEditCaption(photo.caption || "")
  }

  const handleSaveEdit = () => {
    if (!editingPhoto || !onPhotoUpdate) return

    const updatedPhotos = photos.map((p) =>
      getPhotoKey(p) === getPhotoKey(editingPhoto)
        ? { ...p, caption: editCaption }
        : p,
    )

    onPhotoUpdate(updatedPhotos)
    setEditingPhoto(null)
    setEditCaption("")
  }

  const handleDeleteConfirm = () => {
    if (!deletingPhoto || !onPhotoUpdate) return

    const updatedPhotos = photos.filter((p) => getPhotoKey(p) !== getPhotoKey(deletingPhoto))

    onPhotoUpdate(updatedPhotos)
    setDeletingPhoto(null)
  }
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
        <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">No photos yet</h3>
        <p className="text-sm text-muted-foreground">Upload your first photo to start tracking your skin journey</p>
      </div>
    )
  }

  const sortedPhotos = [...photos].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : a.createdAt || 0
    const dateB = b.date ? new Date(b.date).getTime() : b.createdAt || 0
    return dateB - dateA
  })

  // Group photos by date
  const groupedByDate = sortedPhotos.reduce((groups, photo) => {
    const photoDate = photo.date ? new Date(photo.date) : (photo.createdAt ? new Date(photo.createdAt) : new Date())
    const dateKey = format(photoDate, "yyyy-MM-dd")

    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: photoDate,
        photos: []
      }
    }
    groups[dateKey].photos.push(photo)
    return groups
  }, {} as Record<string, { date: Date; photos: Photo[] }>)

  const groupedArray = Object.values(groupedByDate)

  return (
    <div className="space-y-6">
      {groupedArray.map((group, groupIndex) => (
        <div key={format(group.date, "yyyy-MM-dd")} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              {groupIndex + 1}
            </div>
            {groupIndex < groupedArray.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
          </div>

          <Card className="flex-1 border-border">
            <CardContent className="p-4">
              <div className="mb-4">
                <p className="text-lg font-semibold text-foreground">
                  {format(group.date, "MMMM d, yyyy")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {group.photos.length} photo{group.photos.length > 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.photos.map((photo, photoIndex) => (
                  <div
                    key={getPhotoKey(photo) || photoIndex}
                    className="relative group rounded-lg border border-border p-3 hover:border-primary/50 transition-colors"
                  >
                    <div className="absolute top-2 right-2 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-background/80 backdrop-blur-sm md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-sm"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            disabled={!photo.analysisDetails}
                            onClick={() => photo.analysisDetails && setAnalysisResult(photo.analysisDetails)}
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            View AI Analysis
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClick(photo)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Caption
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingPhoto(photo)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <img
                      src={photo.url || "/placeholder.svg"}
                      alt={photo.caption || "Skin photo"}
                      className="w-full aspect-square rounded-lg object-cover mb-3"
                    />
                    <div className="space-y-2">
                      {photo.caption && (
                        <div>
                          <p className="text-sm text-foreground line-clamp-2">{photo.caption}</p>
                        </div>
                      )}

                      {photo.analysisResult && (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1.5">
                            <Badge variant="secondary" className="text-xs">{photo.analysisResult.acneType}</Badge>
                            <Badge variant="outline" className="text-xs">{photo.analysisResult.severity}</Badge>
                          </div>
                          {photo.analysisResult.affectedAreas.length > 0 && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {photo.analysisResult.affectedAreas.join(", ")}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}

      {/* Edit Caption Dialog */}
      <Dialog open={!!editingPhoto} onOpenChange={() => setEditingPhoto(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Caption</DialogTitle>
            <DialogDescription>Update the caption for this photo</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="Add a caption for this photo..."
                className="resize-none"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPhoto(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingPhoto} onOpenChange={() => setDeletingPhoto(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this photo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!analysisResult} onOpenChange={(open) => !open && setAnalysisResult(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          {analysisResult && <PhotoAnalysisResult result={analysisResult} onClose={() => setAnalysisResult(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
