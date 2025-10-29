"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Image as ImageIcon, Info, X } from "lucide-react"
import type { OnboardingData } from "./onboarding-flow"

type PhotoUploadStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

export function PhotoUploadStep({ data, setData, onNext, onBack }: PhotoUploadStepProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(data.photoUrl || null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setSelectedImage(result)
        setData({ ...data, photoUrl: result })
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event)
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setData({ ...data, photoUrl: "" })
  }

  const handleSkip = () => {
    setData({ ...data, photoUrl: "" })
    onNext()
  }

  const handleContinue = () => {
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Your Skin Photo (Optional)</CardTitle>
        <CardDescription>
          Upload a clear photo of your face to help us better analyze your skin concerns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>For best results:</strong>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>No makeup or filters</li>
              <li>Good, natural lighting</li>
              <li>Face the camera directly</li>
              <li>Clean, dry skin</li>
            </ul>
          </AlertDescription>
        </Alert>

        {!selectedImage ? (
          <div className="space-y-3">
            {/* Upload from Gallery */}
            <label htmlFor="gallery-upload" className="block">
              <div className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary hover:bg-accent/50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Choose from Gallery</p>
                  <p className="text-sm text-muted-foreground">Select an existing photo</p>
                </div>
              </div>
              <input
                id="gallery-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </label>

            {/* Take Photo with Camera */}
            <label htmlFor="camera-capture" className="block">
              <div className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary hover:bg-accent/50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Take a Selfie Now</p>
                  <p className="text-sm text-muted-foreground">Use your camera</p>
                </div>
              </div>
              <input
                id="camera-capture"
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={handleCameraCapture}
                disabled={isUploading}
              />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg border">
              <img src={selectedImage} alt="Selected skin photo" className="h-auto w-full object-cover" />
              <button
                onClick={handleRemoveImage}
                className="absolute right-2 top-2 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Photo added successfully! This will help us provide better recommendations.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          {selectedImage ? (
            <Button type="button" onClick={handleContinue} className="flex-1">
              Continue
            </Button>
          ) : (
            <Button type="button" variant="secondary" onClick={handleSkip} className="flex-1">
              Skip for Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
