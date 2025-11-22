"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, AlertCircle, Eye, HandMetal } from "lucide-react"
import type { OnboardingData } from "./onboarding-flow"

type TouchingBehaviorStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

export function TouchingBehaviorStep({ data, setData, onNext, onBack }: TouchingBehaviorStepProps) {
  const handleSelect = (value: string) => {
    setData({ ...data, touchingBehavior: value })
  }

  const behaviorOptions = [
    {
      value: "never",
      label: "Never or rarely",
      description: "Hands-off approach",
      icon: Check,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      value: "sometimes",
      label: "Sometimes, when stressed or bored",
      description: "Occasional touching habit",
      icon: AlertCircle,
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
      borderColor: "border-yellow-200 dark:border-yellow-800"
    },
    {
      value: "often",
      label: "Often - I catch myself doing it",
      description: "Frequent touching or picking",
      icon: Eye,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      borderColor: "border-orange-200 dark:border-orange-800"
    },
    {
      value: "compulsive",
      label: "Very often / compulsively",
      description: "Hard to control urge",
      icon: HandMetal,
      color: "from-red-500 to-rose-600",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      borderColor: "border-red-200 dark:border-red-800"
    },
  ]

  return (
    <Card className="border-border">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">Do you touch or pick at your skin often?</CardTitle>
        <CardDescription>Honest answers help us provide better guidance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {behaviorOptions.map((option) => {
            const Icon = option.icon
            const isSelected = data.touchingBehavior === option.value

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
          <Button type="button" onClick={onNext} disabled={!data.touchingBehavior} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
