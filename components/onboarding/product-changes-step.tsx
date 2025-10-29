"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { OnboardingData } from "./onboarding-flow"

type ProductChangesStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

export function ProductChangesStep({ data, setData, onNext, onBack }: ProductChangesStepProps) {
  const handleSelect = (value: string) => {
    setData({ ...data, productChanges: value })
  }

  const changesOptions = [
    { value: "no-changes", label: "No, I use the same products regularly" },
    { value: "occasional", label: "Yes, occasionally (once every few months)" },
    { value: "frequent", label: "Yes, frequently (I try new things often)" },
    { value: "recent-switch", label: "Yes, I just switched recently (within 1-2 months)" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Have you changed your skincare routine recently?</CardTitle>
        <CardDescription>New products can sometimes trigger breakouts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={data.productChanges} onValueChange={handleSelect}>
          <div className="space-y-3">
            {changesOptions.map((option) => (
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
          <Button type="button" onClick={onNext} disabled={!data.productChanges} className="flex-1">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
