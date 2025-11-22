import { NextResponse } from "next/server"

const GEMINI_MODEL = "gemini-2.0-flash"
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const instructions = `You are SkinCare Copilot, an experienced dermatologist and esthetician.
Analyze the provided onboarding quiz data and respond with JSON ONLY using this schema:
{
  "primaryType": "string describing main skin pattern",
  "secondaryTypes": ["up to 3 supporting labels"],
  "summary": "2-3 sentence summary of the situation",
  "focusAreas": ["top priorities for the routine"],
  "recommendedIngredients": ["key actives or product suggestions"],
  "lifestyleGuidance": ["habits or lifestyle adjustments"],
  "cautionaryNotes": ["warnings or professional advice"],
  "priorityActions": ["up to 3 immediate actions user should take"]
}

Tone should be supportive and practical. Mention dermatologist/pro help only when severity warrants it.`

const extractGeminiJson = (payload: any) => {
  const textPart = payload?.candidates?.[0]?.content?.parts?.find((part: any) => typeof part?.text === "string")
  const rawText = textPart?.text
  if (!rawText) return null
  const clean = rawText.replace(/```json|```/gi, "").trim()
  try {
    return JSON.parse(clean)
  } catch {
    try {
      return JSON.parse(rawText)
    } catch {
      return null
    }
  }
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    const body = await req.json().catch(() => null)
    const quizData = body?.data
    if (!quizData) {
      return NextResponse.json({ error: "Missing onboarding data" }, { status: 400 })
    }

    const payload = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: instructions },
              { text: JSON.stringify({ quizData, timestamp: new Date().toISOString() }) },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.35,
          topP: 0.9,
          topK: 40,
          responseMimeType: "application/json",
        },
      }),
    })

    const responseJson = await payload.json()
    if (!payload.ok) {
      throw new Error(responseJson?.error?.message || "Gemini quiz insights failed")
    }

    const parsed = extractGeminiJson(responseJson)
    if (!parsed) {
      throw new Error("Gemini returned non-JSON content")
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("[QuizInsights] Failed to generate AI insights:", error)
    return NextResponse.json({ error: "Quiz insights unavailable" }, { status: 500 })
  }
}
