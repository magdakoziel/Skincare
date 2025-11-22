"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { acneTypes } from "@/lib/acne-types"
import { activeIngredients, type SkinType } from "@/lib/ingredients"
import { AlertCircle, CheckCircle2, XCircle, Clock, Droplet, Lightbulb, Filter } from "lucide-react"

export default function GlossaryPage() {
  const [activeTab, setActiveTab] = useState("concerns")
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType | "all">("all")
  const [selectedPurpose, setSelectedPurpose] = useState<string>("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const skinTypes: Array<{ value: SkinType | "all"; label: string }> = [
    { value: "all", label: "All" },
    { value: "dry", label: "Dry" },
    { value: "oily", label: "Oily" },
    { value: "combination", label: "Combination" },
    { value: "sensitive", label: "Sensitive" },
    { value: "normal", label: "Normal" }
  ]

  const purposes = [
    { value: "all", label: "All" },
    { value: "anti-aging", label: "Anti-Aging" },
    { value: "hydration", label: "Hydration" },
    { value: "brightening", label: "Brightening" },
    { value: "anti-inflammatory", label: "Anti-Inflammatory" },
    { value: "acne", label: "Acne Treatment" },
    { value: "exfoliation", label: "Exfoliation" }
  ]

  const filteredIngredients = useMemo(() => {
    let filtered = activeIngredients

    // Filter by skin type
    if (selectedSkinType !== "all") {
      filtered = filtered.filter(ing => ing.suitableForSkinTypes.includes(selectedSkinType))
    }

    // Filter by purpose
    if (selectedPurpose !== "all") {
      filtered = filtered.filter(ing => {
        const benefitsText = ing.benefits.join(" ").toLowerCase()
        const categoryText = ing.category.toLowerCase()

        switch (selectedPurpose) {
          case "anti-aging":
            return benefitsText.includes("aging") ||
                   benefitsText.includes("wrinkle") ||
                   benefitsText.includes("collagen") ||
                   benefitsText.includes("fine line")
          case "hydration":
            return benefitsText.includes("hydrat") ||
                   benefitsText.includes("moisture") ||
                   categoryText.includes("humectant") ||
                   categoryText.includes("moisturizer")
          case "brightening":
            return benefitsText.includes("brighten") ||
                   benefitsText.includes("dark spot") ||
                   benefitsText.includes("hyperpigmentation") ||
                   benefitsText.includes("melasma") ||
                   categoryText.includes("brightening")
          case "anti-inflammatory":
            return benefitsText.includes("inflammat") ||
                   benefitsText.includes("sooth") ||
                   benefitsText.includes("redness") ||
                   benefitsText.includes("calm")
          case "acne":
            return benefitsText.includes("acne") ||
                   benefitsText.includes("breakout") ||
                   benefitsText.includes("pore") ||
                   categoryText.includes("antibacterial")
          case "exfoliation":
            return benefitsText.includes("exfoliat") ||
                   categoryText.includes("aha") ||
                   categoryText.includes("bha") ||
                   categoryText.includes("acid")
          default:
            return true
        }
      })
    }

    return filtered
  }, [selectedSkinType, selectedPurpose])

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
      <div className="container mx-auto px-4 py-6 md:py-8 pb-20 md:pb-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Skincare Glossary</h1>
          <p className="mt-2 text-base md:text-lg text-muted-foreground">
            Learn about skin concerns and active ingredients to make informed skincare decisions
          </p>
        </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="concerns">Skin Concerns</TabsTrigger>
          <TabsTrigger value="ingredients">Active Ingredients</TabsTrigger>
        </TabsList>

        {/* Skin Concerns Tab */}
        <TabsContent value="concerns" className="space-y-6">

      <Accordion type="multiple" className="space-y-4">
        {acneTypes.map((acneType) => (
          <AccordionItem key={acneType.id} value={acneType.id} className="border-border rounded-lg border bg-card">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex w-full flex-col gap-3 text-left sm:pr-4">
                <h2 className="text-xl font-semibold">{acneType.name}</h2>
                <p className="text-sm text-muted-foreground">{acneType.medicalName}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <p className="text-muted-foreground">{acneType.description}</p>
                </div>

                <Separator />

                {/* How to Identify */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">How to Identify</h3>
                  </div>
                  <ul className="ml-6 space-y-1">
                    {acneType.howToIdentify.map((point, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Causes */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Common Causes</h3>
                  <ul className="ml-6 space-y-1">
                    {acneType.causes.map((cause, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {cause}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatment Focus */}
                <div className="rounded-lg bg-muted/50 p-4">
                  <h3 className="mb-3 text-lg font-semibold">Treatment Focus</h3>
                  <ul className="ml-6 space-y-1">
                    {acneType.treatmentFocus.map((focus, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {focus}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Recommended Ingredients */}
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                    <div className="mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h3 className="font-semibold text-green-900 dark:text-green-100">Recommended Ingredients</h3>
                    </div>
                    <ul className="ml-6 space-y-1">
                      {acneType.recommendedIngredients.map((ingredient, idx) => (
                        <li key={idx} className="text-sm text-green-800 dark:text-green-200">
                          • {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Avoid Ingredients */}
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                    <div className="mb-3 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <h3 className="font-semibold text-red-900 dark:text-red-100">Avoid</h3>
                    </div>
                    <ul className="ml-6 space-y-1">
                      {acneType.avoidIngredients.map((ingredient, idx) => (
                        <li key={idx} className="text-sm text-red-800 dark:text-red-200">
                          • {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
            <CardHeader>
              <CardTitle className="text-yellow-900 dark:text-yellow-100">Important Note</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                This glossary is for educational purposes only. For severe acne (nodules, cysts) or acne that doesn't
                improve with over-the-counter treatments, please consult a dermatologist. Professional medical advice is
                essential for proper diagnosis and treatment.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Ingredients Tab */}
        <TabsContent value="ingredients" className="space-y-6">
          {/* Filters - Collapsible */}
          <Card className="border-border bg-muted/30">
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                {/* Filter Icon/Header - Click to toggle */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 w-full hover:opacity-70 transition-opacity"
                >
                  <Filter className="h-5 w-5 text-primary" />
                  {isFilterOpen && (
                    <h3 className="text-sm md:text-base font-semibold">Ingredients</h3>
                  )}
                </button>

                {/* Filter Options - Show when open */}
                {isFilterOpen && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* All ingredients text with count */}
                    <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                      <span>
                        {selectedSkinType === "all" && selectedPurpose === "all"
                          ? `All ingredients (${filteredIngredients.length})`
                          : `Showing ${filteredIngredients.length} ingredient${filteredIngredients.length !== 1 ? 's' : ''}`
                        }
                      </span>
                    </div>

                    {/* Skin Types Filter */}
                    <div className="space-y-2">
                      <h4 className="text-xs md:text-sm font-semibold text-foreground">Skin Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {skinTypes.slice(1).map((type) => (
                          <Button
                            key={type.value}
                            size="sm"
                            variant={selectedSkinType === type.value ? "default" : "outline"}
                            onClick={() => setSelectedSkinType(type.value)}
                            className="text-xs md:text-sm rounded-xl"
                          >
                            {type.label}
                          </Button>
                        ))}
                        {selectedSkinType !== "all" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedSkinType("all")}
                            className="text-xs md:text-sm rounded-xl"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Purpose Filter */}
                    <div className="space-y-2">
                      <h4 className="text-xs md:text-sm font-semibold text-foreground">Purpose</h4>
                      <div className="flex flex-wrap gap-2">
                        {purposes.slice(1).map((purpose) => (
                          <Button
                            key={purpose.value}
                            size="sm"
                            variant={selectedPurpose === purpose.value ? "default" : "outline"}
                            onClick={() => setSelectedPurpose(purpose.value)}
                            className="text-xs md:text-sm rounded-xl"
                          >
                            {purpose.label}
                          </Button>
                        ))}
                        {selectedPurpose !== "all" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedPurpose("all")}
                            className="text-xs md:text-sm rounded-xl"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Accordion type="multiple" className="space-y-4">
            {filteredIngredients.map((ingredient) => (
              <AccordionItem key={ingredient.id} value={ingredient.id} className="border-border rounded-lg border bg-card">
                <AccordionTrigger className="px-4 md:px-6 py-4 hover:no-underline">
                  <div className="flex w-full flex-col gap-2 text-left sm:pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg md:text-xl font-semibold">{ingredient.name}</h2>
                      <Badge variant="secondary" className="text-xs">{ingredient.category}</Badge>
                    </div>
                    {ingredient.commonNames.length > 0 && (
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Also known as: {ingredient.commonNames.join(", ")}
                      </p>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-6 pb-6">
                  <div className="space-y-6">
                    {/* How it Works */}
                    <div>
                      <p className="text-sm md:text-base text-muted-foreground">{ingredient.howItWorks}</p>
                    </div>

                    <Separator />

                    {/* Benefits */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        <h3 className="text-base md:text-lg font-semibold">Key Benefits</h3>
                      </div>
                      <ul className="ml-6 space-y-1">
                        {ingredient.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            • {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Who Should Use */}
                    <div>
                      <h3 className="mb-3 text-base md:text-lg font-semibold">Who Should Use It</h3>
                      <ul className="ml-6 space-y-1">
                        {ingredient.whoShouldUse.map((use, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            • {use}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suitable Skin Types */}
                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 md:p-4">
                      <h3 className="mb-2 text-sm md:text-base font-semibold flex items-center gap-2">
                        <Filter className="h-4 w-4 text-primary" />
                        Suitable for Skin Types
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {ingredient.suitableForSkinTypes.map((skinType) => (
                          <Badge key={skinType} variant="secondary" className="text-xs capitalize">
                            {skinType}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Usage Info */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg bg-muted/50 p-3 md:p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Droplet className="h-4 w-4 text-primary" />
                          <h3 className="text-sm md:text-base font-semibold">Concentration</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{ingredient.typicalConcentration}</p>
                      </div>

                      <div className="rounded-lg bg-muted/50 p-3 md:p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <h3 className="text-sm md:text-base font-semibold">Best Time to Use</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{ingredient.timeOfDay}</p>
                        {ingredient.pHSensitive && (
                          <p className="mt-1 text-xs text-muted-foreground italic">pH sensitive - use on clean skin</p>
                        )}
                      </div>
                    </div>

                    {/* Combinations */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Best Combinations */}
                      <div className="rounded-lg border border-green-200 bg-green-50 p-3 md:p-4 dark:border-green-800 dark:bg-green-950">
                        <div className="mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-4 md:h-5 w-4 md:w-5 text-green-600 dark:text-green-400" />
                          <h3 className="text-sm md:text-base font-semibold text-green-900 dark:text-green-100">Works Well With</h3>
                        </div>
                        <ul className="ml-6 space-y-1">
                          {ingredient.bestCombinations.map((combo, idx) => (
                            <li key={idx} className="text-xs md:text-sm text-green-800 dark:text-green-200">
                              • {combo}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Avoid Combining */}
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3 md:p-4 dark:border-red-800 dark:bg-red-950">
                        <div className="mb-3 flex items-center gap-2">
                          <XCircle className="h-4 md:h-5 w-4 md:w-5 text-red-600 dark:text-red-400" />
                          <h3 className="text-sm md:text-base font-semibold text-red-900 dark:text-red-100">Avoid Combining With</h3>
                        </div>
                        {ingredient.avoidCombining.length > 0 ? (
                          <ul className="ml-6 space-y-1">
                            {ingredient.avoidCombining.map((avoid, idx) => (
                              <li key={idx} className="text-xs md:text-sm text-red-800 dark:text-red-200">
                                • {avoid}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs md:text-sm text-red-800 dark:text-red-200">
                            No known problematic combinations
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Contraindications */}
                    {ingredient.contraindications.length > 0 && (
                      <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 md:p-4 dark:border-orange-800 dark:bg-orange-950">
                        <div className="mb-3 flex items-center gap-2">
                          <AlertCircle className="h-4 md:h-5 w-4 md:w-5 text-orange-600 dark:text-orange-400" />
                          <h3 className="text-sm md:text-base font-semibold text-orange-900 dark:text-orange-100">Contraindications</h3>
                        </div>
                        <ul className="ml-6 space-y-1">
                          {ingredient.contraindications.map((contra, idx) => (
                            <li key={idx} className="text-xs md:text-sm text-orange-800 dark:text-orange-200">
                              • {contra}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">Patch Test First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Always patch test new active ingredients on a small area of skin before applying to your entire face.
                Start with lower concentrations and gradually increase as your skin builds tolerance. When in doubt,
                consult with a dermatologist, especially if you have sensitive skin or are pregnant.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}
