"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { OnboardingData } from "./onboarding-flow"

type ConcernsStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

const concerns = [
  { value: "acne", label: "Acne" },
  { value: "blackheads", label: "Blackheads" },
  { value: "pih", label: "Post-inflammatory hyperpigmentation (PIH) (Post-blemish marks)" },
  { value: "redness", label: "Redness" },
  { value: "scarring", label: "Scarring" },
  { value: "fine-lines", label: "Fine Lines / Wrinkles" },
  { value: "large-pores", label: "Large Pores" },
  { value: "uneven-texture", label: "Uneven Texture" },
]

export function ConcernsStep({ data, setData, onNext, onBack }: ConcernsStepProps) {
  const handleToggle = (value: string) => {
    const newConcerns = data.concerns.includes(value)
      ? data.concerns.filter((c) => c !== value)
      : [...data.concerns, value]
    setData({ ...data, concerns: newConcerns })
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-2xl">What are your main skin concerns?</CardTitle>
        <CardDescription>Select all that apply</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {concerns.map((concern) => (
            <div
              key={concern.value}
              className="flex items-center space-x-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
            >
              <Checkbox
                id={concern.value}
                checked={data.concerns.includes(concern.value)}
                onCheckedChange={() => handleToggle(concern.value)}
              />
              <Label htmlFor={concern.value} className="flex-1 cursor-pointer font-medium text-card-foreground">
                {concern.label}
              </Label>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent">
            Back
          </Button>
          <Button onClick={onNext} disabled={data.concerns.length === 0} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
