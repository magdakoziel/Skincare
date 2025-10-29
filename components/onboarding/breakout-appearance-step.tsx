"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { OnboardingData } from "./onboarding-flow"

type BreakoutAppearanceStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

const appearances = [
  { value: "cysts-nodules", label: "Deep, painful cysts or nodules" },
  { value: "small-blackheads", label: "Small pimples and blackheads" },
  { value: "red-irritation", label: "Red bumps and irritation" },
  { value: "blackheads-only", label: "Mostly blackheads (clogged pores)" },
]

export function BreakoutAppearanceStep({ data, setData, onNext, onBack }: BreakoutAppearanceStepProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-2xl">What do your breakouts look like?</CardTitle>
        <CardDescription>Select the description that matches most closely</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={data.breakoutAppearance}
          onValueChange={(value) => setData({ ...data, breakoutAppearance: value })}
        >
          <div className="space-y-3">
            {appearances.map((appearance) => (
              <div
                key={appearance.value}
                className="flex items-center space-x-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <RadioGroupItem value={appearance.value} id={appearance.value} />
                <Label htmlFor={appearance.value} className="flex-1 cursor-pointer font-medium text-card-foreground">
                  {appearance.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent">
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
