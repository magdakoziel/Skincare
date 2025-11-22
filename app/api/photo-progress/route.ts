import { NextResponse } from "next/server"
import type { PhotoAnalysisResult } from "@/lib/analyze-photo"

const GEMINI_MODEL = "gemini-2.0-flash"
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const progressPrompt = `You are SkinCare Copilot analyzing two AI photo assessments.
Compare the EARLIER and LATER states and respond ONLY with JSON using this schema:
{
  "improvementScore": number (negative if worse, positive if better, range -100 to 100),
  "headline": "short summary of progress",
  "summary": "2 sentence overview referencing severity changes",
  "notableChanges": ["bullet list of key differences"],
  "nextSteps": ["recommended actions to keep improving"]
}
If data is inconclusive, set improvementScore to 0 and explain in the summary.`

const extractGeminiJson = (payload: any) => {
  const part = payload?.candidates?.[0]?.content?.parts?.find((p: any) => typeof p?.text === "string")
  const raw = part?.text
  if (!raw) return null
  const clean = raw.replace(/```json|```/gi, "").trim()
  try {
    return JSON.parse(clean)
  } catch {
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }
}

type ProgressBody = {
  earlier: PhotoAnalysisResult
  later: PhotoAnalysisResult
  metadata?: {
    earlierDate?: string
    laterDate?: string
    earlierCaption?: string
    laterCaption?: string
    severityChange?: number
  }
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    const body = (await req.json().catch(() => null)) as ProgressBody | null
    if (!body?.earlier || !body?.later) {
      return NextResponse.json({ error: "Missing analysis payload" }, { status: 400 })
    }

    const payload = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: progressPrompt },
              { text: JSON.stringify(body) },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      }),
    })

    const responseJson = await payload.json()
    if (!payload.ok) {
      throw new Error(responseJson?.error?.message || "Gemini progress analysis failed")
    }

    const parsed = extractGeminiJson(responseJson)
    if (!parsed) {
      throw new Error("Gemini returned non-JSON content")
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("[PhotoProgress] Failed to analyze progress:", error)
    return NextResponse.json({ error: "Photo progress AI unavailable" }, { status: 500 })
  }
}
