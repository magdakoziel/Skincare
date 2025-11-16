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
    id: "acne-scars",
    name: "Acne Scars",
    medicalName: "Atrophic & Hypertrophic Scars",
    severity: "moderate",
    description:
      "Acne scars develop when the skin's natural healing process is disrupted by severe inflammation, infection, or trauma (like picking or popping pimples). There are two main types: Atrophic Scars (indented marks where collagen was lost - ice pick, boxcar, rolling scars) and Hypertrophic/Keloid Scars (raised scars caused by excess collagen production).",
    howToIdentify: [
      "Atrophic (depressed) scars – shallow or deep indents",
      "Hypertrophic (raised) scars – thick, elevated bumps",
      "May accompany PIH or PIE marks",
      "Most visible in angled or direct light",
    ],
    causes: [
      "Severe inflammatory or cystic acne",
      "Picking, squeezing, or popping pimples",
      "Delayed or improper acne treatment",
      "Genetic tendency toward scarring",
    ],
    treatmentFocus: [
      "Stimulate collagen production",
      "Resurface and smooth the skin",
      "Minimize discoloration and prevent recurrence",
    ],
    recommendedIngredients: [
      "Retinoids (Retinol, Tretinoin) – increase collagen and smooth skin texture",
      "Chemical Peels (AHA/BHA) – exfoliate and fade surface scars",
      "Microneedling / RF Microneedling – stimulate new collagen formation",
      "Laser Treatments (Fractional, CO₂) – resurface deeper scars",
      "Vitamin C and Niacinamide – support skin repair and even tone",
      "Silicone Gel or Patches – for raised scars",
    ],
    avoidIngredients: [
      "Picking at healing pimples or scabs",
      "Aggressive exfoliation without dermatologist guidance",
      "Neglecting sunscreen (UV exposure deepens scars)",
    ],
  },

{
    id: "blackheads",
    name: "Blackheads",
    medicalName: "Open Comedones",
    severity: "mild",
    description:
      "Blackheads are small, dark bumps that appear on the skin when hair follicles (pores) become clogged with a mixture of sebum (oil) and dead skin cells. The dark color is not dirt — it's the result of oxidized melanin and oil that are exposed to air. Unlike pimples, blackheads are non-inflammatory, meaning they aren't red or painful.",
    howToIdentify: [
      "Small, dark or black spots on the skin surface",
      "Slightly raised texture, but not tender",
      "Most common on the nose, chin, and forehead (T-zone)",
      "Visible open pore with a dark plug",
      "Skin around may appear shiny or oily",
    ],
    causes: [
      "Overproduction of sebum (oil)",
      "Dead skin cell buildup in pores",
      "Hormonal changes (especially puberty or menstruation)",
      "Use of heavy, comedogenic skincare products",
      "Infrequent exfoliation or improper cleansing",
      "Pollution and excess sweating",
    ],
    treatmentFocus: [
      "Regular gentle exfoliation to clear pore blockages",
      "Control oil production without over-drying the skin",
      "Maintain consistent cleansing and hydration",
      "Professional extractions if necessary",
    ],
    recommendedIngredients: [
      "Salicylic Acid (BHA) – dissolves oil deep inside pores",
      "Retinoids (Adapalene, Retinol) – promote cell turnover",
      "Niacinamide – regulates oil production and shrinks pores",
      "Clay (Kaolin, Bentonite) – absorbs excess oil and impurities",
      "AHAs (Glycolic or Lactic Acid) – exfoliate surface buildup",
    ],
    avoidIngredients: [
      "Heavy oils (coconut oil, cocoa butter)",
      "Alcohol-heavy toners or over-drying cleansers",
      "Frequent manual squeezing — may enlarge pores or scar",
    ],
  },

{
    id: "cysts",
    name: "Cystic Acne",
    medicalName: "Acne Cysts",
    severity: "severe",
    description:
      "Cystic acne is the most severe form of acne, characterized by large, painful cysts deep beneath the skin's surface. These cysts form when a pore becomes clogged with oil, dead skin cells, and bacteria, and the resulting inflammation spreads into surrounding tissue. The immune system responds strongly, creating a pocket of pus. Because cysts are deep, they often do not come to a head and can cause scarring if not treated properly.",
    howToIdentify: [
      "Large, swollen, painful lumps under the skin",
      "May be red or skin-colored",
      "Deep-seated and tender to the touch",
      "Do not usually surface or form a whitehead",
      "Common on the jawline, chin, chest, shoulders, and back",
      "May leave dark marks or permanent scars",
    ],
    causes: [
      "Hormonal fluctuations (androgens increasing oil production)",
      "Genetics (family history of severe acne)",
      "High stress levels and poor sleep",
      "Certain medications (steroids, lithium)",
      "Improper skincare (heavy occlusives, irritants)",
    ],
    treatmentFocus: [
      "Target inflammation and bacterial infection",
      "Control hormones and excess oil",
      "Prevent long-term scarring",
    ],
    recommendedIngredients: [
      "Oral Isotretinoin – reduces oil gland size and acne formation (prescription only)",
      "Benzoyl Peroxide – kills acne-causing bacteria and reduces inflammation",
      "Topical or Oral Antibiotics – control bacterial activity (short-term use)",
      "Spironolactone – hormonal treatment for women with recurring cystic acne",
      "Retinoids (Adapalene, Tretinoin) – prevent clogged pores and reduce severity",
      "Niacinamide – anti-inflammatory and barrier-repairing support",
    ],
    avoidIngredients: [
      "Picking or squeezing cysts (can cause deep scarring)",
      "Overuse of harsh actives — can worsen inflammation",
      "Skipping sunscreen (sun exposure darkens healing spots)",
    ],
  },

{
    id: "fungal-acne",
    name: "Fungal Acne",
    medicalName: "Malassezia Folliculitis",
    severity: "mild",
    description:
      "Fungal acne, or Malassezia folliculitis, is a skin condition caused by an overgrowth of yeast (Malassezia) that naturally lives on the skin. It often looks similar to bacterial acne but has different triggers and treatments. The yeast feeds on oils in skincare or sweat, leading to itchy, uniform bumps and pustules — usually on the forehead, chest, or back.",
    howToIdentify: [
      "Small, itchy, uniform bumps (papules and pustules)",
      "Often appear in clusters",
      "Common on forehead, chest, back, or upper arms",
      "May worsen with heat, humidity, or sweating",
      "Does not respond to traditional acne treatments like benzoyl peroxide",
    ],
    causes: [
      "Hot and humid environments",
      "Excessive sweating and tight clothing",
      "Use of heavy, oily, or fatty acid–rich skincare",
      "Antibiotic use (disrupts skin's microbiome)",
      "Occlusive fabrics or non-breathable gear",
    ],
    treatmentFocus: [
      "Reduce yeast overgrowth and moisture buildup",
      "Avoid feeding the fungus with heavy oils",
      "Maintain skin microbiome balance",
    ],
    recommendedIngredients: [
      "Ketoconazole, Nizoral, or Clotrimazole Creams – antifungal medications (OTC or prescription)",
      "Sulfur – reduces yeast and oil",
      "Zinc Pyrithione – antifungal and soothing",
      "Salicylic Acid – gently exfoliates and clears blocked follicles",
      "Probiotic skincare – supports healthy microbiome balance",
    ],
    avoidIngredients: [
      "Coconut oil, olive oil, or esters (feed fungus)",
      "Occlusive or heavy moisturizers",
      "Long wear of sweaty clothes or helmets",
    ],
  },

{
    id: "hormonal-acne",
    name: "Hormonal Acne",
    medicalName: "Hormonal Acne",
    severity: "moderate",
    description:
      "Hormonal acne is caused by fluctuations in hormone levels — particularly androgens (like testosterone) — that stimulate sebaceous glands to produce excess oil. This type of acne tends to occur cyclically (often around the menstrual period) and manifests as deep, cystic breakouts on the jawline, chin, and lower cheeks. It can persist into adulthood and is often resistant to topical treatments alone.",
    howToIdentify: [
      "Deep, tender, cystic pimples (often painful to touch)",
      "Concentrated along the jawline, chin, and neck",
      "Flares before menstruation or with hormonal changes",
      "May leave dark marks or scars",
      "Common in adult women but can affect all genders",
    ],
    causes: [
      "Menstrual cycle fluctuations",
      "PCOS (Polycystic Ovary Syndrome)",
      "Discontinuing or changing birth control",
      "High stress (raises cortisol, which affects hormones)",
      "High-glycemic diets and dairy consumption",
    ],
    treatmentFocus: [
      "Balance hormone activity",
      "Control sebum production and inflammation",
      "Support skin healing and prevent recurrence",
    ],
    recommendedIngredients: [
      "Spironolactone (Prescription) – blocks androgen receptors and reduces oil production",
      "Combined Oral Contraceptives – regulate hormonal fluctuations",
      "Retinoids – improve cell turnover and prevent clogging",
      "Niacinamide – reduces inflammation and oil production",
      "Zinc – supports hormonal balance and healing",
      "Salicylic Acid / Azelaic Acid – target pores and brighten post-acne marks",
    ],
    avoidIngredients: [
      "Over-cleansing (can increase oil production rebound)",
      "Skipping meals or extreme diets (affects hormone balance)",
      "Stress and poor sleep (raise cortisol levels)",
    ],
  },

{
    id: "nodules",
    name: "Nodular Acne",
    medicalName: "Acne Nodules",
    severity: "severe",
    description:
      "Nodular acne involves large, firm, inflamed lumps that develop deep within the skin and may last for weeks or months. Unlike cysts, nodules contain no visible pus — they are solid and dense. They form when the follicle wall ruptures deep inside the skin, releasing oil and bacteria that trigger a strong immune response. This type of acne can be painful and lead to scarring.",
    howToIdentify: [
      "Deep, hard lumps under the skin (larger than papules or pustules)",
      "Red or skin-colored; often sore or throbbing",
      "No visible white or yellow center",
      "Lasts for weeks or months",
      "Common on jawline, back, chest, and shoulders",
    ],
    causes: [
      "Overactive oil glands",
      "Hormonal imbalances",
      "Genetic predisposition to inflammatory acne",
      "Untreated moderate acne escalating to severe inflammation",
      "Stress and lack of sleep",
    ],
    treatmentFocus: [
      "Reduce deep inflammation and prevent new nodules",
      "Support long-term skin healing",
      "Minimize risk of scarring",
    ],
    recommendedIngredients: [
      "Oral Isotretinoin – highly effective for deep nodular acne (dermatologist supervision)",
      "Topical Retinoids – regulate skin turnover and unclog pores",
      "Corticosteroid Injections (by professionals) – reduce inflammation in individual nodules",
      "Benzoyl Peroxide – antibacterial effect",
      "Niacinamide and Azelaic Acid – soothe inflammation and repair skin tone",
    ],
    avoidIngredients: [
      "Manual extraction or squeezing (can cause permanent scars)",
      "Overuse of exfoliants — can damage barrier and worsen inflammation",
      "Ignoring professional medical help (this acne type rarely clears on its own)",
    ],
  },

{
    id: "papules",
    name: "Papules",
    medicalName: "Inflammatory Papules",
    severity: "moderate",
    description:
      "Papules are small, red, inflamed bumps that occur when a clogged pore becomes irritated but doesn't yet form pus. They indicate active inflammation in the skin and can be tender to touch. Papules are an early stage of inflammatory acne and can evolve into pustules if infection continues.",
    howToIdentify: [
      "Red, raised bumps without a white center",
      "Often tender or sore",
      "Clustered in oily or high-friction areas",
      "Common on the face, shoulders, and back",
    ],
    causes: [
      "Bacterial overgrowth in clogged pores",
      "Hormonal fluctuations leading to inflammation",
      "Touching or picking at comedones",
      "Harsh skincare that disrupts the barrier",
    ],
    treatmentFocus: [
      "Calm inflammation and prevent progression to pustules",
      "Maintain barrier function",
      "Avoid mechanical irritation",
    ],
    recommendedIngredients: [
      "Benzoyl Peroxide – antibacterial and anti-inflammatory",
      "Niacinamide – reduces redness and irritation",
      "Azelaic Acid – targets bacteria and inflammation",
      "Green Tea or Centella Asiatica Extract – soothing properties",
      "Retinoids – prevent new papules by keeping pores clear",
    ],
    avoidIngredients: [
      "Scrubs or harsh exfoliants",
      "Picking or squeezing (increases risk of scarring)",
      "Occlusive or greasy products",
    ],
  },

{
    id: "pie",
    name: "Post-Inflammatory Erythema (PIE)",
    medicalName: "Post-Inflammatory Erythema",
    severity: "mild",
    description:
      "Post-Inflammatory Erythema (PIE) refers to persistent pink, red, or purplish marks left after acne lesions heal. Unlike PIH (pigmentation), PIE is not related to melanin but rather to dilated or damaged capillaries beneath the skin caused by inflammation. It is more common in fair to medium skin tones and can last for several months.",
    howToIdentify: [
      "Flat red, pink, or purple marks after acne heals",
      "No change in skin texture (unlike scars)",
      "More visible after hot showers or exercise (increased blood flow)",
      "Often fade slowly without treatment",
    ],
    causes: [
      "Inflammation from acne or skin injury",
      "Picking or popping pimples (mechanical trauma)",
      "Overuse of strong actives or exfoliants",
      "Sun exposure that prolongs redness",
    ],
    treatmentFocus: [
      "Strengthen skin barrier and support capillary healing",
      "Reduce redness and inflammation",
      "Protect against UV damage",
    ],
    recommendedIngredients: [
      "Niacinamide – reduces redness and improves barrier strength",
      "Azelaic Acid – anti-inflammatory and redness-reducing",
      "Centella Asiatica (Cica) – promotes healing and soothes irritation",
      "Vitamin C – brightens skin and supports repair",
      "Laser or IPL Treatments (Dermatologist) – for persistent PIE",
      "Sunscreen (SPF 30+) – prevents worsening of redness",
    ],
    avoidIngredients: [
      "Harsh scrubbing or exfoliating irritated skin",
      "Unprotected sun exposure",
      "Picking or scratching acne spots",
    ],
  },

{
    id: "pih",
    name: "Post-Inflammatory Hyperpigmentation (PIH)",
    medicalName: "Post-Inflammatory Hyperpigmentation",
    severity: "mild",
    description:
      "PIH refers to flat, dark brown or grayish spots that appear after acne heals. It's caused by an overproduction of melanin (skin pigment) in response to inflammation or trauma. Unlike scars, PIH does not change the skin's texture, but can persist for weeks or months, especially in medium to dark skin tones.",
    howToIdentify: [
      "Flat dark spots or patches",
      "Often appear after pimples, insect bites, or irritation",
      "No indentation or raised texture",
      "More visible after sun exposure",
    ],
    causes: [
      "Inflammation from acne or skin picking",
      "Sun exposure without SPF",
      "Overuse of irritating actives (causing inflammation)",
      "Hormonal changes or genetics",
    ],
    treatmentFocus: [
      "Brighten pigmentation and prevent new dark spots",
      "Protect from UV damage (sun protection daily)",
      "Calm skin inflammation",
    ],
    recommendedIngredients: [
      "Vitamin C – antioxidant that brightens and fades pigmentation",
      "Niacinamide – reduces melanin transfer and strengthens the barrier",
      "Azelaic Acid – targets both acne and pigmentation",
      "Alpha Arbutin – lightens dark spots safely",
      "AHAs (Glycolic/Lactic Acid) – exfoliate surface pigment",
      "Sunscreen (SPF 30+) – prevents worsening of marks",
    ],
    avoidIngredients: [
      "Harsh scrubs and strong peels",
      "Popping or scratching acne",
      "Unprotected sun exposure",
    ],
  },

{
    id: "purging",
    name: "Purging",
    medicalName: "Skin Purging / Retinization",
    severity: "mild",
    description:
      "Purging is a temporary worsening of breakouts that occurs when starting certain active ingredients (like retinoids or chemical exfoliants). These ingredients speed up cell turnover, bringing existing clogged pores (microcomedones) to the surface faster. Unlike normal breakouts, purging is a sign of skin renewal, not irritation.",
    howToIdentify: [
      "Increased breakouts in the same areas where you usually get acne",
      "Small whiteheads or pimples appearing within 1–3 weeks of new product use",
      "Improves gradually over 4–8 weeks",
      "No severe redness, itching, or burning",
    ],
    causes: [
      "Starting actives: retinoids, AHAs, BHAs, vitamin C, or exfoliating toners",
      "Using too high concentration or too often at first",
      "Skin adapting to faster cell turnover",
    ],
    treatmentFocus: [
      "Continue using actives consistently (unless signs of irritation occur)",
      "Support skin barrier and hydration during adjustment period",
      "Differentiate purging from allergic reaction",
    ],
    recommendedIngredients: [
      "Retinoids – the main purge trigger, but beneficial long-term",
      "Niacinamide – strengthens skin and reduces inflammation",
      "Hyaluronic Acid – maintains hydration",
      "Panthenol / Cica – soothe irritation and reduce dryness",
    ],
    avoidIngredients: [
      "Stopping treatment too early (purge will pass)",
      "Introducing multiple new actives at once",
      "Over-exfoliating or combining acids and retinoids",
    ],
  },

{
    id: "pustules",
    name: "Pustules",
    medicalName: "Inflammatory Pustules",
    severity: "moderate",
    description:
      "Pustules are inflamed pimples filled with white or yellow pus, formed when bacteria multiply inside a clogged pore. They are a hallmark of inflammatory acne and may appear alongside papules and nodules. The surrounding area is usually red and swollen.",
    howToIdentify: [
      "Red bump with a white or yellow center",
      "Tender to touch",
      "Often grouped in oily areas (forehead, cheeks, chin)",
      "Can rupture and leave post-acne marks",
    ],
    causes: [
      "Bacterial infection (Cutibacterium acnes)",
      "Hormonal changes or excess oil",
      "Picking or popping whiteheads",
      "High humidity or sweat accumulation",
    ],
    treatmentFocus: [
      "Reduce bacterial activity and inflammation",
      "Prevent new breakouts and avoid scarring",
      "Soothe redness and irritation",
    ],
    recommendedIngredients: [
      "Benzoyl Peroxide – kills acne-causing bacteria",
      "Salicylic Acid (BHA) – clears clogged pores",
      "Sulfur – dries out pustules and reduces swelling",
      "Niacinamide – calms redness and strengthens the barrier",
      "Tea Tree Oil – natural antibacterial (use diluted)",
    ],
    avoidIngredients: [
      "Picking or popping pustules",
      "Alcohol-heavy spot treatments (drying, irritant)",
      "Layering too many actives",
    ],
  },

{
    id: "sebaceous-filaments",
    name: "Sebaceous Filaments",
    medicalName: "Sebaceous Filaments",
    severity: "mild",
    description:
      "Sebaceous filaments are tiny, tube-like structures that line the walls of your pores (hair follicles) and help guide sebum (oil) from the sebaceous glands to the skin surface. They are a completely normal and natural part of healthy skin, not a form of acne. When visible, they may appear as small gray or flesh-colored dots, especially on the nose or forehead. Unlike blackheads, sebaceous filaments do not have a hard plug and are not meant to be removed.",
    howToIdentify: [
      "Small, uniform gray or beige dots on the nose, chin, or cheeks",
      "Smooth texture, not raised or inflamed",
      "Often mistaken for blackheads",
      "Return within days after extraction (since they're part of pore structure)",
    ],
    causes: [
      "Overproduction of sebum",
      "Oily or combination skin types",
      "Enlarged pores",
      "Infrequent exfoliation",
      "Heavy or occlusive skincare products",
    ],
    treatmentFocus: [
      "Minimize visibility by controlling oil and keeping pores clear",
      "Support healthy sebum flow — not eliminate it completely",
      "Avoid over-extraction or harsh treatments",
    ],
    recommendedIngredients: [
      "Salicylic Acid (BHA) – keeps pores clear and dissolves excess oil",
      "Niacinamide – balances sebum and refines pore appearance",
      "Clay Masks (Kaolin, Bentonite) – absorb surface oil",
      "Retinoids – regulate cell turnover and prevent buildup",
    ],
    avoidIngredients: [
      "Manual extraction or pore strips (temporary results, may cause irritation)",
      "Harsh scrubbing or alcohol-based toners",
      "Over-drying the skin (can trigger more oil production)",
    ],
  },

{
    id: "barrier-damage",
    name: "Skin Barrier Damage",
    medicalName: "Barrier Dysfunction",
    severity: "moderate",
    description:
      "The skin barrier (stratum corneum) is the outermost protective layer of the skin that prevents water loss and shields against bacteria, pollution, and irritation. When it becomes damaged, the skin cannot retain moisture properly, becomes overly sensitive, and is more prone to acne, redness, and flaking. Barrier damage is often the root cause of chronic irritation or product burnout.",
    howToIdentify: [
      "Redness, dryness, or burning sensation",
      "Tight, flaky, or rough texture",
      "Sudden sensitivity to products that used to work fine",
      "Breakouts or small bumps due to compromised protection",
      "Dull and dehydrated skin appearance",
    ],
    causes: [
      "Over-exfoliation (using too many actives like acids or retinoids)",
      "Harsh cleansers or scrubbing",
      "Lack of hydration",
      "Environmental stress (cold, heat, pollution)",
      "Overuse of acne treatments without recovery phases",
    ],
    treatmentFocus: [
      "Rebuild and protect the skin's natural lipid layer",
      "Hydrate and soothe inflammation",
      "Gradually reintroduce actives only after recovery",
    ],
    recommendedIngredients: [
      "Ceramides, Cholesterol, Fatty Acids – rebuild lipid barrier",
      "Hyaluronic Acid – deeply hydrates",
      "Panthenol (B5) – soothes and restores moisture balance",
      "Centella Asiatica (Cica) – calms inflammation and promotes healing",
      "Squalane – mimics natural skin oils without clogging pores",
    ],
    avoidIngredients: [
      "Alcohol-based or foaming cleansers",
      "Frequent chemical exfoliation",
      "Strong actives (retinoids, acids) until the barrier heals",
      "Hot water and excessive face washing",
    ],
  },

{
    id: "whiteheads",
    name: "Whiteheads",
    medicalName: "Closed Comedones",
    severity: "mild",
    description:
      "Whiteheads form when a pore becomes clogged and sealed off at the surface, trapping oil, bacteria, and dead skin inside. Because the pore remains closed, oxygen cannot enter — the trapped material stays white or yellow instead of darkening like blackheads. They are non-inflammatory but can progress to pimples if irritated.",
    howToIdentify: [
      "Small white or flesh-colored bumps under the skin",
      "Often have a smooth dome shape",
      "Not red or painful (unless inflamed)",
      "Common on cheeks, chin, and forehead",
      "Give the skin a slightly uneven texture",
    ],
    causes: [
      "Excess sebum and dead skin buildup",
      "Comedogenic or heavy cosmetic products",
      "Poor cleansing or overuse of occlusive moisturizers",
      "Hormonal imbalance",
      "Sweat and bacteria trapped under tight clothing or masks",
    ],
    treatmentFocus: [
      "Promote gentle exfoliation to open clogged pores",
      "Support cell turnover to prevent new comedones",
      "Maintain a lightweight skincare routine",
    ],
    recommendedIngredients: [
      "Retinoids (Adapalene, Retinol) – prevent clogging by speeding up cell turnover",
      "Salicylic Acid (BHA) – penetrates oil and clears pores",
      "Niacinamide – reduces oil and strengthens the barrier",
      "Azelaic Acid – balances bacteria and fades marks",
      "Sulfur or Zinc – antibacterial and oil-controlling",
    ],
    avoidIngredients: [
      "Heavy makeup or occlusive creams",
      "Over-exfoliation (can worsen barrier function)",
      "Picking or squeezing (can lead to scarring or infection)",
    ],
  },

{
    id: "wrinkles",
    name: "Wrinkles & Fine Lines",
    medicalName: "Rhytides",
    severity: "moderate",
    description:
      "Wrinkles and fine lines are creases, folds, or ridges in the skin that develop as a natural part of aging. They occur due to the breakdown of collagen and elastin fibers, repeated facial expressions, and environmental damage (especially sun exposure). Fine lines appear first and are shallow, while deeper wrinkles form over time with continued loss of skin elasticity and volume.",
    howToIdentify: [
      "Fine lines – shallow, thin creases often around eyes (crow's feet) and mouth",
      "Deep wrinkles – pronounced folds on forehead, between brows, and around mouth (smile lines)",
      "More visible when making facial expressions or in dry skin",
      "Can appear as horizontal lines on forehead or vertical lines between eyebrows",
      "Skin may feel less firm or elastic to the touch",
    ],
    causes: [
      "Natural aging process (reduced collagen and elastin production)",
      "Sun exposure and UV damage (photoaging)",
      "Repeated facial expressions (smiling, frowning, squinting)",
      "Smoking and environmental pollutants",
      "Dehydration and poor skincare habits",
      "Genetics and skin type",
    ],
    treatmentFocus: [
      "Boost collagen and elastin production",
      "Improve skin hydration and plumpness",
      "Protect against further UV damage",
      "Smooth skin texture and minimize depth of lines",
    ],
    recommendedIngredients: [
      "Retinoids (Retinol, Tretinoin) – stimulate collagen production and accelerate cell turnover",
      "Vitamin C – antioxidant that boosts collagen and brightens skin",
      "Peptides – signal skin to produce more collagen and elastin",
      "Hyaluronic Acid – deeply hydrates and plumps skin",
      "Niacinamide – improves skin barrier and elasticity",
      "Alpha Hydroxy Acids (AHAs) – exfoliate and smooth fine lines",
      "Ceramides – strengthen skin barrier and retain moisture",
      "Sunscreen (SPF 30+) – prevent further UV damage and photoaging",
    ],
    avoidIngredients: [
      "Harsh physical scrubs (can damage skin barrier)",
      "Alcohol-based products (cause dehydration)",
      "Skipping sunscreen (accelerates aging)",
      "Smoking and excessive alcohol consumption",
    ],
  },
]


export function getAcneTypeById(id: string): AcneType | undefined {
  return acneTypes.find((type) => type.id === id)
}

export function getAcneTypesBySeverity(severity: "mild" | "moderate" | "severe"): AcneType[] {
  return acneTypes.filter((type) => type.severity === severity)
}
