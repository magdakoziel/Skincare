"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Sun, Sparkles, Layers } from "lucide-react"
import type { OnboardingData } from "./onboarding-flow"

type MakeupSpfStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

export function MakeupSpfStep({ data, setData, onNext, onBack }: MakeupSpfStepProps) {
  const handleSelect = (value: string) => {
    setData({ ...data, makeupSpfUsage: value })
  }

  const usageOptions = [
    {
      value: "no-makeup-no-spf",
      label: "No makeup, no SPF",
      description: "Bare skin daily",
      icon: X,
      color: "from-gray-400 to-slate-500",
      bgColor: "bg-gray-50 dark:bg-gray-950/30",
      borderColor: "border-gray-200 dark:border-gray-800"
    },
    {
      value: "spf-only",
      label: "SPF only",
      description: "Daily sun protection",
      icon: Sun,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
      borderColor: "border-yellow-200 dark:border-yellow-800"
    },
    {
      value: "light-makeup-spf",
      label: "Light makeup + SPF",
      description: "Minimal coverage + protection",
      icon: Sparkles,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50 dark:bg-pink-950/30",
      borderColor: "border-pink-200 dark:border-pink-800"
    },
    {
      value: "heavy-makeup",
      label: "Heavy makeup (foundation, concealer, powder)",
      description: "Full face coverage",
      icon: Layers,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-200 dark:border-purple-800"
    },
  ]

  return (
    <Card className="border-border">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">Do you wear makeup or SPF daily?</CardTitle>
        <CardDescription>This helps us understand potential pore-clogging factors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {usageOptions.map((option) => {
            const Icon = option.icon
            const isSelected = data.makeupSpfUsage === option.value

            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02] ${
                  isSelected
                    ? `${option.borderColor} ${option.bgColor} shadow-lg`
                    : "border-border bg-background hover:bg-accent/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${option.color} shadow-lg`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                      {option.label}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {option.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${option.color}`}>
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
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button type="button" onClick={onNext} disabled={!data.makeupSpfUsage} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
