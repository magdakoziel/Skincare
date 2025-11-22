"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, Flame, Scale, AlertTriangle, Sparkles } from "lucide-react"
import type { OnboardingData } from "./onboarding-flow"

type SkinTypeStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

const skinTypes = [
  {
    value: "oily",
    label: "Oily",
    description: "Shiny, prone to breakouts",
    icon: Flame,
    color: "from-orange-500 to-yellow-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800"
  },
  {
    value: "dry",
    label: "Dry",
    description: "Tight, flaky, rough texture",
    icon: Droplets,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800"
  },
  {
    value: "combination",
    label: "Combination",
    description: "Oily T-zone, dry cheeks",
    icon: Scale,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800"
  },
  {
    value: "sensitive",
    label: "Sensitive",
    description: "Easily irritated, reactive",
    icon: AlertTriangle,
    color: "from-red-500 to-rose-500",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800"
  },
  {
    value: "normal",
    label: "Normal",
    description: "Balanced, not too oily or dry",
    icon: Sparkles,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800"
  },
]

export function SkinTypeStep({ data, setData, onNext, onBack }: SkinTypeStepProps) {
  const handleSelect = (value: string) => {
    setData({ ...data, skinType: value })
  }

  return (
    <Card className="border-border">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">What's your skin type?</CardTitle>
        <CardDescription>Select the option that best describes your skin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {skinTypes.map((type) => {
            const Icon = type.icon
            const isSelected = data.skinType === type.value

            return (
              <button
                key={type.value}
                onClick={() => handleSelect(type.value)}
                className={`relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02] ${
                  isSelected
                    ? `${type.borderColor} ${type.bgColor} shadow-lg`
                    : "border-border bg-background hover:bg-accent/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${type.color} shadow-lg`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1">
                      {type.label}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {type.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${type.color}`}>
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

        <div className="flex gap-3 pt-2">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Back
          </Button>
          <Button onClick={onNext} disabled={!data.skinType} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
