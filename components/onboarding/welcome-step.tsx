"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

type WelcomeStepProps = {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <Card className="border-border">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-3xl">Welcome to Your Skin Journey</CardTitle>
        <CardDescription className="text-base">
          Let's get to know your skin better. This quick quiz will help us personalize your experience and provide
          tailored recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted/50 p-4">
          <h3 className="mb-2 font-semibold text-card-foreground">What to expect:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>5 quick questions about your skin type and concerns</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Personalized skincare routine recommendations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Product suggestions tailored to your needs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>AI-powered skin analysis and tracking</span>
            </li>
          </ul>
        </div>
        <Button onClick={onNext} className="w-full" size="lg">
          Get Started
        </Button>
      </CardContent>
    </Card>
  )
}
