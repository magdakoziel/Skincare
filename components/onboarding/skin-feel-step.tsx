"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { OnboardingData } from "./onboarding-flow"

type SkinFeelStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

export function SkinFeelStep({ data, setData, onNext, onBack }: SkinFeelStepProps) {
  const handleSelect = (value: string) => {
    setData({ ...data, skinFeel: value })
  }

  const skinFeelOptions = [
    { value: "tight-dry", label: "Tight and dry" },
    { value: "soft-balanced", label: "Soft and balanced" },
    { value: "oily-shiny", label: "Oily / shiny (especially T-zone)" },
    { value: "combination", label: "Some areas oily, others dry" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>How does your skin feel after washing your face?</CardTitle>
        <CardDescription>This helps us understand your skin's moisture balance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={data.skinFeel} onValueChange={handleSelect}>
          <div className="space-y-3">
            {skinFeelOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 rounded-lg border p-4">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button type="button" onClick={onNext} disabled={!data.skinFeel} className="flex-1">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
