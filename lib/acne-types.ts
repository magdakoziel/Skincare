export type AcneType = {
  id: string
  name: string
  medicalName: string
  severity: "mild" | "moderate" | "severe"
  description: string
  howToIdentify: string[]
  causes: string[]
  treatmentFocus: string[]
  recommendedIngredients: string[]
  avoidIngredients: string[]
  images?: string[]
}

export const acneTypes: AcneType[] = [
  {
    id: "blackheads",
    name: "Blackheads",
    medicalName: "Open Comedones",
    severity: "mild",
    description:
      "Blackheads are small, dark bumps that appear on the skin when hair follicles become clogged with oil and dead skin cells. The dark color is not dirt but oxidized melanin and sebum exposed to air.",
    howToIdentify: [
      "Small, dark spots on the skin surface",
      "Slightly raised bumps",
      "Most common on nose, chin, and forehead",
      "Open pore with visible dark plug",
      "Not inflamed or painful",
    ],
    causes: [
      "Excess sebum (oil) production",
      "Dead skin cell buildup",
      "Hormonal changes",
      "Certain medications",
      "Heavy or comedogenic skincare products",
    ],
    treatmentFocus: [
      "Regular exfoliation to remove dead skin cells",
      "Oil control and pore cleansing",
      "Prevent pore clogging",
      "Gentle extraction (by professionals)",
    ],
    recommendedIngredients: [
      "Salicylic Acid (BHA) - penetrates pores and dissolves oil",
      "Retinoids - increase cell turnover",
      "Niacinamide - regulates sebum production",
      "Clay masks - absorb excess oil",
      "AHAs (Glycolic/Lactic Acid) - surface exfoliation",
    ],
    avoidIngredients: [
      "Heavy oils and butters",
      "Comedogenic ingredients (coconut oil, cocoa butter)",
      "Thick, occlusive creams",
    ],
  },
  {
    id: "whiteheads",
    name: "Whiteheads",
    medicalName: "Closed Comedones",
    severity: "mild",
    description:
      "Whiteheads are small, white or flesh-colored bumps that form when pores become clogged with oil and dead skin cells. Unlike blackheads, the pore is closed, trapping the sebum underneath the skin.",
    howToIdentify: [
      "Small, white or skin-colored bumps",
      "Closed at the surface (no visible opening)",
      "Slightly raised texture",
      "Common on forehead, chin, and cheeks",
      "Not inflamed but can be numerous",
    ],
    causes: [
      "Excess oil production",
      "Dead skin cell accumulation",
      "Hormonal fluctuations",
      "Comedogenic skincare or makeup",
      "Inadequate cleansing",
    ],
    treatmentFocus: [
      "Gentle exfoliation to prevent pore clogging",
      "Increase skin cell turnover",
      "Regulate oil production",
      "Use non-comedogenic products",
    ],
    recommendedIngredients: [
      "Retinoids - prevent pore clogging and increase turnover",
      "Salicylic Acid - exfoliates inside pores",
      "Benzoyl Peroxide (low %) - mild antimicrobial",
      "Niacinamide - reduces sebum",
      "AHAs - surface exfoliation",
    ],
    avoidIngredients: [
      "Heavy, pore-clogging ingredients",
      "Excessive harsh scrubs (can worsen)",
      "Over-moisturizing products",
    ],
  },
  {
    id: "papules",
    name: "Papules",
    medicalName: "Inflammatory Papules",
    severity: "moderate",
    description:
      "Papules are small, red, inflamed bumps without a visible center or pus. They occur when the walls around your pores break down from severe inflammation, causing hard, clogged pores that are tender to touch.",
    howToIdentify: [
      "Small, red, raised bumps",
      "No visible white or yellow center",
      "Tender or painful to touch",
      "Hard texture under the skin",
      "Usually 2-5mm in size",
      "Surrounded by red, inflamed skin",
    ],
    causes: [
      "Bacterial infection (C. acnes)",
      "Inflammation of clogged pores",
      "Hormonal imbalances",
      "Stress",
      "Picking at or squeezing comedones",
    ],
    treatmentFocus: [
      "Reduce inflammation",
      "Kill acne-causing bacteria",
      "Prevent scarring",
      "Avoid picking or squeezing",
      "Gentle skincare routine",
    ],
    recommendedIngredients: [
      "Benzoyl Peroxide - kills bacteria and reduces inflammation",
      "Salicylic Acid - anti-inflammatory and exfoliating",
      "Niacinamide - calms inflammation",
      "Azelaic Acid - antibacterial and anti-inflammatory",
      "Retinoids - prevent new formation",
      "Sulfur - reduces inflammation",
    ],
    avoidIngredients: [
      "Harsh scrubs or exfoliants",
      "Alcohol-based products",
      "Fragrances and irritants",
    ],
  },
  {
    id: "pustules",
    name: "Pustules",
    medicalName: "Inflammatory Pustules",
    severity: "moderate",
    description:
      "Pustules are inflamed, pus-filled bumps that are similar to papules but contain white or yellow pus at the center. They are a sign of infection and inflammation in the pore.",
    howToIdentify: [
      "Red, inflamed base",
      "White or yellow pus-filled center",
      "Larger than whiteheads",
      "Tender and may be painful",
      "Clear boundary between healthy and inflamed skin",
    ],
    causes: [
      "Bacterial overgrowth in clogged pores",
      "Immune response to bacteria",
      "Hormonal changes",
      "Picking at or irritating acne",
      "Certain medications",
    ],
    treatmentFocus: [
      "Kill bacteria",
      "Reduce inflammation and redness",
      "Prevent spreading",
      "Allow natural healing (don't pop)",
      "Prevent post-inflammatory marks",
    ],
    recommendedIngredients: [
      "Benzoyl Peroxide - strong antibacterial",
      "Salicylic Acid - reduces inflammation",
      "Sulfur - dries out pustules",
      "Tea Tree Oil - natural antibacterial",
      "Niacinamide - reduces redness",
      "Retinoids - long-term prevention",
    ],
    avoidIngredients: [
      "Heavy, occlusive products",
      "Harsh physical exfoliants",
      "Comedogenic oils",
    ],
  },
  {
    id: "nodules",
    name: "Nodules",
    medicalName: "Acne Nodules",
    severity: "severe",
    description:
      "Nodules are large, solid, painful lumps beneath the skin's surface. They develop when clogged, inflamed pores endure further irritation and grow larger. Unlike pustules, they don't have a visible head and are deeper in the skin.",
    howToIdentify: [
      "Large, hard lumps under the skin",
      "Very painful and tender",
      "No visible head or pus",
      "Can be skin-colored or red",
      "Usually larger than 5mm",
      "Can last for weeks or months",
    ],
    causes: [
      "Severe inflammation deep in the skin",
      "Hormonal imbalances (especially testosterone)",
      "Genetics",
      "Stress",
      "Certain medications",
    ],
    treatmentFocus: [
      "Seek professional dermatological treatment",
      "Reduce deep inflammation",
      "Prevent scarring",
      "Consider oral medications",
      "Never attempt to squeeze or pop",
    ],
    recommendedIngredients: [
      "Prescription retinoids (tretinoin, isotretinoin)",
      "Oral antibiotics (prescribed by doctor)",
      "Hormonal treatments (for hormonal acne)",
      "Corticosteroid injections (by dermatologist)",
      "Benzoyl Peroxide - supplementary use",
      "Professional chemical peels",
    ],
    avoidIngredients: [
      "Harsh, irritating products",
      "Over-exfoliation",
      "Home remedies that may worsen",
    ],
  },
  {
    id: "cysts",
    name: "Cystic Acne",
    medicalName: "Acne Cysts",
    severity: "severe",
    description:
      "Cystic acne is the most severe form of acne, consisting of large, soft, pus-filled lumps deep beneath the skin. These painful lesions develop when oil and dead skin cells build up deep within hair follicles, causing infection and inflammation.",
    howToIdentify: [
      "Large, soft, pus-filled lumps",
      "Very painful and tender",
      "Deep under the skin surface",
      "Red or purple in color",
      "Can be larger than 10mm",
      "Often leaves scars",
      "May feel like a boil",
    ],
    causes: [
      "Severe hormonal imbalances",
      "Genetic predisposition",
      "Overactive oil glands",
      "Deep bacterial infection",
      "Severe inflammation",
    ],
    treatmentFocus: [
      "MUST see a dermatologist",
      "Prevent permanent scarring",
      "Reduce pain and inflammation",
      "Address underlying hormonal issues",
      "Long-term management plan",
    ],
    recommendedIngredients: [
      "Prescription isotretinoin (Accutane) - most effective",
      "Oral antibiotics (doxycycline, minocycline)",
      "Hormonal therapy (birth control, spironolactone)",
      "Corticosteroid injections (rapid reduction)",
      "Professional extraction and drainage",
      "Topical retinoids - supplementary",
    ],
    avoidIngredients: [
      "Any potentially irritating ingredients",
      "DIY treatments",
      "Picking or attempting to pop",
    ],
  },
  {
    id: "fungal-acne",
    name: "Fungal Acne",
    medicalName: "Malassezia Folliculitis",
    severity: "mild",
    description:
      "Fungal acne is not true acne but a fungal infection of hair follicles caused by yeast overgrowth. It appears as small, uniform bumps that are often itchy and don't respond to traditional acne treatments.",
    howToIdentify: [
      "Small, uniform bumps (all similar size)",
      "Often itchy (unlike bacterial acne)",
      "Clustered in specific areas (forehead, chest, back)",
      "No blackheads or whiteheads",
      "Doesn't respond to acne medications",
      "May worsen with oil-based products",
    ],
    causes: [
      "Yeast (Malassezia) overgrowth",
      "Hot, humid environments",
      "Excessive sweating",
      "Tight clothing",
      "Oil-based skincare products",
      "Antibiotics (kill good bacteria)",
    ],
    treatmentFocus: [
      "Antifungal treatment",
      "Reduce moisture and oil",
      "Stop using products that feed yeast",
      "Keep skin dry and clean",
      "Change skincare routine",
    ],
    recommendedIngredients: [
      "Antifungal treatments (ketoconazole, selenium sulfide)",
      "Zinc Pyrithione - antifungal",
      "Sulfur - antifungal properties",
      "Salicylic Acid - helps exfoliate",
      "Tea Tree Oil - natural antifungal",
      "Avoid oils that feed Malassezia",
    ],
    avoidIngredients: [
      "Oils that feed yeast (coconut oil, olive oil)",
      "Fatty acids and esters",
      "Heavy, occlusive products",
      "Traditional acne medications (may worsen)",
    ],
  },
  {
    id: "pih",
    name: "Post-Inflammatory Hyperpigmentation (PIH)",
    medicalName: "Post-Inflammatory Hyperpigmentation",
    severity: "mild",
    description:
      "PIH refers to the dark spots or marks left behind after acne heals. It's not a type of active acne, but a common aftermath. These marks occur when inflammation triggers excess melanin production in the skin.",
    howToIdentify: [
      "Flat, dark marks (brown, red, or purple)",
      "Appear where acne used to be",
      "No raised texture or bumps",
      "More common in darker skin tones",
      "Fade over time (months to years)",
      "Darken with sun exposure",
    ],
    causes: [
      "Inflammation from acne",
      "Picking or squeezing pimples",
      "Melanin overproduction",
      "Sun exposure during healing",
      "Delayed treatment of acne",
    ],
    treatmentFocus: [
      "Fade existing marks",
      "Prevent new marks from forming",
      "Protect from sun damage",
      "Boost skin cell turnover",
      "Even out skin tone",
    ],
    recommendedIngredients: [
      "Vitamin C - brightens and fades marks",
      "Niacinamide - reduces melanin transfer",
      "Retinoids - increase cell turnover",
      "Alpha Arbutin - melanin inhibitor",
      "Azelaic Acid - brightening and anti-inflammatory",
      "Kojic Acid - lightens hyperpigmentation",
      "Sunscreen SPF 30+ - ESSENTIAL to prevent darkening",
      "AHAs (Glycolic/Lactic Acid) - exfoliate and brighten",
    ],
    avoidIngredients: [
      "Harsh irritants that cause more inflammation",
      "Skipping sunscreen (makes marks worse)",
      "Over-exfoliation",
    ],
  },
]

export function getAcneTypeById(id: string): AcneType | undefined {
  return acneTypes.find((type) => type.id === id)
}

export function getAcneTypesBySeverity(severity: "mild" | "moderate" | "severe"): AcneType[] {
  return acneTypes.filter((type) => type.severity === severity)
}
