"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { PhotoAnalysisResult } from "@/lib/analyze-photo"
import { AlertCircle, CheckCircle2, MapPin, TrendingUp, BookOpen } from "lucide-react"
import Link from "next/link"

type PhotoAnalysisResultProps = {
  result: PhotoAnalysisResult
  onClose?: () => void
}

export function PhotoAnalysisResult({ result, onClose }: PhotoAnalysisResultProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "clear":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "mild":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "severe":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600 dark:text-green-400"
    if (confidence >= 0.6) return "text-yellow-600 dark:text-yellow-400"
    return "text-orange-600 dark:text-orange-400"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">AI Analysis Results</CardTitle>
              <CardDescription className="mt-1">Analysis completed successfully</CardDescription>
            </div>
            <Badge className={getSeverityColor(result.severity)}>
              {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)} Severity
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Estimated Count</p>
                <p className="text-lg font-semibold">{result.estimatedCount} blemishes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Affected Areas</p>
                <p className="text-lg font-semibold">{result.affectedAreas.join(", ")}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detected Acne Types */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Detected Acne Types
          </CardTitle>
          <CardDescription>Based on visual analysis of your photo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.detectedAcneTypes.map((detection, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{detection.type.name}</h3>
                  <p className="text-sm text-muted-foreground">{detection.type.medicalName}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${getConfidenceColor(detection.confidence)}`}>
                    {Math.round(detection.confidence * 100)}% confidence
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {detection.type.severity}
                  </Badge>
                </div>
              </div>
              <Separator className="my-3" />
              <div>
                <p className="mb-2 text-sm font-medium">Detected in:</p>
                <div className="flex flex-wrap gap-2">
                  {detection.locations.map((location, locIdx) => (
                    <Badge key={locIdx} variant="secondary">
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">{detection.type.description}</p>
              </div>
            </div>
          ))}

          <Link href="/glossary">
            <Button variant="outline" className="w-full">
              <BookOpen className="mr-2 h-4 w-4" />
              Learn More in Acne Glossary
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
            <CheckCircle2 className="h-5 w-5" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            Based on your detected acne types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-200 text-xs font-bold text-green-800 dark:bg-green-800 dark:text-green-200">
                  {idx + 1}
                </span>
                <p className="text-sm text-green-900 dark:text-green-100">{rec}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Important Note for Severe Cases */}
      {result.severity === "severe" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Medical Attention Recommended</AlertTitle>
          <AlertDescription>
            Your analysis indicates severe acne that may require professional medical treatment. We strongly recommend
            scheduling an appointment with a dermatologist for proper diagnosis and prescription treatment options.
          </AlertDescription>
        </Alert>
      )}

      {/* Disclaimer */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription className="text-sm">
          This AI analysis is for educational and tracking purposes only. It is not a medical diagnosis and should not
          replace professional dermatological advice. For persistent or severe acne, please consult a healthcare
          provider.
        </AlertDescription>
      </Alert>

      {onClose && (
        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      )}
    </div>
  )
}
