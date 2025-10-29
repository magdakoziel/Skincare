"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { OnboardingData } from "./onboarding-flow"

type MakeupSpfStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

export function MakeupSpfStep({ data, setData, onNext, onBack }: MakeupSpfStepProps) {
  const handleSelect = (value: string) => {
    setData({ ...data, makeupSpfUsage: value })
  }

  const usageOptions = [
    { value: "no-makeup-no-spf", label: "No makeup, no SPF" },
    { value: "spf-only", label: "SPF only" },
    { value: "light-makeup-spf", label: "Light makeup + SPF" },
    { value: "heavy-makeup", label: "Heavy makeup (foundation, concealer, powder)" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Do you wear makeup or SPF daily?</CardTitle>
        <CardDescription>This helps us understand potential pore-clogging factors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={data.makeupSpfUsage} onValueChange={handleSelect}>
          <div className="space-y-3">
            {usageOptions.map((option) => (
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
          <Button type="button" onClick={onNext} disabled={!data.makeupSpfUsage} className="flex-1">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
