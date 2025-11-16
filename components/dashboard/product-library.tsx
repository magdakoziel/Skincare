"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Library, Plus, X, Archive, Star, StarOff, Search, Loader2, Scan } from "lucide-react"
import { BarcodeScanner } from "@/components/barcode-scanner"

type ProductSuggestion = {
  name: string
  brand: string
}

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
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const suggestionsRef = useRef<HTMLDivElement>(null)

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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Search for product suggestions
  const searchProducts = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }

    setIsSearching(true)
    try {
      // Using Open Beauty Facts API for skincare products
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&tagtype_0=categories&tag_contains_0=contains&tag_0=beauty&page_size=10`
      )
      const data = await response.json()

      if (data.products && data.products.length > 0) {
        const productSuggestions: ProductSuggestion[] = data.products
          .filter((p: any) => p.product_name && p.brands)
          .map((p: any) => ({
            name: p.product_name,
            brand: p.brands.split(',')[0].trim()
          }))
          .slice(0, 5)

        setSuggestions(productSuggestions)
      } else {
        setSuggestions([])
      }
    } catch (error) {
      console.error('Error searching products:', error)
      setSuggestions([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleProductNameChange = (value: string) => {
    setNewProduct({ ...newProduct, name: value })
    setShowSuggestions(true)

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      searchProducts(value)
    }, 300)
  }

  const selectSuggestion = (suggestion: ProductSuggestion) => {
    setNewProduct({ ...newProduct, name: suggestion.name, brand: suggestion.brand })
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleBarcodeScanned = (barcode: string, productData: any) => {
    if (productData) {
      // Product found in database
      setNewProduct({
        ...newProduct,
        name: productData.name,
        brand: productData.brand,
      })
      setIsAdding(true)
    } else {
      // Product not found, just open form
      setIsAdding(true)
    }
  }

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
              Your complete skincare product collection ({activeCount} currently used, {archivedCount} archived)
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

            {/* Scan or Manual Entry Options */}
            <div className="flex gap-2">
              <Button
                onClick={() => setShowScanner(true)}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                <Scan className="mr-2 h-4 w-4" />
                Scan Product
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-muted/30 px-2 text-muted-foreground">Or enter manually</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 relative" ref={suggestionsRef}>
                <Label htmlFor="lib-product-name">Product Name *</Label>
                <div className="relative">
                  <Input
                    id="lib-product-name"
                    placeholder="e.g., Gentle Foaming Cleanser"
                    value={newProduct.name}
                    onChange={(e) => handleProductNameChange(e.target.value)}
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  {!isSearching && newProduct.name.length >= 2 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectSuggestion(suggestion)}
                        className="w-full px-4 py-3 text-left hover:bg-accent transition-colors border-b border-border last:border-b-0"
                      >
                        <div className="font-medium text-sm">{suggestion.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{suggestion.brand}</div>
                      </button>
                    ))}
                  </div>
                )}
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
            Currently Used ({activeCount})
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
                  ? "No products currently in use"
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

      {/* Barcode Scanner */}
      <BarcodeScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleBarcodeScanned}
      />
    </Card>
  )
}
