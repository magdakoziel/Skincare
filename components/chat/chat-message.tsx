"use client"

import { format } from "date-fns"
import { MessageCircle, User } from "lucide-react"

type Message = {
  _id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

type ChatMessageProps = {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full ${isUser ? "bg-secondary" : "bg-primary/10"}`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-secondary-foreground" />
        ) : (
          <MessageCircle className="h-4 w-4 text-primary" />
        )}
      </div>
      <div className={`flex-1 space-y-1 ${isUser ? "items-end" : ""}`}>
        <div
          className={`rounded-lg p-3 ${
            isUser ? "bg-primary text-primary-foreground ml-auto max-w-[80%]" : "bg-muted text-foreground max-w-[90%]"
          }`}
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        </div>
        <p className={`text-xs text-muted-foreground ${isUser ? "text-right" : ""}`}>
          {format(new Date(message.timestamp), "h:mm a")}
        </p>
      </div>
    </div>
  )
}
