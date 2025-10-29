"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { OnboardingData } from "./onboarding-flow"

type LifestyleStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

const lifestyles = [
  { value: "high-stress", label: "High stress, irregular sleep" },
  { value: "balanced-busy", label: "Balanced but busy" },
  { value: "healthy", label: "Healthy diet and regular exercise" },
  { value: "processed-food", label: "Lots of processed food or sugar" },
]

export function LifestyleStep({ data, setData, onNext, onBack }: LifestyleStepProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-2xl">How would you describe your current lifestyle?</CardTitle>
        <CardDescription>Lifestyle factors can affect your skin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={data.lifestyle} onValueChange={(value) => setData({ ...data, lifestyle: value })}>
          <div className="space-y-3">
            {lifestyles.map((lifestyle) => (
              <div
                key={lifestyle.value}
                className="flex items-center space-x-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <RadioGroupItem value={lifestyle.value} id={lifestyle.value} />
                <Label htmlFor={lifestyle.value} className="flex-1 cursor-pointer font-medium text-card-foreground">
                  {lifestyle.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent">
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
