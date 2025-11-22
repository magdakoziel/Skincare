"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mountain, Circle, Flame, CircleDot } from "lucide-react"
import type { OnboardingData } from "./onboarding-flow"

type BreakoutAppearanceStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

const appearances = [
  {
    value: "cysts-nodules",
    label: "Deep, painful cysts or nodules",
    description: "Under-skin, large, inflamed bumps",
    icon: Mountain,
    color: "from-red-600 to-rose-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800"
  },
  {
    value: "small-blackheads",
    label: "Small pimples and blackheads",
    description: "Surface-level, visible pores",
    icon: Circle,
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800"
  },
  {
    value: "red-irritation",
    label: "Red bumps and irritation",
    description: "Inflamed, sensitive areas",
    icon: Flame,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
    borderColor: "border-pink-200 dark:border-pink-800"
  },
  {
    value: "blackheads-only",
    label: "Mostly blackheads (clogged pores)",
    description: "Dark spots in pores, not inflamed",
    icon: CircleDot,
    color: "from-slate-500 to-gray-600",
    bgColor: "bg-slate-50 dark:bg-slate-950/30",
    borderColor: "border-slate-200 dark:border-slate-800"
  },
]

export function BreakoutAppearanceStep({ data, setData, onNext, onBack }: BreakoutAppearanceStepProps) {
  const handleSelect = (value: string) => {
    setData({ ...data, breakoutAppearance: value })
  }

  return (
    <Card className="border-border">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">What do your breakouts look like?</CardTitle>
        <CardDescription>Select the description that matches most closely</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {appearances.map((appearance) => {
            const Icon = appearance.icon
            const isSelected = data.breakoutAppearance === appearance.value

            return (
              <button
                key={appearance.value}
                onClick={() => handleSelect(appearance.value)}
                className={`relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02] ${
                  isSelected
                    ? `${appearance.borderColor} ${appearance.bgColor} shadow-lg`
                    : "border-border bg-background hover:bg-accent/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${appearance.color} shadow-lg`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                      {appearance.label}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {appearance.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${appearance.color}`}>
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
          <Button onClick={onNext} disabled={!data.breakoutAppearance} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
