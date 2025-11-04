"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, X, AlertCircle, UtensilsCrossed, Flame, Droplets, ShoppingBag, Activity } from "lucide-react"
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

export function SkinJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isAddingEntry, setIsAddingEntry] = useState(false)

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

  const addEntry = () => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: newEntry.date,
      breakoutSeverity: newEntry.breakoutSeverity,
      events: { ...newEntry.events },
      notes: newEntry.notes
    }

    setEntries([entry, ...entries])
    setIsAddingEntry(false)

    // Reset form
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
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

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "severe": return "bg-destructive text-destructive-foreground"
      case "moderate": return "bg-orange-500 text-white"
      case "mild": return "bg-yellow-500 text-white"
      default: return "bg-green-500 text-white"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Skin Journal</CardTitle>
            <CardDescription>Track daily events that might affect your skin</CardDescription>
          </div>
          {!isAddingEntry && (
            <Button onClick={() => setIsAddingEntry(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAddingEntry && (
          <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">New Journal Entry</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsAddingEntry(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entry-date">Date</Label>
              <Input
                id="entry-date"
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Breakout Severity</Label>
              <div className="flex gap-2">
                {(["none", "mild", "moderate", "severe"] as const).map((severity) => (
                  <Button
                    key={severity}
                    variant={newEntry.breakoutSeverity === severity ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNewEntry({ ...newEntry, breakoutSeverity: severity })}
                    className="flex-1">
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Events & Triggers</Label>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="period"
                  checked={newEntry.events.period}
                  onCheckedChange={(checked) =>
                    setNewEntry({ ...newEntry, events: { ...newEntry.events, period: checked as boolean }})
                  }
                />
                <label htmlFor="period" className="text-sm font-medium cursor-pointer">
                  Period/Menstruation
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stress"
                  checked={newEntry.events.stress}
                  onCheckedChange={(checked) =>
                    setNewEntry({ ...newEntry, events: { ...newEntry.events, stress: checked as boolean }})
                  }
                />
                <label htmlFor="stress" className="text-sm font-medium cursor-pointer">
                  High Stress
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exercise"
                  checked={newEntry.events.exercise}
                  onCheckedChange={(checked) =>
                    setNewEntry({ ...newEntry, events: { ...newEntry.events, exercise: checked as boolean }})
                  }
                />
                <label htmlFor="exercise" className="text-sm font-medium cursor-pointer">
                  Exercise/Workout
                </label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-product">New Product Introduced</Label>
                <Input
                  id="new-product"
                  placeholder="e.g., Started using retinol serum"
                  value={newEntry.events.newProduct}
                  onChange={(e) => setNewEntry({ ...newEntry, events: { ...newEntry.events, newProduct: e.target.value }})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diet-change">Diet Change</Label>
                <Input
                  id="diet-change"
                  placeholder="e.g., Ate dairy, had chocolate"
                  value={newEntry.events.dietChange}
                  onChange={(e) => setNewEntry({ ...newEntry, events: { ...newEntry.events, dietChange: e.target.value }})}
                />
              </div>

              <div className="space-y-2">
                <Label>Sleep Quality</Label>
                <div className="flex gap-2">
                  {(["poor", "fair", "good"] as const).map((quality) => (
                    <Button
                      key={quality}
                      variant={newEntry.events.sleep === quality ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewEntry({ ...newEntry, events: { ...newEntry.events, sleep: quality }})}
                      className="flex-1">
                      {quality.charAt(0).toUpperCase() + quality.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any other observations about your skin today..."
                value={newEntry.notes}
                onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                rows={3}
              />
            </div>

            <Button onClick={addEntry} className="w-full">
              Save Entry
            </Button>
          </div>
        )}

        {/* Entries List */}
        <div className="space-y-3">
          {entries.length === 0 && !isAddingEntry && (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <Calendar className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No journal entries yet. Start tracking to discover patterns!
              </p>
            </div>
          )}

          {entries.map((entry) => (
            <div key={entry.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                  <Badge className={getSeverityColor(entry.breakoutSeverity)}>
                    {entry.breakoutSeverity === "none" ? "Clear skin" : `${entry.breakoutSeverity} breakout`}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeEntry(entry.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Events */}
              <div className="flex flex-wrap gap-2">
                {entry.events.period && (
                  <Badge variant="outline" className="gap-1">
                    <Droplets className="h-3 w-3" />
                    Period
                  </Badge>
                )}
                {entry.events.stress && (
                  <Badge variant="outline" className="gap-1">
                    <Flame className="h-3 w-3" />
                    Stress
                  </Badge>
                )}
                {entry.events.exercise && (
                  <Badge variant="outline" className="gap-1">
                    <Activity className="h-3 w-3" />
                    Exercise
                  </Badge>
                )}
                {entry.events.newProduct && (
                  <Badge variant="outline" className="gap-1">
                    <ShoppingBag className="h-3 w-3" />
                    {entry.events.newProduct}
                  </Badge>
                )}
                {entry.events.dietChange && (
                  <Badge variant="outline" className="gap-1">
                    <UtensilsCrossed className="h-3 w-3" />
                    {entry.events.dietChange}
                  </Badge>
                )}
                {entry.events.sleep !== "good" && (
                  <Badge variant="outline">
                    Sleep: {entry.events.sleep}
                  </Badge>
                )}
              </div>

              {entry.notes && (
                <p className="text-sm text-muted-foreground">{entry.notes}</p>
              )}
            </div>
          ))}
        </div>

        {entries.length > 0 && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">AI Pattern Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Keep tracking for at least 2 weeks to let AI identify patterns and correlations between events and breakouts.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
