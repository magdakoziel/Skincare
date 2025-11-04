"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Sun, Moon } from "lucide-react"

type Product = {
  id: string
  name: string
  brand: string
  step: string
  notes?: string
}

type Routine = {
  type: "morning" | "evening"
  products: Product[]
}

export function RoutineManager() {
  const [morningRoutine, setMorningRoutine] = useState<Product[]>([])
  const [eveningRoutine, setEveningRoutine] = useState<Product[]>([])
  const [activeTab, setActiveTab] = useState<"morning" | "evening">("morning")

  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    step: "cleanser",
    notes: ""
  })

  const steps = [
    { value: "cleanser", label: "Cleanser" },
    { value: "toner", label: "Toner" },
    { value: "serum", label: "Serum" },
    { value: "moisturizer", label: "Moisturizer" },
    { value: "sunscreen", label: "Sunscreen" },
    { value: "treatment", label: "Treatment" },
    { value: "mask", label: "Mask" },
    { value: "eye-cream", label: "Eye Cream" },
    { value: "other", label: "Other" },
  ]

  const addProduct = () => {
    if (!newProduct.name.trim()) return

    const product: Product = {
      id: Date.now().toString(),
      ...newProduct
    }

    if (activeTab === "morning") {
      setMorningRoutine([...morningRoutine, product])
    } else {
      setEveningRoutine([...eveningRoutine, product])
    }

    // Reset form
    setNewProduct({
      name: "",
      brand: "",
      step: "cleanser",
      notes: ""
    })
  }

  const removeProduct = (id: string) => {
    if (activeTab === "morning") {
      setMorningRoutine(morningRoutine.filter(p => p.id !== id))
    } else {
      setEveningRoutine(eveningRoutine.filter(p => p.id !== id))
    }
  }

  const currentRoutine = activeTab === "morning" ? morningRoutine : eveningRoutine

  return (
    <div className="space-y-6">
        <div className="space-y-6">
          {/* Tab Selector */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === "morning" ? "default" : "outline"}
              onClick={() => setActiveTab("morning")}
              className="flex-1">
              <Sun className="mr-2 h-4 w-4" />
              Morning Routine
            </Button>
            <Button
              variant={activeTab === "evening" ? "default" : "outline"}
              onClick={() => setActiveTab("evening")}
              className="flex-1">
              <Moon className="mr-2 h-4 w-4" />
              Evening Routine
            </Button>
          </div>

          {/* Add Product Form */}
          <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-semibold">Add Product</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name *</Label>
                <Input
                  id="product-name"
                  placeholder="e.g., Gentle Foaming Cleanser"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  placeholder="e.g., CeraVe, The Ordinary"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="step">Step</Label>
              <Select
                value={newProduct.step}
                onValueChange={(value) => setNewProduct({ ...newProduct, step: value })}>
                <SelectTrigger id="step">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {steps.map((step) => (
                    <SelectItem key={step.value} value={step.value}>
                      {step.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="e.g., Use PM only, wait 20 mins before next step"
                value={newProduct.notes}
                onChange={(e) => setNewProduct({ ...newProduct, notes: e.target.value })}
                rows={2}
              />
            </div>

            <Button onClick={addProduct} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add to {activeTab === "morning" ? "Morning" : "Evening"} Routine
            </Button>
          </div>

          {/* Current Routine List */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              {activeTab === "morning" ? "Morning" : "Evening"} Routine ({currentRoutine.length} products)
            </h3>

            {currentRoutine.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No products added yet. Add your first product above!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentRoutine.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-foreground">{product.name}</h4>
                          {product.brand && (
                            <p className="text-sm text-muted-foreground">{product.brand}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProduct(product.id)}
                          className="h-8 w-8 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                          {steps.find(s => s.value === product.step)?.label}
                        </span>
                      </div>
                      {product.notes && (
                        <p className="text-sm text-muted-foreground">{product.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
    </div>
  )
}
