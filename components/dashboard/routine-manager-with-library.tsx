"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Sun, Moon, ChevronDown } from "lucide-react"
import { SavedProduct } from "./product-library"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getRoutines, saveRoutines } from "@/lib/routine-storage"

type Product = {
  id: string
  name: string
  brand: string
  step: string
  notes?: string
}

type RoutineManagerProps = {
  library: SavedProduct[]
  onProductAdd?: (product: Omit<SavedProduct, 'id' | 'dateAdded'>) => void
}

export function RoutineManagerWithLibrary({ library, onProductAdd }: RoutineManagerProps) {
  const [morningRoutine, setMorningRoutine] = useState<Product[]>([])
  const [eveningRoutine, setEveningRoutine] = useState<Product[]>([])
  const [activeTab, setActiveTab] = useState<"morning" | "evening">("morning")
  const [open, setOpen] = useState(false)
  const [useLibrary, setUseLibrary] = useState(true)

  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    step: "cleanser",
    notes: ""
  })

  // Load routines from localStorage on mount
  useEffect(() => {
    const routines = getRoutines()
    setMorningRoutine(routines.morning)
    setEveningRoutine(routines.evening)
  }, [])

  // Save routines whenever they change
  useEffect(() => {
    saveRoutines({
      morning: morningRoutine,
      evening: eveningRoutine
    })
  }, [morningRoutine, eveningRoutine])

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

  // Only show active products from library
  const activeLibraryProducts = library.filter(p => p.inUse)

  const addProductFromLibrary = (libraryProduct: SavedProduct) => {
    const product: Product = {
      id: Date.now().toString(),
      name: libraryProduct.name,
      brand: libraryProduct.brand,
      step: libraryProduct.step,
      notes: libraryProduct.notes
    }

    if (activeTab === "morning") {
      setMorningRoutine([...morningRoutine, product])
    } else {
      setEveningRoutine([...eveningRoutine, product])
    }
    setOpen(false)
  }

  const addProduct = () => {
    if (!newProduct.name.trim()) return

    const product: Product = {
      id: Date.now().toString(),
      ...newProduct
    }

    // Add to routine
    if (activeTab === "morning") {
      setMorningRoutine([...morningRoutine, product])
    } else {
      setEveningRoutine([...eveningRoutine, product])
    }

    // Also add to library if callback provided
    if (onProductAdd) {
      onProductAdd({
        name: newProduct.name,
        brand: newProduct.brand,
        step: newProduct.step,
        notes: newProduct.notes,
        inUse: true,
        favorite: false
      })
    }

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
      {/* Tab Selector */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "morning" ? "default" : "outline"}
          onClick={() => setActiveTab("morning")}
          className="flex-1">
          <Sun className="mr-2 h-4 w-4" />
          Morning ({morningRoutine.length})
        </Button>
        <Button
          variant={activeTab === "evening" ? "default" : "outline"}
          onClick={() => setActiveTab("evening")}
          className="flex-1">
          <Moon className="mr-2 h-4 w-4" />
          Evening ({eveningRoutine.length})
        </Button>
      </div>

      {/* Add Product Section */}
      <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
        <h3 className="text-sm font-semibold">Add Product to Routine</h3>

        {/* Toggle between library and manual */}
        <div className="flex gap-2">
          <Button
            variant={useLibrary ? "default" : "outline"}
            size="sm"
            onClick={() => setUseLibrary(true)}
            className="flex-1">
            From Library
          </Button>
          <Button
            variant={!useLibrary ? "default" : "outline"}
            size="sm"
            onClick={() => setUseLibrary(false)}
            className="flex-1">
            Add New
          </Button>
        </div>

        {useLibrary ? (
          <div className="space-y-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between">
                  Select product from library...
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search products..." />
                  <CommandEmpty>No products found in library.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {activeLibraryProducts.map((product) => (
                      <CommandItem
                        key={product.id}
                        onSelect={() => addProductFromLibrary(product)}
                        className="cursor-pointer">
                        <div className="flex flex-col">
                          <span className="font-medium">{product.name}</span>
                          {product.brand && (
                            <span className="text-xs text-muted-foreground">{product.brand}</span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {activeLibraryProducts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                No products in library. Add products to library first or use "Add New".
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name *</Label>
                <Input
                  id="product-name"
                  placeholder="e.g., Gentle Cleanser"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  placeholder="e.g., CeraVe"
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
                placeholder="e.g., Use PM only"
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
        )}
      </div>

      {/* Current Routine List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">
          {activeTab === "morning" ? "Morning" : "Evening"} Routine ({currentRoutine.length} products)
        </h3>

        {currentRoutine.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No products yet. Add your first product!
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
  )
}
