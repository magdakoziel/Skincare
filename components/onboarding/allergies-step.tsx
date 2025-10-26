"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { OnboardingData } from "./onboarding-flow"

type AllergiesStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onNext: () => void
  onBack: () => void
}

export function AllergiesStep({ data, setData, onNext, onBack }: AllergiesStepProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-2xl">Do you have any known allergies?</CardTitle>
        <CardDescription>List any ingredients or products you're allergic to (optional)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Textarea
          placeholder="e.g., fragrance, salicylic acid, benzoyl peroxide..."
          value={data.allergies}
          onChange={(e) => setData({ ...data, allergies: e.target.value })}
          className="min-h-32 resize-none"
        />
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent">
            Back
          </Button>
          <Button onClick={onNext} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
