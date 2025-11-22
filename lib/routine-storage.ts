export type RoutineProduct = {
  id: string
  name: string
  brand: string
  step: string
  notes?: string
}

export type Routines = {
  morning: RoutineProduct[]
  evening: RoutineProduct[]
  weekly: RoutineProduct[]
}

const STORAGE_KEY = "skincare-routines"

export function getRoutines(): Routines {
  if (typeof window === "undefined") {
    return { morning: [], evening: [], weekly: [] }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return { morning: [], evening: [], weekly: [] }
    }
    const parsed = JSON.parse(stored)
    // Ensure weekly exists for backwards compatibility
    return {
      morning: parsed.morning || [],
      evening: parsed.evening || [],
      weekly: parsed.weekly || []
    }
  } catch (error) {
    console.error("Error loading routines:", error)
    return { morning: [], evening: [], weekly: [] }
  }
}

export function saveRoutines(routines: Routines): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routines))
    window.dispatchEvent(new Event('routinesUpdated'))
  } catch (error) {
    console.error("Error saving routines:", error)
  }
}
