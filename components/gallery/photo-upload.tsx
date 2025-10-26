"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X, Sparkles } from "lucide-react"

type PhotoUploadProps = {
  onClose: () => void
  onUpload: (photo: { url: string; caption: string; analyzeNow: boolean }) => void
}

export function PhotoUpload({ onClose, onUpload }: PhotoUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [caption, setCaption] = useState("")
  const [analyzeNow, setAnalyzeNow] = useState(true)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file || !preview) return

    setUploading(true)
    try {
      onUpload({
        url: preview,
        caption: caption || "",
        analyzeNow,
      })
      onClose()
    } catch (error) {
      console.error("[v0] Error uploading photo:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Photo</DialogTitle>
          <DialogDescription>Add a new photo to track your skin progress</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!preview ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
              <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-sm font-medium text-primary hover:underline">Click to upload</span>
                <span className="text-sm text-muted-foreground"> or drag and drop</span>
              </Label>
              <Input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
          ) : (
            <div className="relative">
              <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full rounded-lg" />
              <Button
                size="icon"
                variant="destructive"
                className="absolute right-2 top-2"
                onClick={() => {
                  setFile(null)
                  setPreview("")
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="caption">Caption (Optional)</Label>
            <Textarea
              id="caption"
              placeholder="Add a note about this photo..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="resize-none"
            />
          </div>

          <div className="flex items-center space-x-2 rounded-lg border border-border bg-muted/30 p-4">
            <Checkbox id="analyze" checked={analyzeNow} onCheckedChange={(checked: boolean) => setAnalyzeNow(!!checked)} />
            <Label htmlFor="analyze" className="flex flex-1 cursor-pointer items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Analyze with AI after upload</span>
            </Label>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || uploading} className="flex-1">
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
