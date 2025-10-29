import type { OnboardingData } from "@/components/onboarding/onboarding-flow"

export type AcneTypeResult = {
  primaryType: string
  secondaryTypes: string[]
  likelyCauses: string[]
  treatmentFocus: string[]
  productRecommendations: string[]
  lifestyleRecommendations: string[]
}

/**
 * Interprets quiz results to determine acne type and provide personalized recommendations
 * Based on dermatological assessment patterns
 */
export function interpretQuizResults(data: OnboardingData): AcneTypeResult {
  const causes: Set<string> = new Set()
  const treatmentFocus: Set<string> = new Set()
  const productRecs: Set<string> = new Set()
  const lifestyleRecs: Set<string> = new Set()
  let primaryType = "Unknown"
  const secondaryTypes: string[] = []

  // Track if we've added certain types of recommendations to avoid duplicates
  let hasHormonalCause = false
  let hasInflammationCause = false
  let hasDermatologistRec = false
  let hasHormonalTestingRec = false
  let hasActivesRec = false

  // Q1: Skin Type
  if (data.skinType === "oily") {
    causes.add("Excess sebum production")
    treatmentFocus.add("Oil control and pore refinement")
    productRecs.add("Oil-free, non-comedogenic products")
    productRecs.add("Salicylic acid cleanser")
    productRecs.add("Clay masks")
  } else if (data.skinType === "dry") {
    causes.add("Compromised skin barrier")
    treatmentFocus.add("Hydration and barrier repair")
    productRecs.add("Gentle, hydrating cleanser")
    productRecs.add("Ceramide-based moisturizer")
  } else if (data.skinType === "combination") {
    causes.add("Mixed sebum production")
    treatmentFocus.add("Balanced approach - treat zones differently")
    productRecs.add("Lightweight, balancing products")
  }

  // Q2: Breakout Frequency
  if (data.breakoutFrequency === "everyday") {
    primaryType = "Persistent/Chronic Acne"
    if (!hasInflammationCause) {
      causes.add("Chronic inflammation")
      hasInflammationCause = true
    }
    if (!hasHormonalCause) {
      causes.add("Hormonal imbalance (possible underlying cause)")
      hasHormonalCause = true
    }
    treatmentFocus.add("Consistent daily treatment")
    if (!hasDermatologistRec) {
      treatmentFocus.add("Professional dermatologist consultation recommended")
      hasDermatologistRec = true
    }
  } else if (data.breakoutFrequency === "few-times-month") {
    primaryType = "Moderate Acne"
    if (!hasInflammationCause) {
      causes.add("Periodic inflammation")
      hasInflammationCause = true
    }
  } else if (data.breakoutFrequency === "period-stress") {
    primaryType = "Hormonal Acne"
    if (!hasHormonalCause) {
      causes.add("Hormonal fluctuations (period/stress-related)")
      hasHormonalCause = true
    }
    treatmentFocus.add("Hormonal balance support")
    treatmentFocus.add("Stress management")
    productRecs.add("Niacinamide serum")
    productRecs.add("Azelaic acid")
    lifestyleRecs.add("Track breakouts with menstrual cycle")
    lifestyleRecs.add("Practice stress-reduction techniques")
  } else if (data.breakoutFrequency === "rarely") {
    primaryType = "Mild/Occasional Acne"
    causes.add("External triggers")
  }

  // Q3: Breakout Appearance
  if (data.breakoutAppearance === "cysts-nodules") {
    secondaryTypes.push("Cystic/Nodular Acne")
    if (!hasInflammationCause) {
      causes.add("Deep inflammation")
      hasInflammationCause = true
    }
    if (!hasHormonalCause) {
      causes.add("Hormonal imbalance (possible underlying cause)")
      hasHormonalCause = true
    }
    if (!hasDermatologistRec) {
      treatmentFocus.add("Professional evaluation ESSENTIAL to identify root cause")
      lifestyleRecs.add("See dermatologist urgently to investigate underlying causes")
      hasDermatologistRec = true
    }
    treatmentFocus.add("Prevent scarring")
    productRecs.add("Gentle, non-irritating products only")
    if (!hasHormonalTestingRec) {
      lifestyleRecs.add("Consider hormonal testing and dietary evaluation")
      hasHormonalTestingRec = true
    }
    lifestyleRecs.add("Anti-inflammatory diet may help reduce severity")
    lifestyleRecs.add("Never pick or squeeze cystic acne - will worsen scarring")
  } else if (data.breakoutAppearance === "small-blackheads") {
    secondaryTypes.push("Comedonal Acne (Blackheads/Whiteheads)")
    causes.add("Pore clogging")
    causes.add("Dead skin cell buildup")
    treatmentFocus.add("Exfoliation and pore clearing")
    productRecs.add("BHA (salicylic acid)")
    productRecs.add("Retinoids")
    productRecs.add("Clay masks")
  } else if (data.breakoutAppearance === "red-irritation") {
    secondaryTypes.push("Inflammatory Acne (Papules/Pustules)")
    if (!hasInflammationCause) {
      causes.add("Bacterial inflammation")
      hasInflammationCause = true
    }
    causes.add("Skin irritation")
    treatmentFocus.add("Reduce inflammation")
    treatmentFocus.add("Antibacterial treatment")
    productRecs.add("Benzoyl peroxide")
    productRecs.add("Niacinamide")
    productRecs.add("Centella asiatica")
  } else if (data.breakoutAppearance === "blackheads-only") {
    secondaryTypes.push("Comedonal Acne (Non-inflammatory)")
    causes.add("Sebum oxidation")
    causes.add("Pore congestion")
    treatmentFocus.add("Gentle exfoliation")
    treatmentFocus.add("Pore maintenance")
    productRecs.add("Salicylic acid")
    productRecs.add("Chemical exfoliants (AHA/BHA)")
  }

  // Q4: Breakout Locations
  if (data.breakoutLocations.includes("forehead-nose")) {
    causes.add("Excess oil in T-zone")
    secondaryTypes.push("T-zone congestion")
  }
  if (data.breakoutLocations.includes("chin-jawline")) {
    if (primaryType !== "Hormonal Acne") {
      secondaryTypes.push("Hormonal pattern")
    }
    if (!hasHormonalCause) {
      causes.add("Hormonal imbalance (possible underlying cause)")
      hasHormonalCause = true
    }
    if (!hasHormonalTestingRec) {
      lifestyleRecs.add("Consider hormonal evaluation if persistent")
      hasHormonalTestingRec = true
    }
  }
  if (data.breakoutLocations.includes("cheeks")) {
    causes.add("Bacteria transfer from phone/pillowcase")
    lifestyleRecs.add("Clean phone screen daily")
    lifestyleRecs.add("Change pillowcases frequently")
  }
  if (data.breakoutLocations.includes("back-shoulders")) {
    causes.add("Body acne (folliculitis)")
    productRecs.add("Benzoyl peroxide body wash")
    productRecs.add("Salicylic acid body spray")
    lifestyleRecs.add("Shower immediately after sweating")
  }

  // Q5: Skin Feel
  if (data.skinFeel === "tight-dry") {
    causes.add("Over-cleansing or barrier damage")
    treatmentFocus.add("Restore skin barrier")
    productRecs.add("Switch to gentler cleanser")
    productRecs.add("Add hydrating layers")
  } else if (data.skinFeel === "oily-shiny") {
    causes.add("Overactive sebaceous glands")
    productRecs.add("Oil-control products")
    productRecs.add("Mattifying moisturizer")
  }

  // Q6: Touching/Picking Behavior
  if (data.touchingBehavior === "often" || data.touchingBehavior === "compulsive") {
    causes.add("Bacterial transfer from hands")
    causes.add("Physical trauma to skin")
    treatmentFocus.add("Break picking habit - critical for healing")
    productRecs.add("Pimple patches to prevent touching")
    lifestyleRecs.add("Identify and address triggers for picking")
    lifestyleRecs.add("Keep hands busy with fidget tools")
    if (data.touchingBehavior === "compulsive") {
      lifestyleRecs.add("Consult mental health professional - skin picking disorder possible")
    }
  } else if (data.touchingBehavior === "sometimes") {
    lifestyleRecs.add("Be mindful of touching face during stress")
  }

  // Q7: Lifestyle
  if (data.lifestyle === "high-stress") {
    causes.add("Chronic stress elevating cortisol")
    treatmentFocus.add("Stress management essential")
    lifestyleRecs.add("Practice stress-reduction: meditation, exercise, sleep")
    lifestyleRecs.add("Consider adaptogenic supplements")
  } else if (data.lifestyle === "processed-food") {
    causes.add("Diet may influence inflammation")
    lifestyleRecs.add("Consider reducing dairy and high-glycemic foods")
    lifestyleRecs.add("Increase anti-inflammatory foods (omega-3, vegetables)")
  }

  // Q8: Makeup/SPF Usage
  if (data.makeupSpfUsage === "heavy-makeup") {
    causes.add("Potential pore-clogging from makeup")
    treatmentFocus.add("Thorough makeup removal essential")
    productRecs.add("Oil-based cleanser for first cleanse")
    productRecs.add("Non-comedogenic makeup products")
    lifestyleRecs.add("Double cleanse every night")
    lifestyleRecs.add("Check makeup ingredients for comedogenic ratings")
  } else if (data.makeupSpfUsage === "no-makeup-no-spf") {
    treatmentFocus.add("Add SPF - crucial for preventing PIH and skin health")
    productRecs.add("Non-comedogenic SPF 50+ daily")
  }

  // Q9: Product Changes
  if (data.productChanges === "recent-switch") {
    causes.add("Possible product reaction or purging")
    lifestyleRecs.add("If new products contain actives (retinoids, acids), purging is normal for 4-6 weeks")
    lifestyleRecs.add("If reaction (burning, rash), stop immediately")
  } else if (data.productChanges === "frequent") {
    causes.add("Skin barrier may be compromised from product switching")
    treatmentFocus.add("Simplify routine and give products time to work")
    lifestyleRecs.add("Stick with products for at least 6-8 weeks before switching")
  }

  // Q10: Skin Reaction
  if (data.skinReaction === "severe-reaction") {
    secondaryTypes.push("Sensitive/Reactive Skin")
    causes.add("Compromised skin barrier")
    causes.add("Possible allergies or sensitivities")
    treatmentFocus.add("Barrier repair before treating acne")
    productRecs.add("Fragrance-free products")
    productRecs.add("Minimal ingredient lists")
    productRecs.add("Patch test everything")
    lifestyleRecs.add("Introduce new products one at a time")
    lifestyleRecs.add("Keep skincare routine very simple")
  } else if (data.skinReaction === "new-breakouts") {
    causes.add("Comedogenic ingredients in products")
    lifestyleRecs.add("Check product ingredients against comedogenic lists")
  } else if (data.skinReaction === "mild-irritation") {
    if (!hasActivesRec) {
      lifestyleRecs.add("Introduce actives slowly and buffer strong treatments with moisturizer")
      hasActivesRec = true
    }
  }

  // Additional treatment recommendations based on primary type
  if (primaryType === "Hormonal Acne") {
    treatmentFocus.add("Target hormonal pathways and root causes")
    productRecs.add("Retinoids for cell turnover")
    if (!hasDermatologistRec && !hasHormonalTestingRec) {
      lifestyleRecs.add("Consider seeing endocrinologist to address hormonal imbalances")
    }
    lifestyleRecs.add("Balance blood sugar levels - avoid high-glycemic foods")
    lifestyleRecs.add("Reduce dairy consumption (may worsen hormonal acne)")
    lifestyleRecs.add("Manage stress through regular exercise and adequate sleep")
  } else if (primaryType === "Persistent/Chronic Acne") {
    if (!hasDermatologistRec) {
      treatmentFocus.add("Dermatologist evaluation essential - focus on treating root causes")
      lifestyleRecs.add("Work with dermatologist to identify and address underlying causes")
      hasDermatologistRec = true
    }
    if (!hasHormonalTestingRec) {
      lifestyleRecs.add("Consider comprehensive health evaluation - gut health, hormones, diet")
    } else {
      lifestyleRecs.add("Consider gut health and diet evaluation")
    }
    lifestyleRecs.add("May need prescription tretinoin as last resort if lifestyle changes don't help")
  }

  // Universal recommendations
  if (!productRecs.has("Non-comedogenic SPF 50+ daily")) {
    productRecs.add("SPF 50+ every morning (prevents PIH and protects skin)")
  }

  if (!lifestyleRecs.has("Change pillowcases frequently") && !lifestyleRecs.has("Clean phone screen daily")) {
    lifestyleRecs.add("Maintain good hygiene: clean pillowcases, towels, makeup brushes")
  }

  return {
    primaryType,
    secondaryTypes: [...new Set(secondaryTypes)], // Remove duplicates
    likelyCauses: Array.from(causes),
    treatmentFocus: Array.from(treatmentFocus),
    productRecommendations: Array.from(productRecs),
    lifestyleRecommendations: Array.from(lifestyleRecs),
  }
}

/**
 * Generates a summary message based on the quiz results
 */
export function generateResultSummary(result: AcneTypeResult): string {
  let summary = `Based on your responses, you likely have **${result.primaryType}**`

  if (result.secondaryTypes.length > 0) {
    summary += ` with characteristics of ${result.secondaryTypes.join(", ")}`
  }

  summary += ".\n\n"

  if (result.likelyCauses.length > 0) {
    summary += `**Likely contributing factors:** ${result.likelyCauses.slice(0, 3).join(", ")}`
    if (result.likelyCauses.length > 3) {
      summary += `, and ${result.likelyCauses.length - 3} more`
    }
  }

  return summary
}
