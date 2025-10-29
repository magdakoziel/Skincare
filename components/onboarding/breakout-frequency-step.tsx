"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { OnboardingData } from "./onboarding-flow"

type BreakoutFrequencyStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

const frequencies = [
  { value: "everyday", label: "Every day or almost every day" },
  { value: "few-times-month", label: "A few times a month" },
  { value: "period-stress", label: "Only before my period / during stress" },
  { value: "rarely", label: "Very rarely" },
]

export function BreakoutFrequencyStep({ data, setData, onNext, onBack }: BreakoutFrequencyStepProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-2xl">How often do you experience breakouts?</CardTitle>
        <CardDescription>This helps us understand your skin's pattern</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={data.breakoutFrequency} onValueChange={(value) => setData({ ...data, breakoutFrequency: value })}>
          <div className="space-y-3">
            {frequencies.map((freq) => (
              <div
                key={freq.value}
                className="flex items-center space-x-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <RadioGroupItem value={freq.value} id={freq.value} />
                <Label htmlFor={freq.value} className="flex-1 cursor-pointer font-medium text-card-foreground">
                  {freq.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent">
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
