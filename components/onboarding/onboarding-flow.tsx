"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { WelcomeStep } from "./welcome-step"
import { SkinTypeStep } from "./skin-type-step"
import { ConcernsStep } from "./concerns-step"
import { AllergiesStep } from "./allergies-step"
import { BudgetStep } from "./budget-step"
import { AdditionalInfoStep } from "./additional-info-step"
import { Progress } from "@/components/ui/progress"

export type OnboardingData = {
  skinType: string
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

  const totalSteps = 6
  const progress = (step / totalSteps) * 100

  const steps = [
    <WelcomeStep key="welcome" onNext={handleNext} />,
    <SkinTypeStep key="skin-type" data={data} setData={setData} onNext={handleNext} onBack={handleBack} />,
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
            Step {step} of {totalSteps}
          </p>
        </div>
      )}
      {steps[step]}
    </div>
  )
}
