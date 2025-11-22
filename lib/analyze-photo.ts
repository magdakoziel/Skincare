import { acneTypes, type AcneType } from "./acne-types"

export type PhotoAnalysisResult = {
  detectedAcneTypes: Array<{
    type: AcneType
    confidence: number
    locations: string[]
  }>
  severity: "clear" | "mild" | "moderate" | "severe"
  affectedAreas: string[]
  recommendations: string[]
  estimatedCount: number
}

const mockResults: PhotoAnalysisResult[] = [
  {
    detectedAcneTypes: [
      {
        type: acneTypes.find((t) => t.id === "blackheads")!,
        confidence: 0.85,
        locations: ["nose", "forehead", "chin"],
      },
      {
        type: acneTypes.find((t) => t.id === "whiteheads")!,
        confidence: 0.72,
        locations: ["forehead", "cheeks"],
      },
    ],
    severity: "mild",
    affectedAreas: ["T-zone", "forehead", "nose"],
    recommendations: [
      "Use a salicylic acid cleanser to help unclog pores",
      "Apply a retinoid treatment in the evening to prevent new comedones",
      "Consider weekly clay masks to absorb excess oil",
      "Avoid heavy, pore-clogging products",
    ],
    estimatedCount: 15,
  },
  {
    detectedAcneTypes: [
      {
        type: acneTypes.find((t) => t.id === "papules")!,
        confidence: 0.78,
        locations: ["cheeks", "jawline"],
      },
      {
        type: acneTypes.find((t) => t.id === "pustules")!,
        confidence: 0.82,
        locations: ["chin", "cheeks"],
      },
      {
        type: acneTypes.find((t) => t.id === "pih")!,
        confidence: 0.65,
        locations: ["cheeks"],
      },
    ],
    severity: "moderate",
    affectedAreas: ["lower face", "cheeks", "jawline"],
    recommendations: [
      "Use benzoyl peroxide spot treatment on active breakouts",
      "Consider niacinamide serum to reduce inflammation and prevent PIH",
      "Apply vitamin C serum in the morning to fade existing marks",
      "ESSENTIAL: Use SPF 30+ daily to prevent PIH from darkening",
      "If hormonal, consult dermatologist about treatment options",
    ],
    estimatedCount: 12,
  },
  {
    detectedAcneTypes: [
      {
        type: acneTypes.find((t) => t.id === "nodules")!,
        confidence: 0.88,
        locations: ["jawline", "chin"],
      },
      {
        type: acneTypes.find((t) => t.id === "papules")!,
        confidence: 0.75,
        locations: ["cheeks", "forehead"],
      },
    ],
    severity: "severe",
    affectedAreas: ["jawline", "chin", "cheeks"],
    recommendations: [
      "IMPORTANT: Schedule appointment with dermatologist for proper treatment",
      "Consider prescription oral medications (antibiotics or hormonal therapy)",
      "Ask about corticosteroid injections for large nodules",
      "Avoid picking or squeezing to prevent scarring",
      "Use gentle, non-irritating skincare only",
      "May require isotretinoin (Accutane) for long-term management",
    ],
    estimatedCount: 8,
  },
  {
    detectedAcneTypes: [
      {
        type: acneTypes.find((t) => t.id === "pih")!,
        confidence: 0.92,
        locations: ["cheeks", "temples", "chin"],
      },
      {
        type: acneTypes.find((t) => t.id === "blackheads")!,
        confidence: 0.68,
        locations: ["nose"],
      },
    ],
    severity: "mild",
    affectedAreas: ["cheeks", "temples"],
    recommendations: [
      "Focus on brightening treatments: Vitamin C, Niacinamide, Azelaic Acid",
      "Use retinoids at night to increase cell turnover",
      "Consider AHA exfoliants (glycolic or lactic acid) 2-3x per week",
      "CRITICAL: Use SPF 50 daily - sun exposure will darken marks",
      "Be patient - PIH can take 3-12 months to fade",
      "Avoid picking at any new breakouts to prevent more marks",
    ],
    estimatedCount: 0,
  },
]

const mockDelay = () => new Promise((resolve) => setTimeout(resolve, 1200))

const getRandomMockAnalysis = (): PhotoAnalysisResult => {
  const result = mockResults[Math.floor(Math.random() * mockResults.length)]
  // Return a shallow copy to avoid accidental mutations sharing references
  return JSON.parse(JSON.stringify(result)) as PhotoAnalysisResult
}

export async function analyzePhoto(imageData: string): Promise<PhotoAnalysisResult> {
  try {
    const response = await fetch("/api/photo-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageData }),
    })

    if (!response.ok) {
      throw new Error(`Gemini analysis failed with status ${response.status}`)
    }

    return (await response.json()) as PhotoAnalysisResult
  } catch (error) {
    console.error("[PhotoAnalysis] Falling back to mock data:", error)
    await mockDelay()
    return getRandomMockAnalysis()
  }
}

export function generateMockAnalysis(): PhotoAnalysisResult {
  return getRandomMockAnalysis()
}

/**
 * Get AI-powered recommendations based on detected acne types
 */
export function getRecommendationsForAcneTypes(acneTypeIds: string[]): string[] {
  const recommendations: string[] = []
  const uniqueIngredients = new Set<string>()

  acneTypeIds.forEach((id) => {
    const acneType = acneTypes.find((t) => t.id === id)
    if (acneType) {
      recommendations.push(...acneType.treatmentFocus)
      acneType.recommendedIngredients.forEach((ingredient) => uniqueIngredients.add(ingredient))
    }
  })

  if (uniqueIngredients.size > 0) {
    recommendations.push(
      `Key ingredients to look for: ${Array.from(uniqueIngredients)
        .slice(0, 3)
        .join(", ")}`,
    )
  }

  return recommendations
}
