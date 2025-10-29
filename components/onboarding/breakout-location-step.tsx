"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { OnboardingData } from "./onboarding-flow"

type BreakoutLocationStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

const locations = [
  { value: "forehead-nose", label: "Forehead and nose (T-zone)" },
  { value: "chin-jawline", label: "Chin and jawline" },
  { value: "cheeks", label: "Cheeks" },
  { value: "back-shoulders", label: "Back, shoulders, or chest" },
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
      <CardHeader>
        <CardTitle className="text-2xl">Where do you usually get breakouts?</CardTitle>
        <CardDescription>Select all areas that apply</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3">
          {locations.map((location) => (
            <div
              key={location.value}
              className="flex items-center space-x-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
            >
              <Checkbox
                id={location.value}
                checked={data.breakoutLocations.includes(location.value)}
                onCheckedChange={() => handleToggle(location.value)}
              />
              <Label htmlFor={location.value} className="flex-1 cursor-pointer font-medium text-card-foreground">
                {location.label}
              </Label>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent">
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
