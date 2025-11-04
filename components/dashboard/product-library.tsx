"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Library, Plus, X, Archive, Star, StarOff } from "lucide-react"

export type SavedProduct = {
  id: string
  name: string
  brand: string
  step: string
  notes?: string
  inUse: boolean
  favorite?: boolean
  dateAdded: string
}

type ProductLibraryProps = {
  products: SavedProduct[]
  onAddProduct: (product: Omit<SavedProduct, 'id' | 'dateAdded'>) => void
  onRemoveProduct: (id: string) => void
  onToggleFavorite: (id: string) => void
  onToggleInUse: (id: string) => void
}

export function ProductLibrary({
  products,
  onAddProduct,
  onRemoveProduct,
  onToggleFavorite,
  onToggleInUse
}: ProductLibraryProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [filterInUse, setFilterInUse] = useState<'all' | 'active' | 'archived'>('all')

  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    step: "cleanser",
    notes: "",
    inUse: true,
    favorite: false
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

    onAddProduct(newProduct)

    setNewProduct({
      name: "",
      brand: "",
      step: "cleanser",
      notes: "",
      inUse: true,
      favorite: false
    })
    setIsAdding(false)
  }

  const filteredProducts = products.filter(p => {
    if (filterInUse === 'active') return p.inUse
    if (filterInUse === 'archived') return !p.inUse
    return true
  })

  const activeCount = products.filter(p => p.inUse).length
  const archivedCount = products.filter(p => !p.inUse).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Library className="h-5 w-5" />
              Product Library
            </CardTitle>
            <CardDescription>
              Your complete skincare product collection ({activeCount} active, {archivedCount} archived)
            </CardDescription>
          </div>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Product Form */}
        {isAdding && (
          <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Add New Product</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lib-product-name">Product Name *</Label>
                <Input
                  id="lib-product-name"
                  placeholder="e.g., Gentle Foaming Cleanser"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lib-brand">Brand</Label>
                <Input
                  id="lib-brand"
                  placeholder="e.g., CeraVe, The Ordinary"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lib-step">Category</Label>
              <Select
                value={newProduct.step}
                onValueChange={(value) => setNewProduct({ ...newProduct, step: value })}>
                <SelectTrigger id="lib-step">
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
              <Label htmlFor="lib-notes">Notes</Label>
              <Textarea
                id="lib-notes"
                placeholder="e.g., Contains retinol, use PM only"
                value={newProduct.notes}
                onChange={(e) => setNewProduct({ ...newProduct, notes: e.target.value })}
                rows={2}
              />
            </div>

            <Button onClick={addProduct} className="w-full">
              Add to Library
            </Button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <Button
            variant={filterInUse === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterInUse('all')}>
            All ({products.length})
          </Button>
          <Button
            variant={filterInUse === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterInUse('active')}>
            Active ({activeCount})
          </Button>
          <Button
            variant={filterInUse === 'archived' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterInUse('archived')}>
            <Archive className="mr-1 h-3 w-3" />
            Archived ({archivedCount})
          </Button>
        </div>

        {/* Products List */}
        <div className="space-y-2">
          {filteredProducts.length === 0 && (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <Library className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {filterInUse === 'all'
                  ? "No products in library yet. Add your first product!"
                  : filterInUse === 'active'
                  ? "No active products"
                  : "No archived products"}
              </p>
            </div>
          )}

          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`flex items-start gap-3 rounded-lg border p-3 transition-all ${
                product.inUse
                  ? 'border-border bg-card'
                  : 'border-dashed border-muted-foreground/30 bg-muted/20 opacity-60'
              }`}>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{product.name}</h4>
                      {product.favorite && <Star className="h-4 w-4 fill-primary text-primary" />}
                    </div>
                    {product.brand && (
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {steps.find(s => s.value === product.step)?.label}
                  </Badge>
                  {!product.inUse && (
                    <Badge variant="secondary" className="text-xs">
                      <Archive className="mr-1 h-3 w-3" />
                      Archived
                    </Badge>
                  )}
                </div>

                {product.notes && (
                  <p className="text-xs text-muted-foreground">{product.notes}</p>
                )}

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleFavorite(product.id)}
                    className="h-7 text-xs">
                    {product.favorite ? (
                      <StarOff className="mr-1 h-3 w-3" />
                    ) : (
                      <Star className="mr-1 h-3 w-3" />
                    )}
                    {product.favorite ? 'Unfavorite' : 'Favorite'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleInUse(product.id)}
                    className="h-7 text-xs">
                    <Archive className="mr-1 h-3 w-3" />
                    {product.inUse ? 'Archive' : 'Restore'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveProduct(product.id)}
                    className="h-7 text-xs text-destructive hover:text-destructive">
                    <X className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
