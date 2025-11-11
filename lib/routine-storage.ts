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
}

const STORAGE_KEY = "skincare-routines"

export function getRoutines(): Routines {
  if (typeof window === "undefined") {
    return { morning: [], evening: [] }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return { morning: [], evening: [] }
    }
    return JSON.parse(stored)
  } catch (error) {
    console.error("Error loading routines:", error)
    return { morning: [], evening: [] }
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
