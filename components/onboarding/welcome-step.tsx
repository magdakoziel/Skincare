"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Globe, User, Calendar } from "lucide-react"

type WelcomeStepProps = {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const [screeningData, setScreeningData] = useState<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem("initialScreening")
    if (saved) {
      setScreeningData(JSON.parse(saved))
    }
  }, [])

  const getCountryFlag = (code: string) => {
    const flags: Record<string, string> = {
      PL: "🇵🇱", US: "🇺🇸", GB: "🇬🇧", DE: "🇩🇪", FR: "🇫🇷",
      ES: "🇪🇸", IT: "🇮🇹", NL: "🇳🇱", SE: "🇸🇪", NO: "🇳🇴",
      DK: "🇩🇰", FI: "🇫🇮", CA: "🇨🇦", AU: "🇦🇺", JP: "🇯🇵",
      KR: "🇰🇷", CN: "🇨🇳", IN: "🇮🇳", BR: "🇧🇷", MX: "🇲🇽",
      OTHER: "🌍"
    }
    return flags[code] || "🌍"
  }

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

        {/* Show detected user info */}
        {screeningData && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary" className="gap-1.5">
              <Globe className="h-3 w-3" />
              {getCountryFlag(screeningData.country)} {screeningData.country}
            </Badge>
            <Badge variant="secondary" className="gap-1.5">
              <User className="h-3 w-3" />
              {screeningData.gender}
            </Badge>
            <Badge variant="secondary" className="gap-1.5">
              <Calendar className="h-3 w-3" />
              Age {screeningData.age}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted/50 p-4">
          <h3 className="mb-2 font-semibold text-card-foreground">What to expect:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>10 detailed questions about your skin type, breakouts, and lifestyle</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Personalized analysis of your acne type and likely causes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Product and lifestyle recommendations tailored to your needs</span>
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
