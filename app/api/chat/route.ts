import { NextResponse } from "next/server"

const GEMINI_MODEL = "gemini-2.0-flash"
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

const systemPrompt = `You are SkinCare Copilot, an empathetic virtual esthetician.
- Provide concise, actionable skincare advice grounded in evidence.
- If a question requires medical expertise, suggest consulting a dermatologist.
- Reference the user's skin profile when available.
- Format key steps or recommendations as clear bullet points or short paragraphs.
- Encourage SPF usage only when the user asks about daytime routines, sun exposure, or outdoor protection.
- Never fabricate facts; if unsure, say so and offer safe next steps.
- Detect the language of the user's latest message and reply entirely in that language (do not mix languages unless the user does).`

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : []
    if (messages.length === 0) {
      return NextResponse.json({ error: "No chat messages provided" }, { status: 400 })
    }

    const skinProfile = body.skinProfile ?? null
    const profileSummary = summarizeProfile(skinProfile)
    const formattedHistory = formatHistory(messages)
    const latestUserMessage = [...messages].reverse().find((msg) => msg.role === "user")?.content?.trim() ?? ""

    const composedPrompt = [
      systemPrompt,
      profileSummary ? `\nSkin profile:\n${profileSummary}` : "",
      formattedHistory ? `\nConversation so far:\n${formattedHistory}` : "",
      latestUserMessage ? `\nPlease respond to the user's latest message: "${latestUserMessage}".` : "",
      "\nKeep the tone friendly and practical.",
    ]
      .join("")
      .trim()

    const geminiResponse = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: composedPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.35,
          topP: 0.9,
          topK: 40,
        },
      }),
    })

    const payload = await geminiResponse.json()
    if (!geminiResponse.ok) {
      throw new Error(payload?.error?.message || "Gemini request failed")
    }

    const reply = extractGeminiText(payload)
    if (!reply) {
      throw new Error("Gemini returned an empty response")
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("[GeminiChat] Failed to generate chat response:", error)
    return NextResponse.json({ error: "Gemini chat request failed" }, { status: 500 })
  }
}

const summarizeProfile = (profile: any): string => {
  if (!profile) return ""
  const lines: string[] = []
  if (profile.skinType) lines.push(`Skin type: ${profile.skinType}`)
  if (profile.concerns?.length) lines.push(`Concerns: ${profile.concerns.join(", ")}`)
  if (profile.goals?.length) lines.push(`Goals: ${profile.goals.join(", ")}`)
  if (profile.sensitivity) lines.push(`Sensitivity: ${profile.sensitivity}`)
  if (profile.currentRoutine) lines.push(`Routine: ${profile.currentRoutine}`)
  return lines.join("\n")
}

const formatHistory = (messages: ChatMessage[]): string => {
  return messages
    .map((msg) => `${msg.role === "assistant" ? "Assistant" : "User"}: ${msg.content}`)
    .join("\n")
    .trim()
}

const extractGeminiText = (payload: any): string | null => {
  const part = payload?.candidates?.[0]?.content?.parts?.find((p: any) => typeof p?.text === "string")
  if (part?.text) return part.text.trim()
  return null
}
