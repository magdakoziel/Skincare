"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { OnboardingData } from "./onboarding-flow"

type TouchingBehaviorStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

export function TouchingBehaviorStep({ data, setData, onNext, onBack }: TouchingBehaviorStepProps) {
  const handleSelect = (value: string) => {
    setData({ ...data, touchingBehavior: value })
  }

  const behaviorOptions = [
    { value: "never", label: "Never or rarely" },
    { value: "sometimes", label: "Sometimes, when stressed or bored" },
    { value: "often", label: "Often - I catch myself doing it" },
    { value: "compulsive", label: "Very often / compulsively" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Do you touch or pick at your skin often?</CardTitle>
        <CardDescription>Honest answers help us provide better guidance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={data.touchingBehavior} onValueChange={handleSelect}>
          <div className="space-y-3">
            {behaviorOptions.map((option) => (
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
          <Button type="button" onClick={onNext} disabled={!data.touchingBehavior} className="flex-1">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
