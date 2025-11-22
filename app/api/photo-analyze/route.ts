import { NextResponse } from "next/server"
import { acneTypes, type AcneType } from "@/lib/acne-types"
import { type PhotoAnalysisResult, generateMockAnalysis, getRecommendationsForAcneTypes } from "@/lib/analyze-photo"

const GEMINI_MODEL = "gemini-2.5-pro"
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const acneCatalog = acneTypes
  .map((type) => `- ${type.id}: ${type.name} (${type.severity})`)
  .join("\n")

const analysisInstructions = `You are an experienced dermatologist AI. Analyze the uploaded skin photo and respond with JSON only.
Stay conservative. If no human skin/face is visible (e.g., it's a product shot, text, or scenery), set severity to "clear", return an empty detectedAcneTypes array, and recommend retaking the photo instead of inventing a diagnosis.
Use the following acne catalog as your primary reference. Prefer these IDs, but if you detect a valid acne or other dermatological concern (wrinkles, fine lines, rosacea, hyperpigmentation, eczema, texture changes, etc.) that is not listed, you may introduce a new acneTypeId. When you do, provide a short name and description for that type so we can add it later. Make sure the name clearly indicates the actual issue (e.g., "forehead wrinkles" instead of "acne").
${acneCatalog}

Schema (JSON keys must match exactly):
{
  "severity": "clear" | "mild" | "moderate" | "severe",
  "estimatedCount": number,
  "affectedAreas": string[],
  "detectedAcneTypes": [
    {
      "acneTypeId": "one of the ids listed above OR a new kebab-case id you invent",
      "name": "human readable name for the acne type (required when acneTypeId is custom)",
      "description": "short explanation of what you detected",
      "confidence": number between 0 and 1,
      "locations": string[]
    }
  ],
  "recommendations": string[]
}

Be concise. Limit detectedAcneTypes to the top 4 findings. You may include acne, post-inflammatory issues, wrinkles, or other visible dermatological concerns. Never guess when evidence is unclear.`

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    const body = await req.json().catch(() => null)
    const imageData: string | undefined = body?.imageData
    if (!imageData) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 })
    }

    const { base64, mimeType } = extractImagePayload(imageData)

    const geminiResponse = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: analysisInstructions },
              { inline_data: { mime_type: mimeType, data: base64 } },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.35,
          topP: 0.9,
          topK: 32,
          responseMimeType: "application/json",
        },
      }),
    })

    const payload = await geminiResponse.json()
    if (!geminiResponse.ok || payload.error) {
      throw new Error(payload.error?.message || "Gemini API request failed")
    }

    const parsed = extractJsonResult(payload)
    if (!parsed) {
      throw new Error("Gemini did not return JSON content")
    }

    const normalized: PhotoAnalysisResult = normalizeGeminiResult(parsed)
    return NextResponse.json(normalized)
  } catch (error) {
    console.error("[GeminiAnalysis] Falling back to mock analysis:", error)
    return NextResponse.json(generateMockAnalysis(), { status: 200 })
  }
}

type GeminiStructuredResult = {
  severity?: string
  estimatedCount?: number
  affectedAreas?: unknown
  detectedAcneTypes?: Array<{
    acneTypeId?: string
    typeId?: string
    type?: string
    name?: string
    name?: string
    description?: string
    severity?: string
    confidence?: number
    locations?: unknown
    howToIdentify?: unknown
    causes?: unknown
    treatmentFocus?: unknown
    recommendedIngredients?: unknown
    avoidIngredients?: unknown
  }>
  recommendations?: unknown
}

const normalizeGeminiResult = (raw: GeminiStructuredResult): PhotoAnalysisResult => {
  const detections = (raw.detectedAcneTypes ?? [])
    .map((detection) => {
      const acneType =
        resolveAcneType(detection.acneTypeId || detection.typeId || detection.type || detection.name) ??
        createCustomAcneType(detection)
      return {
        type: acneType,
        confidence: clampNumber(detection.confidence ?? 0.6, 0, 1),
        locations: normalizeStringArray(detection.locations).slice(0, 5),
      }
    })
    .filter((item) => item.type) as PhotoAnalysisResult["detectedAcneTypes"]

  const hasDetections = detections.length > 0
  const severity = hasDetections ? normalizeSeverity(raw.severity) : "clear"
  const typeIds = detections.map((d) => d.type.id)

  const baseRecommendations = normalizeStringArray(raw.recommendations)
  let recommendations = dedupeStrings([
    ...baseRecommendations,
    ...(hasDetections ? getRecommendationsForAcneTypes(typeIds) : []),
  ])

  if (!hasDetections && recommendations.length === 0) {
    recommendations = [
      "No visible acne detected. Please upload a clear, well-lit photo of your skin if you need further analysis.",
    ]
  }

  return {
    detectedAcneTypes: detections,
    severity,
    affectedAreas: hasDetections ? normalizeStringArray(raw.affectedAreas) : [],
    recommendations: recommendations.slice(0, 8),
    estimatedCount: normalizeCount(raw.estimatedCount, detections.length),
  }
}

const extractImagePayload = (imageData: string) => {
  if (!imageData.startsWith("data:")) {
    return { base64: imageData, mimeType: "image/jpeg" }
  }

  const [header, data] = imageData.split(",")
  const mimeMatch = header.match(/data:(.*?);base64/)
  return {
    base64: (data || "").replace(/\s/g, ""),
    mimeType: mimeMatch?.[1] ?? "image/jpeg",
  }
}

const extractJsonResult = (payload: any): GeminiStructuredResult | null => {
  const parts = payload?.candidates?.[0]?.content?.parts
  const text = parts?.find((part: any) => typeof part?.text === "string")?.text
  if (!text) return null

  const attemptParse = (raw: string) => {
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }

  const direct = attemptParse(text)
  if (direct) return direct

  const trimmed = text.replace(/```json|```/gi, "").trim()
  return attemptParse(trimmed)
}

const normalizeSeverity = (value?: string): PhotoAnalysisResult["severity"] => {
  const normalized = (value || "").toLowerCase()
  if (normalized === "none" || normalized === "low" || normalized === "minimal") {
    return "clear"
  }
  if (normalized === "medium") return "moderate"
  if (normalized === "high") return "severe"
  return (["clear", "mild", "moderate", "severe"].includes(normalized) ? normalized : "mild") as PhotoAnalysisResult["severity"]
}

const normalizeCount = (value: unknown, detectionCount: number): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.round(value))
  }
  return Math.max(0, detectionCount * 4)
}

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
}

const dedupeStrings = (values: string[]): string[] => {
  return Array.from(new Set(values.filter(Boolean)))
}

const clampNumber = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, value))
}

const resolveAcneType = (identifier?: string): AcneType | undefined => {
  if (!identifier) return undefined
  const normalized = identifier.toLowerCase().replace(/[^a-z0-9]/g, "")
  return acneTypes.find((type) => {
    const idCompare = type.id.toLowerCase().replace(/[^a-z0-9]/g, "")
    const nameCompare = type.name.toLowerCase().replace(/[^a-z0-9]/g, "")
    return normalized === idCompare || normalized === nameCompare
  })
}

const createCustomAcneType = (detection: GeminiStructuredResult["detectedAcneTypes"][number]): AcneType => {
  const baseName =
    detection?.name ||
    detection?.description ||
    detection?.acneTypeId ||
    detection?.typeId ||
    detection?.type ||
    "custom acne finding"
  const title = toTitleCase(baseName)
  const slug = slugify(baseName)
  const severity = normalizeDetectionSeverity(detection?.severity)
  const description =
    detection?.description || `AI detected features consistent with ${title}. Please review before acting.`

  const howToIdentify = ensureStrings(
    detection?.howToIdentify,
    [`Visible signs consistent with ${title}.`],
  )
  const causes = ensureStrings(
    detection?.causes,
    ["Underlying cause not listed in catalog. Consider consulting a dermatologist for confirmation."],
  )
  const treatmentFocus = ensureStrings(
    detection?.treatmentFocus,
    ["Document findings and seek professional guidance before starting new treatments."],
  )
  const recommendedIngredients = ensureStrings(
    detection?.recommendedIngredients,
    ["Consult a dermatologist for ingredient guidance tailored to this condition."],
  )
  const avoidIngredients = ensureStrings(
    detection?.avoidIngredients,
    ["Avoid harsh exfoliation or picking until diagnosis is confirmed."],
  )

  return {
    id: slug,
    name: title,
    medicalName: title,
    severity,
    description,
    howToIdentify,
    causes,
    treatmentFocus,
    recommendedIngredients,
    avoidIngredients,
  }
}

const ensureStrings = (value: unknown, fallback: string[]): string[] => {
  const parsed = normalizeStringArray(value)
  return parsed.length > 0 ? parsed : fallback
}

const normalizeDetectionSeverity = (value?: string): AcneType["severity"] => {
  const normalized = (value || "").toLowerCase()
  if (normalized === "clear" || normalized === "minimal") return "mild"
  if (normalized === "mild" || normalized === "light") return "mild"
  if (normalized === "moderate" || normalized === "medium") return "moderate"
  if (normalized === "severe" || normalized === "high") return "severe"
  return "moderate"
}

const slugify = (value: string) => {
  return (
    value
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "custom-acne-type"
  )
}

const toTitleCase = (value: string) => {
  if (!value) return "Custom Acne Finding"
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
