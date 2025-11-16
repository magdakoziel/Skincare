"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Camera, Droplets, Sun } from "lucide-react"

export default function LandingPage() {
  const [moodLabel, setMoodLabel] = useState("Calm")
  const moods = ["Calm", "Glow", "Hydrated", "Balanced"]

  // Rotate mood label
  useEffect(() => {
    const interval = setInterval(() => {
      setMoodLabel(prev => {
        const idx = moods.indexOf(prev)
        return moods[(idx + 1) % moods.length]
      })
    }, 3500)
    return () => clearInterval(interval)
  }, [moods])

  return (
    <div className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(1200px 800px at 10% -10%, hsl(var(--primary) / 0.15), transparent 60%),
          radial-gradient(1000px 700px at 110% 10%, hsl(var(--pink-400) / 0.12), transparent 55%),
          radial-gradient(900px 600px at 50% 120%, hsl(var(--yellow-200) / 0.1), transparent 60%),
          hsl(var(--background))
        `
      }}>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 backdrop-blur-md bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-200 via-pink-200 to-yellow-100 shadow-lg"></div>
            <span className="text-xl font-bold tracking-wide">SkinCare</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" className="rounded-xl">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 max-w-6xl">
        {/* Left: Pitch */}
        <Card className="relative overflow-hidden bg-background/60 backdrop-blur-md border-border/40 shadow-2xl shadow-primary/5">
          <CardContent className="p-8 md:p-10 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
              Your Personal Skin Journey Starts Here
            </h1>
            <p className="text-muted-foreground text-lg mb-6 text-pretty">
              Track your acne progress with AI-powered analysis, get personalized skincare routines, and discover products that work for your unique skin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/onboarding">
                <Button size="lg" className="rounded-2xl shadow-lg shadow-primary/30 h-14 px-6 bg-gradient-to-r from-primary to-blue-400 hover:shadow-xl hover:shadow-primary/40 transition-all">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="rounded-2xl h-14 px-6 border-border/60 hover:bg-accent/50">
                  Or skip to Dashboard →
                </Button>
              </Link>
            </div>
          </CardContent>

          {/* Decorative waves */}
          <div className="absolute inset-x-0 bottom-0 h-32 md:h-40 pointer-events-none opacity-60">
            <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="w-full h-full">
              <path
                d="M0,120 C200,60 260,60 420,110 C600,170 740,60 900,110 C1030,150 1100,150 1200,120 L1200,200 L0,200 Z"
                className="fill-primary/20"
              />
            </svg>
          </div>
        </Card>

        {/* Right: Widgets Preview */}
        <div className="space-y-4">
          <Card className="bg-background/60 backdrop-blur-md border-border/40 shadow-xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center shadow-inner">
                  <Droplets className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Skin Mood Ring</h3>
                  <p className="text-sm text-muted-foreground">How does your skin feel today?</p>
                </div>
                <div className="w-24 h-24 rounded-full p-2.5 bg-gradient-to-br from-blue-200 via-pink-200 to-yellow-100 shadow-lg">
                  <div className="w-full h-full rounded-full bg-background/80 backdrop-blur flex items-center justify-center font-bold text-sm">
                    {moodLabel}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/60 backdrop-blur-md border-border/40 shadow-xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 flex items-center justify-center shadow-inner">
                  <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Weather Window</h3>
                  <p className="text-sm text-muted-foreground">SPF & hydration tips</p>
                </div>
                <Button size="sm" variant="outline" className="rounded-xl">Check</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/60 backdrop-blur-md border-border/40 shadow-xl">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 flex items-center justify-center shadow-inner">
                  <Camera className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Today's Ingredients</h3>
                  <p className="text-sm text-muted-foreground">Gentle duo: PHA + panthenol</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 text-xs rounded-full bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
                  Panthenol 2-5%
                </span>
                <span className="px-3 py-1.5 text-xs rounded-full bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
                  PHA 3%
                </span>
                <span className="px-3 py-1.5 text-xs rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700">
                  Skip retinoids today
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden bg-background/60 backdrop-blur-md border-border/40 shadow-xl group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] pointer-events-none"></div>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center mb-4 shadow-inner">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">AI Analysis</h3>
              <p className="text-muted-foreground text-sm">
                Upload a photo and get instant AI-powered analysis of your acne type and severity.
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-background/60 backdrop-blur-md border-border/40 shadow-xl group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] pointer-events-none"></div>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 flex items-center justify-center mb-4 shadow-inner">
                <Camera className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Photo Tracking</h3>
              <p className="text-muted-foreground text-sm">
                Document your skincare journey with visual timelines and compare progress over time.
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-background/60 backdrop-blur-md border-border/40 shadow-xl group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] pointer-events-none"></div>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 flex items-center justify-center mb-4 shadow-inner">
                <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">AI Chatbot</h3>
              <p className="text-muted-foreground text-sm">
                Get instant answers to your skincare questions from our AI-powered assistant.
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-background/60 backdrop-blur-md border-border/40 shadow-xl group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] pointer-events-none"></div>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 flex items-center justify-center mb-4 shadow-inner">
                <Droplets className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Personalized Routines</h3>
              <p className="text-muted-foreground text-sm">
                Receive custom morning and evening skincare routines tailored to your skin type and concerns.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 backdrop-blur-sm bg-background/40 mt-20">
        <div className="container mx-auto px-4 py-8 flex flex-wrap justify-between items-center gap-4 text-sm text-muted-foreground max-w-6xl">
          <p>&copy; 2025 SkinCare — minimal skincare OS</p>
          <p>Demo UI. Sample data only.</p>
        </div>
      </footer>
    </div>
  )
}
