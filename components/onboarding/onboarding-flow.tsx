"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { QuizResultsStep } from "./quiz-results-step"
import { ConcernsStep } from "./concerns-step"
import { AllergiesStep } from "./allergies-step"
import { BudgetStep } from "./budget-step"
import { AdditionalInfoStep } from "./additional-info-step"
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
  concerns: string[]
  allergies: string
  budget: string
  currentProducts: string
  goals: string
}

export function OnboardingFlow() {
  const router = useRouter()
  const [step, setStep] = useState(0)
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

  const handleComplete = async () => {
    try {
      localStorage.setItem("skinProfile", JSON.stringify(data))
      router.push("/dashboard")
    } catch (error) {
      console.error("[v0] Error completing onboarding:", error)
    }
  }

  // Total steps excluding welcome screen
  const totalSteps = 15
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
    <QuizResultsStep key="quiz-results" data={data} onComplete={handleNext} onBack={handleBack} />,
    <ConcernsStep key="concerns" data={data} setData={setData} onNext={handleNext} onBack={handleBack} />,
    <AllergiesStep key="allergies" data={data} setData={setData} onNext={handleNext} onBack={handleBack} />,
    <BudgetStep key="budget" data={data} setData={setData} onNext={handleNext} onBack={handleBack} />,
    <AdditionalInfoStep
      key="additional"
      data={data}
      setData={setData}
      onComplete={handleComplete}
      onBack={handleBack}
    />,
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
