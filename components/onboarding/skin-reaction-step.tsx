"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { OnboardingData } from "./onboarding-flow"

type SkinReactionStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

export function SkinReactionStep({ data, setData, onNext, onBack }: SkinReactionStepProps) {
  const handleSelect = (value: string) => {
    setData({ ...data, skinReaction: value })
  }

  const reactionOptions = [
    { value: "no-reaction", label: "No reaction - skin is stable" },
    { value: "mild-irritation", label: "Mild irritation / slight redness" },
    { value: "new-breakouts", label: "New breakouts or clogged pores" },
    { value: "severe-reaction", label: "Severe reaction (burning, peeling, rash)" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Does your skin react badly to new products?</CardTitle>
        <CardDescription>Understanding sensitivity helps us recommend suitable products</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={data.skinReaction} onValueChange={handleSelect}>
          <div className="space-y-3">
            {reactionOptions.map((option) => (
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
          <Button type="button" onClick={onNext} disabled={!data.skinReaction} className="flex-1">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
