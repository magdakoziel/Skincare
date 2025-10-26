"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { acneTypes } from "@/lib/acne-types"
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"

export default function GlossaryPage() {

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Skin Concerns Glossary</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Learn about different acne types, skin concerns, how to identify them, and what treatments work best
        </p>
      </div>

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

      <Card className="mt-8 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
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
    </div>
  )
}
