"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { RoutineManagerWithLibrary } from "./routine-manager-with-library"
import { SavedProduct } from "./product-library"

type CollapsibleRoutineProps = {
  library: SavedProduct[]
  onProductAdd?: (product: Omit<SavedProduct, 'id' | 'dateAdded'>) => void
}

export function CollapsibleRoutine({ library, onProductAdd }: CollapsibleRoutineProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="bg-background/60 backdrop-blur-md border-border/40 shadow-xl">
      <CardHeader className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Skincare Routine</CardTitle>
            <CardDescription>Track your morning and evening products</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent>
          <RoutineManagerWithLibrary library={library} onProductAdd={onProductAdd} />
        </CardContent>
      )}
    </Card>
  )
}
