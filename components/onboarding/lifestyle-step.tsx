"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudLightning, Briefcase, Heart, Cookie } from "lucide-react"
import type { OnboardingData } from "./onboarding-flow"

type LifestyleStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

const lifestyles = [
  {
    value: "high-stress",
    label: "High stress, irregular sleep",
    description: "Stressful routine, poor sleep habits",
    icon: CloudLightning,
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800"
  },
  {
    value: "balanced-busy",
    label: "Balanced but busy",
    description: "Active schedule, decent habits",
    icon: Briefcase,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800"
  },
  {
    value: "healthy",
    label: "Healthy diet and regular exercise",
    description: "Strong wellness routine",
    icon: Heart,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800"
  },
  {
    value: "processed-food",
    label: "Lots of processed food or sugar",
    description: "High sugar/processed diet",
    icon: Cookie,
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800"
  },
]

export function LifestyleStep({ data, setData, onNext, onBack }: LifestyleStepProps) {
  const handleSelect = (value: string) => {
    setData({ ...data, lifestyle: value })
  }

  return (
    <Card className="border-border">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">How would you describe your current lifestyle?</CardTitle>
        <CardDescription>Lifestyle factors can affect your skin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {lifestyles.map((lifestyle) => {
            const Icon = lifestyle.icon
            const isSelected = data.lifestyle === lifestyle.value

            return (
              <button
                key={lifestyle.value}
                onClick={() => handleSelect(lifestyle.value)}
                className={`relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02] ${
                  isSelected
                    ? `${lifestyle.borderColor} ${lifestyle.bgColor} shadow-lg`
                    : "border-border bg-background hover:bg-accent/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${lifestyle.color} shadow-lg`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                      {lifestyle.label}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {lifestyle.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${lifestyle.color}`}>
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
          <Button onClick={onNext} disabled={!data.lifestyle} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
