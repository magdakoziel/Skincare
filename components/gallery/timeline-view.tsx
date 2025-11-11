"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MoreVertical, Pencil, Trash2 } from "lucide-react"
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

type Photo = {
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
}

type TimelineViewProps = {
  photos: Photo[]
  onPhotoUpdate?: (updatedPhotos: Photo[]) => void
}

export function TimelineView({ photos, onPhotoUpdate }: TimelineViewProps) {
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
  const [editCaption, setEditCaption] = useState("")
  const [deletingPhoto, setDeletingPhoto] = useState<Photo | null>(null)

  const handleEditClick = (photo: Photo) => {
    setEditingPhoto(photo)
    setEditCaption(photo.caption || "")
  }

  const handleSaveEdit = () => {
    if (!editingPhoto || !onPhotoUpdate) return

    const updatedPhotos = photos.map(p =>
      (p._id || p.url) === (editingPhoto._id || editingPhoto.url)
        ? { ...p, caption: editCaption }
        : p
    )

    onPhotoUpdate(updatedPhotos)
    setEditingPhoto(null)
    setEditCaption("")
  }

  const handleDeleteConfirm = () => {
    if (!deletingPhoto || !onPhotoUpdate) return

    const updatedPhotos = photos.filter(p =>
      (p._id || p.url) !== (deletingPhoto._id || deletingPhoto.url)
    )

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

              <div className="space-y-4">
                {group.photos.map((photo, photoIndex) => (
                  <div key={photo._id || photoIndex} className="flex flex-col gap-4 sm:flex-row relative group">
                    <div className="absolute top-2 right-2 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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
                      className="h-48 w-full rounded-lg object-cover sm:w-48"
                    />
                    <div className="flex-1 space-y-3">
                      {photo.caption && (
                        <div>
                          <p className="text-foreground">{photo.caption}</p>
                        </div>
                      )}

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
    </div>
  )
}
