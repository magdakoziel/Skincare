"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X, Sparkles, Camera, Lightbulb } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type PhotoUploadProps = {
  onClose: () => void
  onUpload: (photo: { url: string; caption: string; analyzeNow: boolean }) => void
}

type PhotoCapture = {
  preview: string
  perspective: string
  file: File
}

export function PhotoUpload({ onClose, onUpload }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<PhotoCapture[]>([])
  const [currentPerspective, setCurrentPerspective] = useState<string>("front")
  const [caption, setCaption] = useState("")
  const [analyzeNow, setAnalyzeNow] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [isCameraMode, setIsCameraMode] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const perspectives = [
    { value: "front", label: "Front / Center" },
    { value: "left", label: "Left Profile" },
    { value: "right", label: "Right Profile" },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && photos.length < 3) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotos([...photos, {
          preview: reader.result as string,
          perspective: currentPerspective,
          file: selectedFile
        }])
      }
      reader.readAsDataURL(selectedFile)
    }
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsCameraMode(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Could not access camera. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCameraMode(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && photos.length < 3) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const dataUrl = canvas.toDataURL('image/jpeg')
            const file = new File([blob], `camera-${currentPerspective}.jpg`, { type: 'image/jpeg' })
            setPhotos([...photos, {
              preview: dataUrl,
              perspective: currentPerspective,
              file
            }])
            stopCamera()
          }
        }, 'image/jpeg', 0.95)
      }
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (photos.length === 0) return

    setUploading(true)
    try {
      // Upload all photos
      for (const photo of photos) {
        onUpload({
          url: photo.preview,
          caption: `${caption ? caption + ' - ' : ''}${perspectives.find(p => p.value === photo.perspective)?.label}`,
          analyzeNow,
        })
      }
      onClose()
    } catch (error) {
      console.error("[v0] Error uploading photo:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open onOpenChange={() => {
      stopCamera()
      onClose()
    }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Photos</DialogTitle>
          <DialogDescription>Add up to 3 photos from different angles for better analysis</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Lighting tip */}
          <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Tip for best results</p>
              <p className="text-muted-foreground">
                Take photos in good, natural lighting for the most accurate AI analysis.
                Add multiple angles (front, left profile, right profile) for comprehensive tracking.
              </p>
            </div>
          </div>

          {/* Show captured photos */}
          {photos.length > 0 && (
            <div className="space-y-2">
              <Label>Captured Photos ({photos.length}/3)</Label>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-1 left-1 right-1 text-[10px] bg-black/70 text-white px-1 py-0.5 rounded text-center">
                      {perspectives.find(p => p.value === photo.perspective)?.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {photos.length < 3 && !isCameraMode && (
            <div className="space-y-4">
              {/* Perspective selector */}
              <div className="space-y-2">
                <Label htmlFor="perspective">Photo Perspective</Label>
                <Select value={currentPerspective} onValueChange={setCurrentPerspective}>
                  <SelectTrigger id="perspective">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {perspectives.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center">
                <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-sm font-medium text-primary hover:underline">Click to upload</span>
                  <span className="text-sm text-muted-foreground"> or drag and drop</span>
                </Label>
                <Input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button onClick={startCamera} variant="outline" className="w-full bg-transparent">
                <Camera className="mr-2 h-4 w-4" />
                Take Photo with Camera
              </Button>
            </div>
          )}

          {isCameraMode && (
            <div className="space-y-4">
              {/* Perspective selector for camera */}
              <div className="space-y-2">
                <Label htmlFor="camera-perspective">Photo Perspective</Label>
                <Select value={currentPerspective} onValueChange={setCurrentPerspective}>
                  <SelectTrigger id="camera-perspective">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {perspectives.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative overflow-hidden rounded-lg">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={stopCamera} variant="outline" className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button onClick={capturePhoto} className="flex-1" disabled={photos.length >= 3}>
                  <Camera className="mr-2 h-4 w-4" />
                  Capture
                </Button>
              </div>
            </div>
          )}

          {!isCameraMode && (
            <>
              <div className="space-y-2">
                <Label htmlFor="caption">Caption (Optional)</Label>
                <Textarea
                  id="caption"
                  placeholder="Add a note about these photos..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="resize-none"
                />
              </div>

              <div className="flex items-center space-x-2 rounded-lg border border-border bg-muted/30 p-4">
                <Checkbox id="analyze" checked={analyzeNow} onCheckedChange={(checked) => setAnalyzeNow(checked === true)} />
                <Label htmlFor="analyze" className="flex flex-1 cursor-pointer items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Analyze with AI after upload</span>
                </Label>
              </div>

              {photos.length > 0 && (
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                    Cancel
                  </Button>
                  <Button onClick={handleUpload} disabled={photos.length === 0 || uploading} className="flex-1">
                    {uploading ? "Uploading..." : `Upload ${photos.length} Photo${photos.length > 1 ? 's' : ''}`}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
