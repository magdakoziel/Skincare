"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScanFace, CircleUser, Smile, User } from "lucide-react"
import type { OnboardingData } from "./onboarding-flow"

type BreakoutLocationStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

const locations = [
  {
    value: "forehead-nose",
    label: "Forehead and nose (T-zone)",
    description: "Upper face, central area",
    icon: ScanFace,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800"
  },
  {
    value: "chin-jawline",
    label: "Chin and jawline",
    description: "Lower face, hormonal area",
    icon: CircleUser,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800"
  },
  {
    value: "cheeks",
    label: "Cheeks",
    description: "Mid-face, side areas",
    icon: Smile,
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    borderColor: "border-rose-200 dark:border-rose-800"
  },
  {
    value: "back-shoulders",
    label: "Back, shoulders, or chest",
    description: "Body acne areas",
    icon: User,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800"
  },
]

export function BreakoutLocationStep({ data, setData, onNext, onBack }: BreakoutLocationStepProps) {
  const handleToggle = (value: string) => {
    const newLocations = data.breakoutLocations.includes(value)
      ? data.breakoutLocations.filter((l) => l !== value)
      : [...data.breakoutLocations, value]
    setData({ ...data, breakoutLocations: newLocations })
  }

  return (
    <Card className="border-border">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">Where do you usually get breakouts?</CardTitle>
        <CardDescription>Select all areas that apply</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {locations.map((location) => {
            const Icon = location.icon
            const isSelected = data.breakoutLocations.includes(location.value)

            return (
              <button
                key={location.value}
                onClick={() => handleToggle(location.value)}
                className={`relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02] ${
                  isSelected
                    ? `${location.borderColor} ${location.bgColor} shadow-lg`
                    : "border-border bg-background hover:bg-accent/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${location.color} shadow-lg`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                      {location.label}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {location.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${location.color}`}>
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
          <Button onClick={onNext} disabled={data.breakoutLocations.length === 0} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
