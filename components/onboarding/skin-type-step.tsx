"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { OnboardingData } from "./onboarding-flow"

type SkinTypeStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

const skinTypes = [
  { value: "oily", label: "Oily", description: "Shiny, prone to breakouts" },
  { value: "dry", label: "Dry", description: "Tight, flaky, rough texture" },
  { value: "combination", label: "Combination", description: "Oily T-zone, dry cheeks" },
  { value: "sensitive", label: "Sensitive", description: "Easily irritated, reactive" },
  { value: "normal", label: "Normal", description: "Balanced, not too oily or dry" },
]

export function SkinTypeStep({ data, setData, onNext, onBack }: SkinTypeStepProps) {
  const handleSelect = (value: string) => {
    setData({ ...data, skinType: value })
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-2xl">What's your skin type?</CardTitle>
        <CardDescription>Select the option that best describes your skin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={data.skinType} onValueChange={handleSelect} className="space-y-3">
          {skinTypes.map((type) => (
            <div
              key={type.value}
              className="flex items-start space-x-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
            >
              <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
              <Label htmlFor={type.value} className="flex-1 cursor-pointer">
                <div className="font-semibold text-card-foreground">{type.label}</div>
                <div className="text-sm text-muted-foreground">{type.description}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent">
            Back
          </Button>
          <Button onClick={onNext} disabled={!data.skinType} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
