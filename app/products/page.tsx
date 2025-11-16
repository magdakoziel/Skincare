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
  )
}
