import { SavedProduct } from "@/components/dashboard/product-library"

const STORAGE_KEY = "skincare-products"

export function getProducts(): SavedProduct[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading products:", error)
    return []
  }
}

export function saveProducts(products: SavedProduct[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('productsUpdated'))
  } catch (error) {
    console.error("Error saving products:", error)
  }
}

export function addProduct(product: Omit<SavedProduct, 'id' | 'dateAdded'>): SavedProduct {
  const newProduct: SavedProduct = {
    ...product,
    id: Date.now().toString(),
    dateAdded: new Date().toISOString()
  }

  const products = getProducts()
  products.push(newProduct)
  saveProducts(products)

  return newProduct
}

export function updateProduct(id: string, updates: Partial<SavedProduct>): void {
  const products = getProducts()
  const updatedProducts = products.map(p =>
    p.id === id ? { ...p, ...updates } : p
  )
  saveProducts(updatedProducts)
}

export function removeProduct(id: string): void {
  const products = getProducts()
  const filtered = products.filter(p => p.id !== id)
  saveProducts(filtered)
}
