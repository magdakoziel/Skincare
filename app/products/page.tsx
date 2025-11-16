"use client"

import { useState, useEffect } from "react"
import { ProductLibrary, SavedProduct } from "@/components/dashboard/product-library"
import { getProducts, saveProducts } from "@/lib/product-storage"

export default function ProductsPage() {
  const [productLibrary, setProductLibrary] = useState<SavedProduct[]>([])

  useEffect(() => {
    setProductLibrary(getProducts())

    // Listen for changes from other tabs/components
    const handleStorageChange = () => {
      setProductLibrary(getProducts())
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('productsUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('productsUpdated', handleStorageChange)
    }
  }, [])

  const addProductToLibrary = (product: Omit<SavedProduct, 'id' | 'dateAdded'>) => {
    const newProduct: SavedProduct = {
      ...product,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString()
    }
    const updated = [...productLibrary, newProduct]
    setProductLibrary(updated)
    saveProducts(updated)
  }

  const removeProductFromLibrary = (id: string) => {
    const updated = productLibrary.filter(p => p.id !== id)
    setProductLibrary(updated)
    saveProducts(updated)
  }

  const toggleFavorite = (id: string) => {
    const updated = productLibrary.map(p =>
      p.id === id ? { ...p, favorite: !p.favorite } : p
    )
    setProductLibrary(updated)
    saveProducts(updated)
  }

  const toggleInUse = (id: string) => {
    const updated = productLibrary.map(p =>
      p.id === id ? { ...p, inUse: !p.inUse } : p
    )
    setProductLibrary(updated)
    saveProducts(updated)
  }

  return (
    <div className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(1200px 800px at 10% -10%, hsl(320 60% 80% / 0.3), transparent 60%),
          radial-gradient(1000px 700px at 110% 10%, hsl(280 70% 75% / 0.25), transparent 55%),
          radial-gradient(900px 600px at 50% 120%, hsl(340 65% 85% / 0.2), transparent 60%),
          hsl(var(--background))
        `
      }}>
      <div className="container mx-auto px-4 py-4 md:py-8 pb-20 md:pb-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Product Library</h1>
          <p className="mt-1 md:mt-2 text-sm md:text-base text-muted-foreground">
            Track all your skincare products in one place
          </p>
        </div>

        <ProductLibrary
          products={productLibrary}
          onAddProduct={addProductToLibrary}
          onRemoveProduct={removeProductFromLibrary}
          onToggleFavorite={toggleFavorite}
          onToggleInUse={toggleInUse}
        />
      </div>
    </div>
  )
}
