"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Droplets, Sun, Zap, Heart, AlertCircle } from "lucide-react"
import type { OnboardingData } from "./onboarding-flow"

type PrimaryConcernStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

const concerns = [
  {
    value: "acne",
    label: "Acne & Breakouts",
    description: "Pimples, blackheads, cystic acne",
    icon: Zap,
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800"
  },
  {
    value: "aging",
    label: "Wrinkles & Aging",
    description: "Fine lines, loss of elasticity, age spots",
    icon: Sun,
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800"
  },
  {
    value: "hyperpigmentation",
    label: "Dark Spots & Discoloration",
    description: "Melasma, post-acne marks, uneven skin tone",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800"
  },
  {
    value: "dryness",
    label: "Dryness & Dehydration",
    description: "Flaky skin, tightness, rough texture",
    icon: Droplets,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800"
  },
  {
    value: "sensitivity",
    label: "Redness & Sensitivity",
    description: "Irritation, rosacea, reactive skin",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    borderColor: "border-rose-200 dark:border-rose-800"
  },
  {
    value: "other",
    label: "Other / Multiple Concerns",
    description: "Combination of issues or specific concern",
    icon: AlertCircle,
    color: "from-gray-500 to-slate-500",
    bgColor: "bg-slate-50 dark:bg-slate-950/30",
    borderColor: "border-slate-200 dark:border-slate-800"
  }
]

export function PrimaryConcernStep({ data, setData, onNext, onBack }: PrimaryConcernStepProps) {
  const handleSelect = (concern: string) => {
    setData({ ...data, primaryConcern: concern })
  }

  const handleContinue = () => {
    if (data.primaryConcern) {
      onNext()
    }
  }

  return (
    <Card className="border-border">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">What's Your Main Skin Concern?</CardTitle>
        <CardDescription className="text-base">
          Select the primary issue you want to focus on. This will help us personalize your skincare plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {concerns.map((concern) => {
            const Icon = concern.icon
            const isSelected = data.primaryConcern === concern.value

            return (
              <button
                key={concern.value}
                onClick={() => handleSelect(concern.value)}
                className={`relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02] ${
                  isSelected
                    ? `${concern.borderColor} ${concern.bgColor} shadow-lg`
                    : "border-border bg-background hover:bg-accent/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${concern.color} shadow-lg`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                      {concern.label}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {concern.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${concern.color}`}>
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {data.primaryConcern && (
          <div className="rounded-lg border border-border/60 bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Good choice!</strong> The following questions will be tailored to help us understand your{" "}
              <span className="font-semibold text-foreground">
                {concerns.find(c => c.value === data.primaryConcern)?.label.toLowerCase()}
              </span>{" "}
              concerns better.
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!data.primaryConcern}
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
