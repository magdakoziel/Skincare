"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, Loader2 } from "lucide-react"
import { ChatMessage } from "./chat-message"
import { SuggestedQuestions } from "./suggested-questions"

type Message = {
  _id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [skinProfile, setSkinProfile] = useState<any>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const profile = localStorage.getItem("skinProfile")
    if (profile) {
      setSkinProfile(JSON.parse(profile))
    }

    const savedMessages = localStorage.getItem("chatMessages")
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("routine") || lowerMessage.includes("steps")) {
      return `Based on your ${skinProfile?.skinType || "skin"} type, I recommend a simple routine:\n\n**Morning:**\n1. Gentle cleanser\n2. Vitamin C serum\n3. Moisturizer\n4. SPF 30+ sunscreen\n\n**Evening:**\n1. Cleanser\n2. Treatment (like retinol or niacinamide)\n3. Moisturizer\n\nConsistency is key! Start slowly and patch test new products.`
    }

    if (lowerMessage.includes("product") || lowerMessage.includes("recommend")) {
      return `For ${skinProfile?.concerns?.join(", ") || "your skin concerns"}, I'd recommend:\n\n1. **Cleanser**: CeraVe Foaming Facial Cleanser\n2. **Treatment**: The Ordinary Niacinamide 10% + Zinc 1%\n3. **Moisturizer**: Neutrogena Hydro Boost\n4. **Sunscreen**: La Roche-Posay Anthelios\n\nThese are gentle, effective, and suitable for most skin types. Check the Products page for more options!`
    }

    if (lowerMessage.includes("acne") || lowerMessage.includes("breakout")) {
      return `For acne-prone skin, focus on:\n\n1. **Gentle cleansing** twice daily\n2. **Salicylic acid** or benzoyl peroxide for treatment\n3. **Non-comedogenic moisturizer**\n4. **Daily SPF** (yes, even with acne!)\n\nAvoid:\n- Over-washing (strips natural oils)\n- Picking or popping\n- Heavy, pore-clogging products\n\nIf acne persists, consider seeing a dermatologist.`
    }

    if (lowerMessage.includes("ingredient") || lowerMessage.includes("what is")) {
      return `Great question! Here are some key skincare ingredients:\n\n**Niacinamide**: Reduces inflammation, minimizes pores\n**Salicylic Acid**: Exfoliates, unclogs pores\n**Hyaluronic Acid**: Hydrates and plumps skin\n**Retinol**: Anti-aging, improves texture\n**Vitamin C**: Brightens, protects from damage\n\nAlways introduce new ingredients slowly and patch test first!`
    }

    return `That's a great question! ${skinProfile ? `Given your ${skinProfile.skinType} skin type and concerns about ${skinProfile.concerns?.join(", ")}, ` : ""}I'd recommend focusing on a consistent routine with gentle, effective products. Would you like specific product recommendations or help building a routine? Feel free to ask about specific ingredients or concerns!`
  }

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input
    if (!textToSend.trim() || isLoading) return

    setIsLoading(true)
    setInput("")

    const userMessage: Message = {
      _id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: Date.now(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        _id: `ai-${Date.now()}`,
        role: "assistant",
        content: generateAIResponse(textToSend),
        timestamp: Date.now(),
      }

      const updatedMessages = [...newMessages, aiResponse]
      setMessages(updatedMessages)
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages))
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] max-w-4xl flex-col px-4 py-8">
      <Card className="flex flex-1 flex-col border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Skincare Assistant</CardTitle>
              <p className="text-sm text-muted-foreground">Ask me anything about skincare</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-0">
          {/* Messages Area */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <MessageCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">Start a conversation</h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  Ask me about skincare routines, products, or any skin concerns
                </p>
                <SuggestedQuestions onSelect={handleSend} />
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message._id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 rounded-lg bg-muted p-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about skincare..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
