"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wind, Sparkles, Droplet, Scale } from "lucide-react"
import type { OnboardingData } from "./onboarding-flow"

type SkinFeelStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

export function SkinFeelStep({ data, setData, onNext, onBack }: SkinFeelStepProps) {
  const handleSelect = (value: string) => {
    setData({ ...data, skinFeel: value })
  }

  const skinFeelOptions = [
    {
      value: "tight-dry",
      label: "Tight and dry",
      description: "Feels stretched, needs moisture",
      icon: Wind,
      color: "from-blue-500 to-sky-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      value: "soft-balanced",
      label: "Soft and balanced",
      description: "Comfortable, not tight or oily",
      icon: Sparkles,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      value: "oily-shiny",
      label: "Oily / shiny (especially T-zone)",
      description: "Greasy feel, visible shine",
      icon: Droplet,
      color: "from-orange-500 to-yellow-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      borderColor: "border-orange-200 dark:border-orange-800"
    },
    {
      value: "combination",
      label: "Some areas oily, others dry",
      description: "Mixed skin feel zones",
      icon: Scale,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-200 dark:border-purple-800"
    },
  ]

  return (
    <Card className="border-border">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">How does your skin feel after washing your face?</CardTitle>
        <CardDescription>This helps us understand your skin's moisture balance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {skinFeelOptions.map((option) => {
            const Icon = option.icon
            const isSelected = data.skinFeel === option.value

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
          <Button type="button" onClick={onNext} disabled={!data.skinFeel} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
