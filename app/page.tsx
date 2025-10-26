import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Camera, MessageCircle, Heart, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold text-foreground">SkinCare</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button>Enter App</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Your Personal Skin Journey Starts Here
          </h1>
          <p className="text-pretty text-lg text-muted-foreground sm:text-xl">
            Track your acne progress with AI-powered analysis, get personalized skincare routines, and discover products
            that work for your unique skin.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/onboarding">
              <Button size="lg" className="w-full sm:w-auto">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">AI Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Identify your acne type and severity instantly with AI-powered skin analysis to understand what you're
              dealing with
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">Photo Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Document your progress with visual timelines and before-after comparisons to see real improvements over
              time
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">AI Chatbot</h3>
            <p className="text-sm text-muted-foreground">
              Get instant answers to your skincare questions and personalized advice whenever you need guidance
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">Personalized Routines</h3>
            <p className="text-sm text-muted-foreground">
              Receive custom morning and evening routines tailored to your skin type to tackle your specific concerns
              effectively
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to Transform Your Skin?
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Be part of a growing community taking control of their skincare journey with AI-powered insights and
            personalized tracking.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 SkinCare. Your personal skin journey companion.</p>
        </div>
      </footer>
    </div>
  )
}
