"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Moon, Sparkles } from "lucide-react"
import type { OnboardingData } from "./onboarding-flow"

type BreakoutFrequencyStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

const frequencies = [
  {
    value: "everyday",
    label: "Every day or almost every day",
    description: "Persistent, daily breakouts",
    icon: Calendar,
    color: "from-red-500 to-rose-500",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800"
  },
  {
    value: "few-times-month",
    label: "A few times a month",
    description: "Regular but not constant",
    icon: Clock,
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800"
  },
  {
    value: "period-stress",
    label: "Only before my period / during stress",
    description: "Hormonal or stress-triggered",
    icon: Moon,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800"
  },
  {
    value: "rarely",
    label: "Very rarely",
    description: "Occasional, infrequent breakouts",
    icon: Sparkles,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800"
  },
]

export function BreakoutFrequencyStep({ data, setData, onNext, onBack }: BreakoutFrequencyStepProps) {
  const handleSelect = (value: string) => {
    setData({ ...data, breakoutFrequency: value })
  }

  return (
    <Card className="border-border">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">How often do you experience breakouts?</CardTitle>
        <CardDescription>This helps us understand your skin's pattern</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {frequencies.map((freq) => {
            const Icon = freq.icon
            const isSelected = data.breakoutFrequency === freq.value

            return (
              <button
                key={freq.value}
                onClick={() => handleSelect(freq.value)}
                className={`relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02] ${
                  isSelected
                    ? `${freq.borderColor} ${freq.bgColor} shadow-lg`
                    : "border-border bg-background hover:bg-accent/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${freq.color} shadow-lg`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                      {freq.label}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {freq.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${freq.color}`}>
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
          <Button onClick={onNext} disabled={!data.breakoutFrequency} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
