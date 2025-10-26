"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { OnboardingData } from "./onboarding-flow"

type BudgetStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

const budgetRanges = [
  { value: "budget", label: "Budget Friendly", description: "Under $50/month" },
  { value: "moderate", label: "Moderate", description: "$50-$150/month" },
  { value: "premium", label: "Premium", description: "$150-$300/month" },
  { value: "luxury", label: "Luxury", description: "Over $300/month" },
]

export function BudgetStep({ data, setData, onNext, onBack }: BudgetStepProps) {
  const handleSelect = (value: string) => {
    setData({ ...data, budget: value })
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-2xl">What's your skincare budget?</CardTitle>
        <CardDescription>This helps us recommend products within your price range</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={data.budget} onValueChange={handleSelect} className="space-y-3">
          {budgetRanges.map((range) => (
            <div
              key={range.value}
              className="flex items-start space-x-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
            >
              <RadioGroupItem value={range.value} id={range.value} className="mt-1" />
              <Label htmlFor={range.value} className="flex-1 cursor-pointer">
                <div className="font-semibold text-card-foreground">{range.label}</div>
                <div className="text-sm text-muted-foreground">{range.description}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent">
            Back
          </Button>
          <Button onClick={onNext} disabled={!data.budget} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
