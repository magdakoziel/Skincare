"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Lightbulb, Heart, ShoppingBag } from "lucide-react"
import type { OnboardingData } from "./onboarding-flow"
import { interpretQuizResults, generateResultSummary } from "@/lib/interpret-quiz-results"

type QuizResultsStepProps = {
  data: OnboardingData
  onComplete: () => void
  onBack: () => void
}

export function QuizResultsStep({ data, onComplete, onBack }: QuizResultsStepProps) {
  const results = interpretQuizResults(data)
  const summary = generateResultSummary(results)

  const isUrgent =
    results.primaryType.includes("Persistent") ||
    results.secondaryTypes.some((t) => t.includes("Cystic") || t.includes("Nodular"))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Personalized Skin Analysis</CardTitle>
          <CardDescription>Based on your quiz responses, here's what we found</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border-2 border-primary bg-primary/5 p-4">
            <h3 className="mb-2 text-lg font-semibold">Assessment</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default" className="text-base px-3 py-1">
                {results.primaryType}
              </Badge>
              {results.secondaryTypes.map((type, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm">
                  {type}
                </Badge>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line">{summary}</p>
          </div>
        </CardContent>
      </Card>

      {isUrgent && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Professional Consultation Recommended</AlertTitle>
          <AlertDescription>
            Based on your responses, we strongly recommend scheduling an appointment with a dermatologist. Severe or
            persistent acne often requires prescription treatment for best results and to prevent scarring.
          </AlertDescription>
        </Alert>
      )}

      {results.likelyCauses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Likely Contributing Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.likelyCauses.map((cause, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    {idx + 1}
                  </span>
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {results.treatmentFocus.length > 0 && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Heart className="h-5 w-5" />
              Treatment Focus Areas
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              What to prioritize in your skincare routine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.treatmentFocus.map((focus, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-blue-900 dark:text-blue-100">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>{focus}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {results.productRecommendations.length > 0 && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
              <ShoppingBag className="h-5 w-5" />
              Product Recommendations
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              Ingredients and products to look for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.productRecommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-green-900 dark:text-green-100">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {results.lifestyleRecommendations.length > 0 && (
        <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
              <Heart className="h-5 w-5" />
              Lifestyle & Habit Recommendations
            </CardTitle>
            <CardDescription className="text-purple-700 dark:text-purple-300">
              Changes that can help improve your skin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.lifestyleRecommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-purple-900 dark:text-purple-100">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Separator />

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important Reminder</AlertTitle>
        <AlertDescription className="text-sm">
          This assessment is for educational and tracking purposes only. It is not a medical diagnosis and should not
          replace professional dermatological advice. For persistent or severe acne, please consult a healthcare
          provider.
        </AlertDescription>
      </Alert>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="button" onClick={onComplete} className="flex-1">
          Complete & Go to Dashboard
        </Button>
      </div>
    </div>
  )
}
