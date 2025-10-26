"use client"

import { Button } from "@/components/ui/button"

type SuggestedQuestionsProps = {
  onSelect: (question: string) => void
}

const questions = [
  "What's the best routine for acne-prone skin?",
  "How do I reduce redness and inflammation?",
  "What ingredients should I avoid?",
  "How often should I exfoliate?",
  "Can you recommend products for my skin type?",
  "How do I fade acne scars?",
]

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {questions.map((question) => (
        <Button
          key={question}
          variant="outline"
          size="sm"
          onClick={() => onSelect(question)}
          className="bg-transparent"
        >
          {question}
        </Button>
      ))}
    </div>
  )
}
