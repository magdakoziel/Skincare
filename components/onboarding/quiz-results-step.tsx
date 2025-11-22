"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Lightbulb, Heart, ShoppingBag, Loader2, Sparkles } from "lucide-react"
import type { OnboardingData } from "./onboarding-flow"
import { interpretQuizResults, generateResultSummary } from "@/lib/interpret-quiz-results"

export type QuizAIInsights = {
  primaryType: string
  secondaryTypes: string[]
  summary: string
  focusAreas: string[]
  recommendedIngredients: string[]
  lifestyleGuidance: string[]
  cautionaryNotes: string[]
  priorityActions: string[]
}

type QuizResultsStepProps = {
  data: OnboardingData
  onComplete: (extras?: { aiInsights?: QuizAIInsights | null }) => void
  onBack: () => void
}

export function QuizResultsStep({ data, onComplete, onBack }: QuizResultsStepProps) {
  const [aiInsights, setAiInsights] = useState<QuizAIInsights | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const results = interpretQuizResults(data)
  const summary = generateResultSummary(results)

  useEffect(() => {
    let cancelled = false
    const fetchInsights = async () => {
      setAiLoading(true)
      setAiError(null)
      try {
        const response = await fetch("/api/quiz-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        })
        const payload = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(payload?.error || "Gemini quiz insights failed")
        }
        if (!cancelled) {
          setAiInsights(payload)
        }
      } catch (error) {
        console.error("Quiz AI insights error:", error)
        if (!cancelled) {
          setAiError("Nie udalo sie pobrac AI insights. Pokazuje wyniki quizu offline.")
        }
      } finally {
        if (!cancelled) {
          setAiLoading(false)
        }
      }
    }

    fetchInsights()
    return () => {
      cancelled = true
    }
  }, [data])

  const resolvedPrimary = aiInsights?.primaryType || results.primaryType
  const resolvedSecondary = aiInsights?.secondaryTypes?.length ? aiInsights.secondaryTypes : results.secondaryTypes
  const resolvedSummary = aiInsights?.summary || summary
  const resolvedFocus = aiInsights?.focusAreas?.length ? aiInsights.focusAreas : results.treatmentFocus
  const resolvedProducts = aiInsights?.recommendedIngredients?.length
    ? aiInsights.recommendedIngredients
    : results.productRecommendations
  const resolvedLifestyle = aiInsights?.lifestyleGuidance?.length
    ? aiInsights.lifestyleGuidance
    : results.lifestyleRecommendations
  const resolvedCautions = aiInsights?.cautionaryNotes || []

  const isUrgent =
    resolvedPrimary.includes("Persistent") ||
    resolvedSecondary.some((t) => t.includes("Cystic") || t.includes("Nodular"))

  const handleCompleteClick = () => {
    onComplete({ aiInsights })
  }

  return (
    <div className="space-y-6">
      {aiLoading && (
        <Alert className="flex items-center gap-3">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle className="text-sm font-medium">Gemini personalization w toku...</AlertTitle>
          <AlertDescription className="text-xs">
            Dopasowujemy Twoje rekomendacje na podstawie quizu i AI analizy.
          </AlertDescription>
        </Alert>
      )}

      {aiError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>AI insights niedostępne</AlertTitle>
          <AlertDescription className="text-sm">{aiError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Personalized Skin Analysis</CardTitle>
          <CardDescription>
            {aiInsights ? "Gemini AI + quiz results" : "Based on your quiz responses, here's what we found"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border-2 border-primary bg-primary/5 p-4">
            <h3 className="mb-2 text-lg font-semibold">Assessment</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default" className="text-base px-3 py-1">
                {resolvedPrimary}
              </Badge>
              {resolvedSecondary.map((type, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm">
                  {type}
                </Badge>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line">{resolvedSummary}</p>
            {aiInsights?.priorityActions?.length ? (
              <div className="mt-3 rounded-md border border-primary/30 bg-primary/5 p-3">
                <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-primary">
                  <Sparkles className="h-4 w-4" />
                  Gemini Priority Actions
                </p>
                <ul className="space-y-1 text-sm text-primary">
                  {aiInsights.priorityActions.map((action, idx) => (
                    <li key={idx}>• {action}</li>
                  ))}
                </ul>
              </div>
            ) : null}
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

      {resolvedFocus.length > 0 && (
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
              {resolvedFocus.map((focus, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-blue-900 dark:text-blue-100">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>{focus}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {resolvedProducts.length > 0 && (
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
              {resolvedProducts.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-green-900 dark:text-green-100">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {(resolvedLifestyle.length > 0 || resolvedCautions.length > 0) && (
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
              {resolvedLifestyle.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-purple-900 dark:text-purple-100">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
            {resolvedCautions.length > 0 && (
              <div className="mt-4 rounded-md border border-purple-200/70 bg-white/60 p-3 dark:bg-purple-900/40">
                <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">Cautionary notes</p>
                <ul className="space-y-1 text-sm text-purple-800 dark:text-purple-200">
                  {resolvedCautions.map((note, idx) => (
                    <li key={idx}>• {note}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {results.lifestyleRecommendations.length > 0 && !resolvedLifestyle.length && (
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
        <Button type="button" onClick={handleCompleteClick} className="flex-1">
          Complete & Go to Dashboard
        </Button>
      </div>
    </div>
  )
}
