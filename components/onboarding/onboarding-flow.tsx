"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { InitialScreening, type InitialScreeningData } from "./initial-screening"
import { WelcomeStep } from "./welcome-step"
import { SkinTypeStep } from "./skin-type-step"
import { BreakoutFrequencyStep } from "./breakout-frequency-step"
import { BreakoutAppearanceStep } from "./breakout-appearance-step"
import { BreakoutLocationStep } from "./breakout-location-step"
import { SkinFeelStep } from "./skin-feel-step"
import { TouchingBehaviorStep } from "./touching-behavior-step"
import { LifestyleStep } from "./lifestyle-step"
import { MakeupSpfStep } from "./makeup-spf-step"
import { ProductChangesStep } from "./product-changes-step"
import { SkinReactionStep } from "./skin-reaction-step"
import { PhotoUploadStep } from "./photo-upload-step"
import { QuizResultsStep, type QuizAIInsights } from "./quiz-results-step"
import { Progress } from "@/components/ui/progress"

export type OnboardingData = {
  skinType: string
  breakoutFrequency: string
  breakoutAppearance: string
  breakoutLocations: string[]
  skinFeel: string
  touchingBehavior: string
  lifestyle: string
  makeupSpfUsage: string
  productChanges: string
  skinReaction: string
  photoUrl?: string
  concerns: string[]
  allergies: string
  budget: string
  currentProducts: string
  goals: string
}

export function OnboardingFlow() {
  const router = useRouter()
  const [screeningCompleted, setScreeningCompleted] = useState(false)
  const [screeningData, setScreeningData] = useState<InitialScreeningData | null>(null)
  const [step, setStep] = useState(0)

  // Check if screening was already completed
  useEffect(() => {
    const saved = localStorage.getItem("initialScreening")
    if (saved) {
      setScreeningData(JSON.parse(saved))
      setScreeningCompleted(true)
    }
  }, [])
  const [data, setData] = useState<OnboardingData>({
    skinType: "",
    breakoutFrequency: "",
    breakoutAppearance: "",
    breakoutLocations: [],
    skinFeel: "",
    touchingBehavior: "",
    lifestyle: "",
    makeupSpfUsage: "",
    productChanges: "",
    skinReaction: "",
    photoUrl: "",
    concerns: [],
    allergies: "",
    budget: "",
    currentProducts: "",
    goals: "",
  })

  const handleNext = () => {
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleScreeningComplete = (screeningInfo: InitialScreeningData) => {
    setScreeningData(screeningInfo)
    setScreeningCompleted(true)
  }

  const handleComplete = async (extras?: { aiInsights?: QuizAIInsights | null }) => {
    try {
      const profilePayload = {
        ...data,
        ...screeningData,
        aiInsights: extras?.aiInsights ?? null,
      }
      localStorage.setItem("skinProfile", JSON.stringify(profilePayload))
      localStorage.setItem("onboardingCompleted", "true")
      router.push("/dashboard")
    } catch (error) {
      console.error("[v0] Error completing onboarding:", error)
    }
  }

  // Show initial screening if not completed
  if (!screeningCompleted) {
    return <InitialScreening onComplete={handleScreeningComplete} />
  }

  // Total steps excluding welcome screen
  const totalSteps = 12
  // Progress bar should only show after welcome screen, so we use step - 1
  const progress = step > 0 ? ((step - 1) / totalSteps) * 100 : 0

  const steps = [
    <WelcomeStep key="welcome" onNext={handleNext} />,
    <SkinTypeStep key="skin-type" data={data} setData={setData} onNext={handleNext} onBack={handleBack} />,
    <BreakoutFrequencyStep
      key="breakout-frequency"
      data={data}
      setData={setData}
      onNext={handleNext}
      onBack={handleBack}
    />,
    <BreakoutAppearanceStep
      key="breakout-appearance"
      data={data}
      setData={setData}
      onNext={handleNext}
      onBack={handleBack}
    />,
    <BreakoutLocationStep
      key="breakout-location"
      data={data}
      setData={setData}
      onNext={handleNext}
      onBack={handleBack}
    />,
    <SkinFeelStep key="skin-feel" data={data} setData={setData} onNext={handleNext} onBack={handleBack} />,
    <TouchingBehaviorStep
      key="touching-behavior"
      data={data}
      setData={setData}
      onNext={handleNext}
      onBack={handleBack}
    />,
    <LifestyleStep key="lifestyle" data={data} setData={setData} onNext={handleNext} onBack={handleBack} />,
    <MakeupSpfStep key="makeup-spf" data={data} setData={setData} onNext={handleNext} onBack={handleBack} />,
    <ProductChangesStep
      key="product-changes"
      data={data}
      setData={setData}
      onNext={handleNext}
      onBack={handleBack}
    />,
    <SkinReactionStep key="skin-reaction" data={data} setData={setData} onNext={handleNext} onBack={handleBack} />,
    <PhotoUploadStep key="photo-upload" data={data} setData={setData} onNext={handleNext} onBack={handleBack} />,
    <QuizResultsStep key="quiz-results" data={data} onComplete={handleComplete} onBack={handleBack} />,
  ]

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {step > 0 && (
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Step {step - 1} of {totalSteps}
          </p>
        </div>
      )}
      {steps[step]}
    </div>
  )
}
