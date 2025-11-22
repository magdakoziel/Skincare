"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Globe, User, Calendar } from "lucide-react"

export type InitialScreeningData = {
  country: string
  gender: string
  age: string
  detectedLanguage: string
}

type InitialScreeningProps = {
  onComplete: (data: InitialScreeningData) => void
}

const countries = [
  { code: "PL", name: "Poland", flag: "🇵🇱", language: "pl" },
  { code: "US", name: "United States", flag: "🇺🇸", language: "en" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", language: "en" },
  { code: "DE", name: "Germany", flag: "🇩🇪", language: "de" },
  { code: "FR", name: "France", flag: "🇫🇷", language: "fr" },
  { code: "ES", name: "Spain", flag: "🇪🇸", language: "es" },
  { code: "IT", name: "Italy", flag: "🇮🇹", language: "it" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", language: "nl" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", language: "sv" },
  { code: "NO", name: "Norway", flag: "🇳🇴", language: "no" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", language: "da" },
  { code: "FI", name: "Finland", flag: "🇫🇮", language: "fi" },
  { code: "CA", name: "Canada", flag: "🇨🇦", language: "en" },
  { code: "AU", name: "Australia", flag: "🇦🇺", language: "en" },
  { code: "JP", name: "Japan", flag: "🇯🇵", language: "ja" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", language: "ko" },
  { code: "CN", name: "China", flag: "🇨🇳", language: "zh" },
  { code: "IN", name: "India", flag: "🇮🇳", language: "en" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", language: "pt" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", language: "es" },
  { code: "OTHER", name: "Other", flag: "🌍", language: "en" }
]

const genders = [
  { value: "female", label: "Female", icon: "♀️" },
  { value: "male", label: "Male", icon: "♂️" },
  { value: "non-binary", label: "Non-binary", icon: "⚧️" },
  { value: "prefer-not-to-say", label: "Prefer not to say", icon: "—" }
]

export function InitialScreening({ onComplete }: InitialScreeningProps) {
  const [country, setCountry] = useState("")
  const [gender, setGender] = useState("")
  const [age, setAge] = useState("")

  const handleSubmit = () => {
    if (!country || !gender || !age) {
      return
    }

    const selectedCountry = countries.find(c => c.code === country)
    const detectedLanguage = selectedCountry?.language || "en"

    const data: InitialScreeningData = {
      country,
      gender,
      age,
      detectedLanguage
    }

    // Save to localStorage
    localStorage.setItem("initialScreening", JSON.stringify(data))

    onComplete(data)
  }

  const isValid = country && gender && age && parseInt(age) >= 10 && parseInt(age) <= 120

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `
          radial-gradient(1200px 800px at 10% -10%, hsl(320 60% 80% / 0.3), transparent 60%),
          radial-gradient(1000px 700px at 110% 10%, hsl(280 70% 75% / 0.25), transparent 55%),
          radial-gradient(900px 600px at 50% 120%, hsl(340 65% 85% / 0.2), transparent 60%),
          hsl(var(--background))
        `
      }}>
      <Card className="w-full max-w-lg bg-background/60 backdrop-blur-md border-border/40 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200 dark:from-purple-800 dark:via-pink-800 dark:to-rose-800 flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Globe className="h-8 w-8 text-purple-700 dark:text-purple-200" />
          </div>
          <CardTitle className="text-2xl md:text-3xl">Welcome to SkinCare</CardTitle>
          <CardDescription className="text-base">
            Help us personalize your experience by telling us a bit about yourself
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Country Selection */}
          <div className="space-y-2">
            <Label htmlFor="country" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Where are you from?
            </Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country" className="bg-background/50">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <span className="flex items-center gap-2">
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {country && (
              <p className="text-xs text-muted-foreground">
                We'll suggest {countries.find(c => c.code === country)?.language.toUpperCase()} as your language
              </p>
            )}
          </div>

          {/* Gender Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Gender
            </Label>
            <p className="text-xs text-muted-foreground mb-3">
              This helps us provide more relevant skincare advice, as hormonal factors can differ
            </p>
            <div className="grid grid-cols-2 gap-3">
              {genders.map((g) => (
                <Button
                  key={g.value}
                  variant={gender === g.value ? "default" : "outline"}
                  onClick={() => setGender(g.value)}
                  className="h-auto py-4 flex flex-col gap-2 bg-background/50 hover:bg-background/80"
                >
                  <span className="text-2xl">{g.icon}</span>
                  <span className="text-sm">{g.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Age Input */}
          <div className="space-y-2">
            <Label htmlFor="age" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Age
            </Label>
            <p className="text-xs text-muted-foreground mb-3">
              Age is important for understanding skin concerns (teenage acne, adult hormonal acne, aging skin, etc.)
            </p>
            <Input
              id="age"
              type="number"
              min="10"
              max="120"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="bg-background/50"
            />
            {age && (parseInt(age) < 10 || parseInt(age) > 120) && (
              <p className="text-xs text-destructive">
                Please enter a valid age between 10 and 120
              </p>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="rounded-lg border border-border/60 bg-muted/40 p-4">
            <p className="text-xs text-muted-foreground">
              🔒 <strong>Privacy:</strong> This information is stored locally on your device and helps us personalize your skincare recommendations. We never share your data.
            </p>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full h-12 text-base bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 hover:shadow-lg hover:shadow-primary/30"
          >
            Continue to Skin Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
