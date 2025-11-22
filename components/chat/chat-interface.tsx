"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, Loader2, History, ArrowDown, Plus, Trash2 } from "lucide-react"
import { ChatMessage } from "./chat-message"
import { SuggestedQuestions } from "./suggested-questions"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"

type SupportedLanguage = "pl" | "en"

type Message = {
  _id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

type Conversation = {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

export function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [skinProfile, setSkinProfile] = useState<any>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const [historyOpen, setHistoryOpen] = useState(false)

  const currentConversation = conversations.find(c => c.id === currentConversationId)
  const messages = currentConversation?.messages || []

  useEffect(() => {
    const profile = localStorage.getItem("skinProfile")
    if (profile) {
      setSkinProfile(JSON.parse(profile))
    }

    // Load conversations from localStorage
    const savedConversations = localStorage.getItem("chatConversations")
    if (savedConversations) {
      const convos = JSON.parse(savedConversations)
      setConversations(convos)
      if (convos.length > 0) {
        setCurrentConversationId(convos[0].id)
      }
    } else {
      // Create initial conversation
      const initialConvo: Conversation = {
        id: `conv-${Date.now()}`,
        title: "New Chat",
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      setConversations([initialConvo])
      setCurrentConversationId(initialConvo.id)
      localStorage.setItem("chatConversations", JSON.stringify([initialConvo]))
    }
  }, [])

  const saveConversations = (convos: Conversation[]) => {
    setConversations(convos)
    localStorage.setItem("chatConversations", JSON.stringify(convos))
  }

  const createNewConversation = () => {
    const newConvo: Conversation = {
      id: `conv-${Date.now()}`,
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    const updatedConvos = [newConvo, ...conversations]
    saveConversations(updatedConvos)
    setCurrentConversationId(newConvo.id)
    setHistoryOpen(false)
  }

  const deleteConversation = (id: string) => {
    const updatedConvos = conversations.filter(c => c.id !== id)
    saveConversations(updatedConvos)

    if (currentConversationId === id) {
      if (updatedConvos.length > 0) {
        setCurrentConversationId(updatedConvos[0].id)
      } else {
        createNewConversation()
      }
    }
  }

  const switchConversation = (id: string) => {
    setCurrentConversationId(id)
    setHistoryOpen(false)
  }

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom(messages.length < 5 ? "auto" : "smooth")
    }
  }, [messages, autoScroll])

  const handleScroll = () => {
    const container = messagesContainerRef.current
    if (!container) return
    const threshold = 32
    const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - threshold
    setAutoScroll(isAtBottom)
  }

  const formatTimestamp = (value: number) => {
    try {
      return new Intl.DateTimeFormat("pl-PL", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    } catch {
      return new Date(value).toLocaleString()
    }
  }

  const detectLanguage = (text: string): SupportedLanguage => {
    if (/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(text)) {
      return "pl"
    }
    const normalized = text.toLowerCase()
    const polishKeywords = ["skora", "skore", "tradzik", "zmarszczki", "czy", "prosze", "dziekuje", "mam", "polecasz"]
    if (polishKeywords.some((keyword) => normalized.includes(keyword))) {
      return "pl"
    }
    return "en"
  }

  const fallbackResponses: Record<SupportedLanguage, {
    routine: (profile: any) => string
    products: (profile: any) => string
    acne: () => string
    ingredients: () => string
    default: (profile: any) => string
  }> = {
    en: {
      routine: (profile) =>
        `Based on your ${profile?.skinType || "skin"} type, I recommend a simple routine:\n\n**Morning:**\n1. Gentle cleanser\n2. Vitamin C serum\n3. Moisturizer\n4. SPF 30+ sunscreen\n\n**Evening:**\n1. Cleanser\n2. Treatment (like retinol or niacinamide)\n3. Moisturizer\n\nConsistency is key! Start slowly and patch test new products.`,
      products: (profile) =>
        `For ${profile?.concerns?.join(", ") || "your skin concerns"}, I'd recommend:\n\n1. **Cleanser**: CeraVe Foaming Facial Cleanser\n2. **Treatment**: The Ordinary Niacinamide 10% + Zinc 1%\n3. **Moisturizer**: Neutrogena Hydro Boost\n4. **Sunscreen**: La Roche-Posay Anthelios\n\nThese are gentle, effective, and suitable for most skin types. Check the Products page for more options!`,
      acne: () =>
        `For acne-prone skin, focus on:\n\n1. **Gentle cleansing** twice daily\n2. **Salicylic acid** or benzoyl peroxide treatments\n3. **Non-comedogenic moisturizer**\n4. **Daily SPF** (yes, even with acne!)\n\nAvoid over-washing, picking, and heavy pore-clogging products. If acne persists, consult a dermatologist.`,
      ingredients: () =>
        `Here are some key skincare ingredients:\n\n**Niacinamide**: Reduces inflammation, minimizes pores\n**Salicylic Acid**: Exfoliates, unclogs pores\n**Hyaluronic Acid**: Hydrates and plumps skin\n**Retinol**: Anti-aging, improves texture\n**Vitamin C**: Brightens, protects from damage\n\nIntroduce new ingredients slowly and patch test first!`,
      default: (profile) =>
        `That's a great question! ${
          profile ? `Given your ${profile.skinType} skin type and concerns about ${profile.concerns?.join(", ")}, ` : ""
        }I'd focus on a consistent routine with gentle, effective products. Want specific product recommendations or help building a routine?`,
    },
    pl: {
      routine: (profile) =>
        `Na podstawie Twojego typu skóry ${profile?.skinType || ""} polecam prostą rutynę:\n\n**Rano:**\n1. Delikatny żel do mycia\n2. Serum z witaminą C\n3. Nawilżacz\n4. Krem z filtrem SPF 30+\n\n**Wieczór:**\n1. Oczyszczanie\n2. Kuracja (np. retinol lub niacynamid)\n3. Krem nawilżający\n\nKluczem jest regularność i testowanie nowych produktów na małym fragmencie skóry.`,
      products: (profile) =>
        `Dla problemów takich jak ${profile?.concerns?.join(", ") || "Twoje obecne potrzeby"} polecam:\n\n1. **Żel do mycia**: CeraVe Foaming Facial Cleanser\n2. **Kuracja**: The Ordinary Niacinamide 10% + Zinc 1%\n3. **Nawilżacz**: Neutrogena Hydro Boost\n4. **SPF**: La Roche-Posay Anthelios\n\nTo lekkie, sprawdzone produkty odpowiednie dla większości typów skóry. Zajrzyj do sekcji produktów po więcej inspiracji.`,
      acne: () =>
        `Przy skórze trądzikowej skup się na:\n\n1. Delikatnym oczyszczaniu dwa razy dziennie\n2. Kuracjach z kwasem salicylowym lub nadtlenkiem benzoilu\n3. Lekkich, niekomedogennych kremach\n4. Codziennym SPF (to naprawdę ważne!)\n\nUnikaj nadmiernego mycia, wyciskania i ciężkich kosmetyków. Jeśli zmiany się utrzymują, rozważ wizytę u dermatologa.`,
      ingredients: () =>
        `Najważniejsze składniki pielęgnacyjne:\n\n**Niacynamid** – łagodzi stany zapalne i zwęża pory\n**Kwas salicylowy** – złuszcza i odblokowuje mieszki\n**Kwas hialuronowy** – nawilża i wypełnia skórę\n**Retinol** – wygładza i działa przeciwstarzeniowo\n**Witamina C** – rozświetla i chroni przed stresem oksydacyjnym\n\nWprowadzaj nowe składniki stopniowo i rób test płatkowy.`,
      default: (profile) =>
        `Świetne pytanie! ${
          profile ? `Biorąc pod uwagę typ skóry ${profile.skinType} i obawy o ${profile.concerns?.join(", ")}, ` : ""
        }warto trzymać się łagodnej, regularnej rutyny. Mogę podpowiedzieć konkretne produkty albo pomóc ją ułożyć – daj znać, czego potrzebujesz.`,
    },
  }

  const generateAIResponse = (userMessage: string): string => {
    const language = detectLanguage(userMessage)
    const copy = fallbackResponses[language]
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("routine") || lowerMessage.includes("steps") || lowerMessage.includes("rutyna")) {
      return copy.routine(skinProfile)
    }

    if (lowerMessage.includes("product") || lowerMessage.includes("recommend") || lowerMessage.includes("produkt")) {
      return copy.products(skinProfile)
    }

    if (lowerMessage.includes("acne") || lowerMessage.includes("breakout") || lowerMessage.includes("tradzik")) {
      return copy.acne()
    }

    if (
      lowerMessage.includes("ingredient") ||
      lowerMessage.includes("what is") ||
      lowerMessage.includes("skladnik")
    ) {
      return copy.ingredients()
    }

    return copy.default(skinProfile)
  }

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input
    if (!textToSend.trim() || isLoading || !currentConversationId) return

    setIsLoading(true)
    setChatError(null)
    setInput("")

    const userMessage: Message = {
      _id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: Date.now(),
    }

    const newMessages = [...messages, userMessage]

    // Update conversation with new message
    const updatedConvos = conversations.map(c => {
      if (c.id === currentConversationId) {
        // Update title if it's the first message
        const title = c.messages.length === 0
          ? textToSend.slice(0, 30) + (textToSend.length > 30 ? '...' : '')
          : c.title
        return {
          ...c,
          title,
          messages: newMessages,
          updatedAt: Date.now()
        }
      }
      return c
    })
    saveConversations(updatedConvos)
    setAutoScroll(true)

    let aiContent = ""
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
          skinProfile,
        }),
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error || `API returned ${response.status}`)
      }

      aiContent = (payload?.reply as string)?.trim()
      if (!aiContent) {
        throw new Error("No reply from Gemini")
      }
    } catch (error) {
      console.error("Error generating AI response:", error)
      setChatError("Gemini jest chwilowo niedostepny. Pokazuje odpowiedz zapasowa.")
      aiContent = generateAIResponse(textToSend)
    }

    const aiResponse: Message = {
      _id: `ai-${Date.now()}`,
      role: "assistant",
      content: aiContent,
      timestamp: Date.now(),
    }

    const updatedMessages = [...newMessages, aiResponse]

    // Update conversation with AI response
    const finalConvos = conversations.map(c => {
      if (c.id === currentConversationId) {
        return {
          ...c,
          messages: updatedMessages,
          updatedAt: Date.now()
        }
      }
      return c
    })
    saveConversations(finalConvos)
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="container mx-auto flex max-w-4xl flex-col px-4 py-4 md:py-8 pb-20 md:pb-8">
      <Card className="flex flex-col border-border/40 bg-background/60 backdrop-blur-md shadow-xl h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)]">
        <CardHeader className="flex-shrink-0 border-b border-border/40 py-3 md:py-6 bg-gradient-to-r from-purple-50/60 via-pink-50/50 to-rose-50/60 dark:from-purple-950/30 dark:via-pink-950/20 dark:to-rose-950/25 backdrop-blur-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200 dark:from-purple-800 dark:via-pink-800 dark:to-rose-800 shadow-lg shadow-primary/20">
                <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-purple-700 dark:text-purple-200" />
              </div>
              <div>
                <CardTitle className="text-base md:text-lg">Skincare Assistant</CardTitle>
                <p className="text-xs md:text-sm text-muted-foreground">Ask me anything about skincare</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={createNewConversation}
                size="sm"
                className="gap-1 text-xs md:text-sm bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 hover:shadow-lg hover:shadow-primary/30"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Nowy</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHistoryOpen(true)}
                className="gap-1 text-xs md:text-sm border-border/60 hover:bg-primary/10"
              >
                <History className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Historia</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col overflow-hidden p-0 min-h-0">
          <div className="flex-1 overflow-y-auto min-h-0">
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="h-full flex flex-col gap-3 md:gap-4 p-3 md:p-4"
            >
              {chatError && (
                <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
                  {chatError}
                </div>
              )}
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center px-4">
                  <MessageCircle className="mb-3 md:mb-4 h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-base md:text-lg font-semibold text-foreground">Start a conversation</h3>
                  <p className="mb-4 md:mb-6 text-xs md:text-sm text-muted-foreground">
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
                  {!autoScroll && (
                    <div className="sticky bottom-2 self-center">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setAutoScroll(true)
                          scrollToBottom()
                        }}
                        className="flex items-center gap-1"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                        Przewin na dol
                      </Button>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 border-t border-border/40 p-3 md:p-4 bg-gradient-to-r from-purple-50/80 via-pink-50/60 to-rose-50/70 dark:from-purple-950/30 dark:via-pink-950/20 dark:to-rose-950/25 backdrop-blur-sm">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about skincare..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1 bg-background/80 backdrop-blur-sm border-border/60"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Drawer direction="right" open={historyOpen} onOpenChange={setHistoryOpen}>
        <DrawerContent className="sm:max-w-lg bg-background/95 backdrop-blur-md border-border/40">
          <DrawerHeader className="bg-gradient-to-r from-purple-50/60 via-pink-50/50 to-rose-50/60 dark:from-purple-950/30 dark:via-pink-950/20 dark:to-rose-950/25 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle>Konwersacje</DrawerTitle>
                <DrawerDescription>Zarządzaj swoimi czatami</DrawerDescription>
              </div>
              <Button
                onClick={createNewConversation}
                size="sm"
                className="gap-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 hover:shadow-lg hover:shadow-primary/30"
              >
                <Plus className="h-4 w-4" />
                Nowy
              </Button>
            </div>
          </DrawerHeader>
          <ScrollArea className="h-[65vh] w-full px-4 pb-4">
            {conversations.length === 0 ? (
              <p className="text-sm text-muted-foreground pt-4">
                Brak konwersacji. Kliknij "Nowy" aby rozpocząć.
              </p>
            ) : (
              <div className="space-y-3 pt-4">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`rounded-lg border p-3 cursor-pointer transition-all ${
                      currentConversationId === conversation.id
                        ? 'border-primary bg-gradient-to-br from-purple-50/60 via-pink-50/50 to-rose-50/60 dark:from-purple-950/40 dark:via-pink-950/30 dark:to-rose-950/40 shadow-md'
                        : 'border-border/60 bg-background/40 hover:border-primary/50 hover:bg-gradient-to-br hover:from-purple-50/20 hover:via-pink-50/15 hover:to-rose-50/20'
                    }`}
                    onClick={() => switchConversation(conversation.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {conversation.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {conversation.messages.length} {conversation.messages.length === 1 ? 'wiadomość' : 'wiadomości'}
                          </p>
                          <span className="text-xs text-muted-foreground">•</span>
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(conversation.updatedAt)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteConversation(conversation.id)
                        }}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          <div className="border-t border-border/40 px-4 py-3 flex justify-end bg-gradient-to-r from-purple-50/40 via-pink-50/30 to-rose-50/40 dark:from-purple-950/20 dark:via-pink-950/15 dark:to-rose-950/20">
            <DrawerClose asChild>
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                Zamknij
              </Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
