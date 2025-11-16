"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, X, AlertCircle, UtensilsCrossed, Flame, Droplets, ShoppingBag, Activity } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

type JournalEntry = {
  id: string
  date: string
  breakoutSeverity?: "none" | "mild" | "moderate" | "severe"
  events: {
    newProduct?: string
    period?: boolean
    stress?: boolean
    dietChange?: string
    sleep?: "poor" | "fair" | "good"
    exercise?: boolean
  }
  notes?: string
}

export function SkinJournalCalendar() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    breakoutSeverity: "none" as "none" | "mild" | "moderate" | "severe",
    events: {
      newProduct: "",
      period: false,
      stress: false,
      dietChange: "",
      sleep: "good" as "poor" | "fair" | "good",
      exercise: false,
    },
    notes: ""
  })

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    // Convert Sunday (0) to 6, and shift other days back by 1 (Monday becomes 0)
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  // Get current week days (for collapsed view)
  const getCurrentWeekDays = () => {
    const today = new Date()
    const currentDay = today.getDay()
    // Convert Sunday (0) to 6, and shift other days back by 1 (Monday becomes 0)
    const currentDayOfWeek = currentDay === 0 ? 6 : currentDay - 1

    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - currentDayOfWeek + i)
      weekDays.push(date)
    }
    return weekDays
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getEntryForDate = (dateStr: string) => {
    return entries.find(e => e.date === dateStr)
  }

  const openEntryForm = (day: number, customDate?: Date) => {
    let dateStr: string

    if (customDate) {
      // For week view - use the full date object
      dateStr = customDate.toISOString().split('T')[0]
    } else {
      // For month view - construct from day number
      dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    }

    setSelectedDate(dateStr)

    const existingEntry = getEntryForDate(dateStr)
    if (existingEntry) {
      setNewEntry({
        date: dateStr,
        breakoutSeverity: existingEntry.breakoutSeverity || "none",
        events: { ...existingEntry.events },
        notes: existingEntry.notes || ""
      })
    } else {
      setNewEntry({
        date: dateStr,
        breakoutSeverity: "none",
        events: {
          newProduct: "",
          period: false,
          stress: false,
          dietChange: "",
          sleep: "good",
          exercise: false,
        },
        notes: ""
      })
    }
    setIsAddingEntry(true)
  }

  const saveEntry = () => {
    const existingIndex = entries.findIndex(e => e.date === newEntry.date)

    const entry: JournalEntry = {
      id: existingIndex >= 0 ? entries[existingIndex].id : Date.now().toString(),
      date: newEntry.date,
      breakoutSeverity: newEntry.breakoutSeverity,
      events: { ...newEntry.events },
      notes: newEntry.notes
    }

    if (existingIndex >= 0) {
      const updated = [...entries]
      updated[existingIndex] = entry
      setEntries(updated)
    } else {
      setEntries([...entries, entry])
    }

    setIsAddingEntry(false)
    setSelectedDate(null)
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "severe": return "bg-destructive"
      case "moderate": return "bg-orange-500"
      case "mild": return "bg-yellow-500"
      case "none": return "bg-green-500"
      default: return "bg-muted"
    }
  }

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const weekDays = getCurrentWeekDays()
  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <Card className="bg-background/60 backdrop-blur-md border-border/40 shadow-xl overflow-hidden">
      <div className="relative p-4 md:p-6"
        style={{
          background: `
            linear-gradient(135deg,
              hsl(var(--primary) / 0.08) 0%,
              hsl(280 60% 70% / 0.12) 50%,
              hsl(var(--primary) / 0.08) 100%
            )
          `
        }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Skin Journal</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {monthNames[new Date().getMonth()]} {new Date().getFullYear()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>

        {!isExpanded ? (
          /* Week View (Collapsed) - Compact circles */
          <div className="flex justify-center gap-2 md:gap-3">
            {weekDays.map((date, idx) => {
              const dateStr = date.toISOString().split('T')[0]
              const entry = getEntryForDate(dateStr)
              const isToday = dateStr === todayStr
              const day = date.getDate()

              return (
                <button
                  key={idx}
                  onClick={() => openEntryForm(day, date)}
                  className={`group relative flex flex-col items-center gap-1 transition-all cursor-pointer hover:scale-110`}
                >
                  {/* Day name */}
                  <span className="text-[10px] font-medium text-muted-foreground uppercase">
                    {dayNames[idx].slice(0, 1)}
                  </span>

                  {/* Circle with day number */}
                  <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
                    isToday
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-primary ring-offset-2 ring-offset-background'
                      : entry
                        ? 'bg-background border-2 border-primary/40 text-foreground'
                        : 'bg-background/50 border border-border text-muted-foreground group-hover:border-primary/50'
                  }`}>
                    <span className="text-sm md:text-base font-bold">
                      {day}
                    </span>

                    {/* Severity indicator dot */}
                    {entry && entry.breakoutSeverity && entry.breakoutSeverity !== 'none' && (
                      <div className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getSeverityColor(entry.breakoutSeverity)}`} />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          /* Full Month View (Expanded) */
          <div className="space-y-4">
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-semibold">
                {monthNames[month]} {year}
              </h3>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="rounded-lg border border-border overflow-hidden">
              {/* Day Names Header */}
              <div className="grid grid-cols-7 bg-muted/50">
                {dayNames.map((day) => (
                  <div key={day} className="p-2 text-center text-xs font-semibold text-muted-foreground border-b border-border">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square border-b border-r border-border bg-muted/20" />
                ))}

                {/* Actual days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const entry = getEntryForDate(dateStr)
                  const isToday = dateStr === new Date().toISOString().split('T')[0]

                  return (
                    <button
                      key={day}
                      onClick={() => openEntryForm(day)}
                      className={`group relative aspect-square border-b border-r border-border p-2 hover:bg-muted/50 transition-colors cursor-pointer ${
                        isToday ? 'bg-primary/5' : ''
                      }`}>
                      <div className="flex flex-col h-full">
                        {/* Day number */}
                        <span className={`text-sm font-medium ${isToday ? 'text-primary font-semibold' : 'text-foreground'}`}>
                          {day}
                        </span>

                        {/* Entry indicators or hover plus */}
                        {entry ? (
                          <div className="flex-1 flex flex-col gap-1 mt-2">
                            {/* Severity bar */}
                            <div className={`h-2 w-full rounded-sm ${getSeverityColor(entry.breakoutSeverity)}`} />

                            {/* Event dots */}
                            <div className="flex flex-wrap gap-1">
                              {entry.events.period && (
                                <div className="h-1.5 w-1.5 rounded-full bg-pink-500" title="Period" />
                              )}
                              {entry.events.stress && (
                                <div className="h-1.5 w-1.5 rounded-full bg-red-500" title="Stress" />
                              )}
                              {entry.events.newProduct && (
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" title="New Product" />
                              )}
                              {entry.events.dietChange && (
                                <div className="h-1.5 w-1.5 rounded-full bg-orange-500" title="Diet Change" />
                              )}
                              {entry.events.exercise && (
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500" title="Exercise" />
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Legend - Only in expanded view */}
            <div className="mt-4 space-y-2 rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-semibold">Legend:</p>
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-6 rounded bg-green-500" />
                  <span className="text-muted-foreground">Clear</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-6 rounded bg-yellow-500" />
                  <span className="text-muted-foreground">Mild</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-6 rounded bg-orange-500" />
                  <span className="text-muted-foreground">Moderate</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-6 rounded bg-destructive" />
                  <span className="text-muted-foreground">Severe</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-xs pt-1">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-pink-500" />
                  <span className="text-muted-foreground">Period</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-muted-foreground">Stress</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-muted-foreground">New Product</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  <span className="text-muted-foreground">Diet</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">Exercise</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {entries.length > 0 && !isExpanded && (
          <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <div className="flex gap-2 items-start">
              <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">Pattern Analysis</p>
                <p className="text-xs text-muted-foreground">
                  {entries.length} entries • Keep tracking!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Entry Form Modal */}
        {isAddingEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card rounded-lg border border-border shadow-lg">
              <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Journal Entry - {new Date(selectedDate!).toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setIsAddingEntry(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label>Breakout Severity</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["none", "mild", "moderate", "severe"] as const).map((severity) => (
                      <Button
                        key={severity}
                        variant={newEntry.breakoutSeverity === severity ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewEntry({ ...newEntry, breakoutSeverity: severity })}>
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Events & Triggers</Label>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="modal-period"
                      checked={newEntry.events.period}
                      onCheckedChange={(checked) =>
                        setNewEntry({ ...newEntry, events: { ...newEntry.events, period: checked as boolean }})
                      }
                    />
                    <label htmlFor="modal-period" className="text-sm font-medium cursor-pointer">
                      Period/Menstruation
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="modal-stress"
                      checked={newEntry.events.stress}
                      onCheckedChange={(checked) =>
                        setNewEntry({ ...newEntry, events: { ...newEntry.events, stress: checked as boolean }})
                      }
                    />
                    <label htmlFor="modal-stress" className="text-sm font-medium cursor-pointer">
                      High Stress
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="modal-exercise"
                      checked={newEntry.events.exercise}
                      onCheckedChange={(checked) =>
                        setNewEntry({ ...newEntry, events: { ...newEntry.events, exercise: checked as boolean }})
                      }
                    />
                    <label htmlFor="modal-exercise" className="text-sm font-medium cursor-pointer">
                      Exercise/Workout
                    </label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modal-new-product">New Product</Label>
                    <Input
                      id="modal-new-product"
                      placeholder="e.g., Started retinol"
                      value={newEntry.events.newProduct}
                      onChange={(e) => setNewEntry({ ...newEntry, events: { ...newEntry.events, newProduct: e.target.value }})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modal-diet">Diet Change</Label>
                    <Input
                      id="modal-diet"
                      placeholder="e.g., Ate dairy"
                      value={newEntry.events.dietChange}
                      onChange={(e) => setNewEntry({ ...newEntry, events: { ...newEntry.events, dietChange: e.target.value }})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Sleep Quality</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["poor", "fair", "good"] as const).map((quality) => (
                        <Button
                          key={quality}
                          variant={newEntry.events.sleep === quality ? "default" : "outline"}
                          size="sm"
                          onClick={() => setNewEntry({ ...newEntry, events: { ...newEntry.events, sleep: quality }})}>
                          {quality.charAt(0).toUpperCase() + quality.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modal-notes">Notes</Label>
                  <Textarea
                    id="modal-notes"
                    placeholder="Any other observations..."
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveEntry} className="flex-1">
                    Save Entry
                  </Button>
                  {getEntryForDate(newEntry.date) && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        const entry = getEntryForDate(newEntry.date)
                        if (entry) deleteEntry(entry.id)
                        setIsAddingEntry(false)
                      }}>
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
    </Card>
  )
}
