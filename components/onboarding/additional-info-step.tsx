"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { OnboardingData } from "./onboarding-flow"

type AdditionalInfoStepProps = {
  data: OnboardingData
  setData: (data: OnboardingData) => void
  onComplete: () => void
  onBack: () => void
}

export function AdditionalInfoStep({ data, setData, onComplete, onBack }: AdditionalInfoStepProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-2xl">Almost done!</CardTitle>
        <CardDescription>Share any additional information to help us personalize your experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="current-products">Current Products (Optional)</Label>
          <Textarea
            id="current-products"
            placeholder="List any products you're currently using..."
            value={data.currentProducts}
            onChange={(e) => setData({ ...data, currentProducts: e.target.value })}
            className="min-h-24 resize-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="goals">Your Skincare Goals (Optional)</Label>
          <Textarea
            id="goals"
            placeholder="What do you hope to achieve with your skincare routine?"
            value={data.goals}
            onChange={(e) => setData({ ...data, goals: e.target.value })}
            className="min-h-24 resize-none"
          />
        </div>
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent">
            Back
          </Button>
          <Button onClick={onComplete} className="flex-1">
            Complete Setup
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
