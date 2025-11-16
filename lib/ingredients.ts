export type SkinType = "dry" | "oily" | "combination" | "sensitive" | "normal"

export interface ActiveIngredient {
  id: string
  name: string
  category: string
  commonNames: string[]
  benefits: string[]
  howItWorks: string
  whoShouldUse: string[]
  suitableForSkinTypes: SkinType[]
  typicalConcentration: string
  contraindications: string[]
  bestCombinations: string[]
  avoidCombining: string[]
  timeOfDay: "Morning" | "Evening" | "Both"
  pHSensitive: boolean
}

export const activeIngredients: ActiveIngredient[] = [
  {
    id: "adapalene",
    name: "Adapalene",
    category: "Retinoid",
    commonNames: ["Differin"],
    benefits: [
      "Treats acne by unclogging pores",
      "Reduces inflammation",
      "Prevents new breakouts",
      "Improves skin texture"
    ],
    howItWorks: "A third-generation retinoid that normalizes skin cell turnover, preventing dead cells from clogging pores. It also has anti-inflammatory properties that reduce redness and swelling.",
    whoShouldUse: [
      "People with mild to moderate acne",
      "Those with blackheads and whiteheads",
      "Individuals seeking anti-aging benefits"
    ],
    suitableForSkinTypes: ["oily", "combination", "normal"],
    typicalConcentration: "0.1% - 0.3%",
    contraindications: [
      "Pregnancy and breastfeeding",
      "Extremely sensitive skin",
      "Active eczema or rosacea"
    ],
    bestCombinations: ["Niacinamide", "Hyaluronic Acid", "Ceramides"],
    avoidCombining: ["Vitamin C (same routine)", "AHAs/BHAs (same routine)", "Benzoyl Peroxide (same routine)"],
    timeOfDay: "Evening",
    pHSensitive: false
  },
  {
    id: "azelaic-acid",
    name: "Azelaic Acid",
    category: "Multi-functional Acid",
    commonNames: ["AzA"],
    benefits: [
      "Reduces acne and prevents breakouts",
      "Fades hyperpigmentation and dark spots",
      "Reduces rosacea redness",
      "Has antibacterial properties",
      "Gentle exfoliation"
    ],
    howItWorks: "A dicarboxylic acid that kills acne-causing bacteria, reduces inflammation, unclogs pores, and inhibits melanin production to fade dark spots and even skin tone.",
    whoShouldUse: [
      "People with acne-prone skin",
      "Those with post-inflammatory hyperpigmentation",
      "Individuals with rosacea",
      "Anyone seeking to even skin tone"
    ],
    typicalConcentration: "10% - 20%",
    contraindications: [
      "Known allergy to azelaic acid",
      "Open wounds or broken skin"
    ],
    bestCombinations: ["Niacinamide", "Hyaluronic Acid", "Retinoids"],
    avoidCombining: ["High concentrations of other acids (use caution)"],
    suitableForSkinTypes: ["oily","combination","normal","sensitive"],
    timeOfDay: "Both",
    pHSensitive: false
  },
  {
    id: "benzoyl-peroxide",
    name: "Benzoyl Peroxide",
    category: "Antibacterial",
    commonNames: ["BP"],
    benefits: [
      "Kills acne-causing bacteria",
      "Reduces inflammation",
      "Unclogs pores",
      "Prevents antibiotic resistance"
    ],
    howItWorks: "An antimicrobial agent that releases oxygen into pores, killing P. acnes bacteria. It also has mild keratolytic properties that help shed dead skin cells.",
    whoShouldUse: [
      "People with inflammatory acne (pustules, papules)",
      "Those with body acne",
      "Individuals prone to bacterial acne"
    ],
    typicalConcentration: "2.5% - 10%",
    contraindications: [
      "Very sensitive or dry skin",
      "Allergies to benzoyl peroxide",
      "Use with caution on darker skin tones (can cause bleaching)"
    ],
    bestCombinations: ["Niacinamide", "Hyaluronic Acid"],
    avoidCombining: ["Retinoids (same routine)", "Vitamin C"],
    suitableForSkinTypes: ["oily","combination","normal"],
    timeOfDay: "Both",
    pHSensitive: false
  },
  {
    id: "ceramides",
    name: "Ceramides",
    category: "Lipid/Moisturizer",
    commonNames: ["Ceramide NP", "Ceramide AP", "Ceramide EOP"],
    benefits: [
      "Strengthens skin barrier",
      "Locks in moisture",
      "Reduces water loss",
      "Protects against irritants",
      "Soothes sensitive skin"
    ],
    howItWorks: "Lipid molecules that are naturally found in the skin barrier. They fill in the gaps between skin cells, creating a protective layer that prevents moisture loss and keeps irritants out.",
    whoShouldUse: [
      "People with dry or dehydrated skin",
      "Those with compromised skin barriers",
      "Anyone using strong actives (retinoids, acids)",
      "Individuals with eczema or sensitive skin"
    ],
    typicalConcentration: "No standard (varies by formulation)",
    contraindications: ["None known"],
    bestCombinations: ["Niacinamide", "Hyaluronic Acid", "Retinoids", "All actives"],
    avoidCombining: [],
    suitableForSkinTypes: ["dry","sensitive","normal","combination","oily"],
    timeOfDay: "Both",
    pHSensitive: false
  },
  {
    id: "glycolic-acid",
    name: "Glycolic Acid",
    category: "AHA (Alpha Hydroxy Acid)",
    commonNames: ["GA"],
    benefits: [
      "Exfoliates dead skin cells",
      "Improves skin texture and tone",
      "Reduces fine lines and wrinkles",
      "Fades hyperpigmentation",
      "Increases cell turnover"
    ],
    howItWorks: "The smallest AHA molecule that penetrates deeply to dissolve bonds between dead skin cells, promoting exfoliation and revealing fresher skin underneath.",
    whoShouldUse: [
      "People with sun damage or aging skin",
      "Those with dull, uneven skin tone",
      "Individuals with hyperpigmentation",
      "Normal to dry skin types"
    ],
    typicalConcentration: "5% - 10% (at-home), up to 70% (professional)",
    contraindications: [
      "Very sensitive skin",
      "Active rosacea or eczema",
      "Recent cosmetic procedures"
    ],
    bestCombinations: ["Hyaluronic Acid", "Niacinamide (different times)"],
    avoidCombining: ["Retinoids (same routine)", "Vitamin C (same routine)", "Other exfoliants"],
    suitableForSkinTypes: ["normal","oily","combination"],
    timeOfDay: "Evening",
    pHSensitive: true
  },
  {
    id: "hyaluronic-acid",
    name: "Hyaluronic Acid",
    category: "Humectant",
    commonNames: ["HA", "Sodium Hyaluronate"],
    benefits: [
      "Deeply hydrates skin",
      "Holds 1000x its weight in water",
      "Plumps skin and reduces fine lines",
      "Improves skin texture",
      "Enhances absorption of other products"
    ],
    howItWorks: "A humectant that draws moisture from the environment and deeper skin layers to the surface, keeping skin hydrated and plump.",
    whoShouldUse: [
      "All skin types",
      "People with dehydrated skin",
      "Those using drying actives",
      "Anyone seeking anti-aging benefits"
    ],
    typicalConcentration: "0.1% - 2%",
    contraindications: ["None known (use on damp skin for best results)"],
    bestCombinations: ["All ingredients - universal hydrator"],
    avoidCombining: [],
    suitableForSkinTypes: ["dry","oily","combination","sensitive","normal"],
    timeOfDay: "Both",
    pHSensitive: false
  },
  {
    id: "lactic-acid",
    name: "Lactic Acid",
    category: "AHA (Alpha Hydroxy Acid)",
    commonNames: ["LA"],
    benefits: [
      "Gentle exfoliation",
      "Improves skin texture",
      "Brightens skin tone",
      "Hydrates while exfoliating",
      "Reduces hyperpigmentation"
    ],
    howItWorks: "A larger AHA molecule derived from milk that exfoliates surface skin cells while also having humectant properties. It's gentler than glycolic acid.",
    whoShouldUse: [
      "Sensitive skin types",
      "Dry skin needing exfoliation",
      "Beginners to chemical exfoliation",
      "Those with mild hyperpigmentation"
    ],
    typicalConcentration: "5% - 10%",
    contraindications: [
      "Active skin infections",
      "Severe rosacea",
      "Dairy allergies (rarely an issue in skincare)"
    ],
    bestCombinations: ["Hyaluronic Acid", "Niacinamide", "Ceramides"],
    avoidCombining: ["Retinoids (same routine)", "Other exfoliants", "Vitamin C (same routine)"],
    suitableForSkinTypes: ["dry","sensitive","normal","combination"],
    timeOfDay: "Evening",
    pHSensitive: true
  },
  {
    id: "niacinamide",
    name: "Niacinamide",
    category: "Vitamin (B3)",
    commonNames: ["Nicotinamide", "Vitamin B3"],
    benefits: [
      "Regulates oil production",
      "Minimizes pore appearance",
      "Fades hyperpigmentation",
      "Strengthens skin barrier",
      "Reduces inflammation",
      "Improves skin texture"
    ],
    howItWorks: "A form of vitamin B3 that regulates sebum production, inhibits melanin transfer, increases ceramide production, and has anti-inflammatory properties.",
    whoShouldUse: [
      "All skin types",
      "People with oily or acne-prone skin",
      "Those with hyperpigmentation",
      "Anyone seeking to strengthen skin barrier",
      "Sensitive skin types"
    ],
    typicalConcentration: "2% - 10%",
    contraindications: ["None known (very well-tolerated)"],
    bestCombinations: ["Hyaluronic Acid", "Retinoids", "AHAs/BHAs", "Vitamin C", "Most actives"],
    avoidCombining: [],
    suitableForSkinTypes: ["oily","combination","dry","sensitive","normal"],
    timeOfDay: "Both",
    pHSensitive: false
  },
  {
    id: "retinol",
    name: "Retinol",
    category: "Retinoid (Vitamin A)",
    commonNames: ["Vitamin A", "Retinyl Palmitate", "Retinaldehyde"],
    benefits: [
      "Reduces fine lines and wrinkles",
      "Increases collagen production",
      "Improves skin texture",
      "Treats acne",
      "Fades hyperpigmentation",
      "Increases cell turnover"
    ],
    howItWorks: "A vitamin A derivative that converts to retinoic acid in the skin, stimulating collagen production and accelerating cell turnover for younger-looking skin.",
    whoShouldUse: [
      "People with aging skin",
      "Those with acne-prone skin",
      "Individuals with sun damage",
      "Anyone seeking anti-aging benefits (25+)"
    ],
    typicalConcentration: "0.25% - 1% (beginners start low)",
    contraindications: [
      "Pregnancy and breastfeeding",
      "Very sensitive skin (start slow)",
      "Active eczema or rosacea"
    ],
    bestCombinations: ["Hyaluronic Acid", "Niacinamide", "Ceramides", "Peptides"],
    avoidCombining: ["AHAs/BHAs (same routine)", "Vitamin C (same routine)", "Benzoyl Peroxide"],
    suitableForSkinTypes: ["normal","oily","combination","dry"],
    timeOfDay: "Evening",
    pHSensitive: false
  },
  {
    id: "salicylic-acid",
    name: "Salicylic Acid",
    category: "BHA (Beta Hydroxy Acid)",
    commonNames: ["SA", "BHA"],
    benefits: [
      "Unclogs pores deeply",
      "Treats blackheads and whiteheads",
      "Reduces inflammation",
      "Controls oil production",
      "Exfoliates inside pores",
      "Prevents breakouts"
    ],
    howItWorks: "An oil-soluble acid that penetrates deep into pores to dissolve sebum and dead skin cells. It also has anti-inflammatory properties.",
    whoShouldUse: [
      "Oily and acne-prone skin",
      "People with blackheads and whiteheads",
      "Those with enlarged pores",
      "Individuals prone to body acne"
    ],
    typicalConcentration: "0.5% - 2%",
    contraindications: [
      "Aspirin allergies",
      "Very dry or sensitive skin",
      "Pregnancy (high concentrations)"
    ],
    bestCombinations: ["Niacinamide", "Hyaluronic Acid", "Ceramides"],
    avoidCombining: ["Retinoids (same routine)", "AHAs (same routine)", "Vitamin C (same routine)"],
    suitableForSkinTypes: ["oily","combination","normal"],
    timeOfDay: "Both",
    pHSensitive: true
  },
  {
    id: "tranexamic-acid",
    name: "Tranexamic Acid",
    category: "Amino Acid Derivative",
    commonNames: ["TXA"],
    benefits: [
      "Fades dark spots and melasma",
      "Reduces post-inflammatory hyperpigmentation",
      "Brightens skin tone",
      "Reduces redness",
      "Prevents new pigmentation"
    ],
    howItWorks: "Inhibits melanin production by blocking plasmin, which reduces inflammation and prevents UV-induced pigmentation.",
    whoShouldUse: [
      "People with melasma",
      "Those with stubborn hyperpigmentation",
      "Individuals with post-inflammatory hyperpigmentation",
      "Anyone seeking to brighten skin"
    ],
    typicalConcentration: "2% - 5%",
    contraindications: [
      "History of blood clots (consult doctor)",
      "Pregnancy (consult doctor)"
    ],
    bestCombinations: ["Niacinamide", "Vitamin C", "Arbutin", "Kojic Acid"],
    avoidCombining: [],
    suitableForSkinTypes: ["normal","dry","combination","oily","sensitive"],
    timeOfDay: "Both",
    pHSensitive: false
  },
  {
    id: "vitamin-c",
    name: "Vitamin C",
    category: "Antioxidant (Vitamin)",
    commonNames: ["L-Ascorbic Acid", "Ascorbyl Glucoside", "Tetrahexyldecyl Ascorbate"],
    benefits: [
      "Brightens skin tone",
      "Fades dark spots and hyperpigmentation",
      "Boosts collagen production",
      "Protects against free radical damage",
      "Reduces signs of aging",
      "Evens skin tone"
    ],
    howItWorks: "A potent antioxidant that inhibits melanin production, neutralizes free radicals, and stimulates collagen synthesis for brighter, firmer skin.",
    whoShouldUse: [
      "People with dull skin",
      "Those with hyperpigmentation or sun damage",
      "Individuals seeking anti-aging benefits",
      "Anyone wanting brighter, more even skin"
    ],
    typicalConcentration: "10% - 20% (L-Ascorbic Acid)",
    contraindications: [
      "Very sensitive skin (start with derivatives)",
      "Active breakouts (can sting)"
    ],
    bestCombinations: ["Vitamin E", "Ferulic Acid", "Hyaluronic Acid", "Niacinamide"],
    avoidCombining: ["Retinoids (same routine)", "AHAs/BHAs (same routine)", "Benzoyl Peroxide"],
    suitableForSkinTypes: ["normal","dry","combination","oily"],
    timeOfDay: "Morning",
    pHSensitive: true
  },
  {
    id: "alpha-arbutin",
    name: "Alpha Arbutin",
    category: "Brightening Agent",
    commonNames: ["Arbutin"],
    benefits: [
      "Fades dark spots and hyperpigmentation",
      "Brightens skin tone",
      "Evens skin tone",
      "Gentle on sensitive skin",
      "Prevents new pigmentation"
    ],
    howItWorks: "A stable molecule derived from bearberry that inhibits tyrosinase, the enzyme responsible for melanin production, resulting in reduced dark spots and more even skin tone.",
    whoShouldUse: [
      "People with hyperpigmentation",
      "Those with melasma",
      "Sensitive skin types needing brightening",
      "Anyone seeking to even skin tone"
    ],
    typicalConcentration: "0.5% - 2%",
    contraindications: ["None known (very gentle)"],
    bestCombinations: ["Vitamin C", "Niacinamide", "Tranexamic Acid", "Hyaluronic Acid"],
    avoidCombining: [],
    suitableForSkinTypes: ["normal","dry","sensitive","combination","oily"],
    timeOfDay: "Both",
    pHSensitive: false
  },
  {
    id: "peptides",
    name: "Peptides",
    category: "Protein Fragment",
    commonNames: ["Matrixyl", "Argireline", "Copper Peptides"],
    benefits: [
      "Stimulates collagen production",
      "Reduces fine lines and wrinkles",
      "Improves skin firmness",
      "Enhances skin repair",
      "Supports skin barrier"
    ],
    howItWorks: "Short chains of amino acids that signal skin cells to perform specific functions like producing collagen, elastin, and other proteins for firmer, younger-looking skin.",
    whoShouldUse: [
      "People with aging skin",
      "Those seeking anti-aging benefits",
      "Individuals with fine lines",
      "Anyone wanting to improve skin firmness"
    ],
    typicalConcentration: "Varies by peptide type",
    contraindications: ["None known"],
    bestCombinations: ["Hyaluronic Acid", "Niacinamide", "Retinoids", "Antioxidants"],
    avoidCombining: ["High pH products (may reduce efficacy)"],
    suitableForSkinTypes: ["dry","normal","combination","sensitive"],
    timeOfDay: "Both",
    pHSensitive: true
  },
  {
    id: "kojic-acid",
    name: "Kojic Acid",
    category: "Brightening Agent",
    commonNames: ["KA"],
    benefits: [
      "Fades dark spots and melasma",
      "Brightens skin tone",
      "Inhibits melanin production",
      "Treats sun damage",
      "Evens skin tone"
    ],
    howItWorks: "A natural compound derived from fungi that inhibits tyrosinase enzyme, preventing melanin formation and lightening existing pigmentation.",
    whoShouldUse: [
      "People with hyperpigmentation",
      "Those with melasma",
      "Individuals with sun spots",
      "Anyone seeking to brighten skin"
    ],
    typicalConcentration: "1% - 4%",
    contraindications: [
      "Very sensitive skin (can be irritating)",
      "Allergies to kojic acid"
    ],
    bestCombinations: ["Niacinamide", "Vitamin C", "Arbutin", "Tranexamic Acid"],
    avoidCombining: ["High concentrations of other actives (use caution)"],
    suitableForSkinTypes: ["normal","oily","combination"],
    timeOfDay: "Evening",
    pHSensitive: false
  },

  {
    id: "centella-asiatica",
    name: "Centella Asiatica",
    category: "Soothing/Healing",
    commonNames: ["Cica","Tiger Grass","Gotu Kola"],
    benefits: [
          "Soothes irritated and sensitive skin",
          "Promotes wound healing and skin repair",
          "Strengthens skin barrier",
          "Reduces redness and inflammation",
          "Improves hydration"
    ],
    howItWorks: "Contains active compounds (asiaticoside, madecassoside, asiatic acid) that promote collagen synthesis, reduce inflammation, and support skin barrier function. Known for its calming and healing properties.",
    whoShouldUse: [
          "People with sensitive or irritated skin",
          "Those with rosacea or eczema",
          "Anyone recovering from skin procedures",
          "Individuals with compromised skin barriers"
    ],
    suitableForSkinTypes: ["sensitive","dry","combination","normal","oily"],
    typicalConcentration: "Variable (often in proprietary blends)",
    contraindications: [
          "None known (very gentle)"
    ],
    bestCombinations: [
          "Niacinamide",
          "Hyaluronic Acid",
          "Ceramides",
          "Peptides"
    ],
    avoidCombining: [],
    timeOfDay: "Both",
    pHSensitive: false
  },

  {
    id: "caffeine",
    name: "Caffeine",
    category: "Antioxidant",
    commonNames: [],
    benefits: [
          "Reduces puffiness and dark circles",
          "Improves circulation",
          "Provides antioxidant protection",
          "Tightens and firms skin temporarily",
          "Anti-inflammatory properties"
    ],
    howItWorks: "A stimulant that constricts blood vessels, reducing puffiness and improving microcirculation. Also acts as an antioxidant to protect against free radical damage.",
    whoShouldUse: [
          "People with under-eye puffiness",
          "Those with dark circles",
          "Anyone seeking antioxidant protection",
          "Individuals wanting temporary skin tightening"
    ],
    suitableForSkinTypes: ["normal","oily","combination","sensitive","dry"],
    typicalConcentration: "0.5% - 5%",
    contraindications: [
          "Caffeine sensitivity (rare in topical use)"
    ],
    bestCombinations: [
          "Vitamin C",
          "Niacinamide",
          "Hyaluronic Acid"
    ],
    avoidCombining: [],
    timeOfDay: "Both",
    pHSensitive: false
  },

  {
    id: "green-tea-extract",
    name: "Green Tea Extract",
    category: "Antioxidant",
    commonNames: ["EGCG","Camellia Sinensis"],
    benefits: [
          "Powerful antioxidant protection",
          "Reduces inflammation and redness",
          "Helps prevent sun damage",
          "Controls oil production",
          "Anti-aging properties"
    ],
    howItWorks: "Rich in polyphenols (especially EGCG) that neutralize free radicals, reduce inflammation, and protect against UV damage. Also has antimicrobial and sebum-regulating properties.",
    whoShouldUse: [
          "People with sun-damaged skin",
          "Those with oily or acne-prone skin",
          "Individuals seeking anti-aging benefits",
          "Anyone wanting antioxidant protection"
    ],
    suitableForSkinTypes: ["oily","combination","normal","sensitive"],
    typicalConcentration: "Variable (depends on extract strength)",
    contraindications: [
          "None known"
    ],
    bestCombinations: [
          "Vitamin C",
          "Niacinamide",
          "Hyaluronic Acid",
          "Sunscreen"
    ],
    avoidCombining: [],
    timeOfDay: "Both",
    pHSensitive: false
  },

  {
    id: "panthenol",
    name: "Panthenol",
    category: "Humectant/Moisturizer",
    commonNames: ["Pro-Vitamin B5","D-Panthenol"],
    benefits: [
          "Deeply hydrates and moisturizes",
          "Soothes irritated skin",
          "Improves skin barrier function",
          "Promotes wound healing",
          "Reduces water loss"
    ],
    howItWorks: "Converts to vitamin B5 (pantothenic acid) in the skin, where it acts as a humectant to attract and retain moisture. Also has anti-inflammatory and skin-healing properties.",
    whoShouldUse: [
          "People with dry or dehydrated skin",
          "Those with sensitive or irritated skin",
          "Individuals with damaged skin barriers",
          "Anyone seeking extra hydration"
    ],
    suitableForSkinTypes: ["dry","sensitive","normal","combination"],
    typicalConcentration: "1% - 5%",
    contraindications: [
          "None known"
    ],
    bestCombinations: [
          "Niacinamide",
          "Ceramides",
          "Hyaluronic Acid",
          "Centella Asiatica"
    ],
    avoidCombining: [],
    timeOfDay: "Both",
    pHSensitive: false
  },

  {
    id: "squalane",
    name: "Squalane",
    category: "Emollient/Moisturizer",
    commonNames: [],
    benefits: [
          "Locks in moisture without clogging pores",
          "Mimics skin's natural oils",
          "Lightweight and non-greasy",
          "Antioxidant properties",
          "Suitable for all skin types"
    ],
    howItWorks: "A hydrogenated form of squalene (naturally found in skin) that acts as an emollient to soften and smooth skin while preventing moisture loss. Non-comedogenic and highly stable.",
    whoShouldUse: [
          "All skin types",
          "People with dry or dehydrated skin",
          "Those seeking lightweight moisture",
          "Individuals with acne-prone skin (non-comedogenic)"
    ],
    suitableForSkinTypes: ["dry","oily","combination","sensitive","normal"],
    typicalConcentration: "Variable (pure or in formulations)",
    contraindications: [
          "None known"
    ],
    bestCombinations: [
          "Retinoids",
          "Niacinamide",
          "Hyaluronic Acid",
          "Ceramides"
    ],
    avoidCombining: [],
    timeOfDay: "Both",
    pHSensitive: false
  },

  {
    id: "snail-mucin",
    name: "Snail Mucin",
    category: "Hydrating/Healing",
    commonNames: ["Snail Secretion Filtrate"],
    benefits: [
          "Hydrates and plumps skin",
          "Promotes healing and skin repair",
          "Reduces appearance of scars and hyperpigmentation",
          "Improves skin texture",
          "Anti-aging properties"
    ],
    howItWorks: "Contains glycoproteins, hyaluronic acid, glycolic acid, and zinc that work together to hydrate, heal, and regenerate skin. Promotes collagen production and skin repair.",
    whoShouldUse: [
          "People with dry or dehydrated skin",
          "Those with acne scars or hyperpigmentation",
          "Individuals seeking anti-aging benefits",
          "Anyone wanting to improve skin texture"
    ],
    suitableForSkinTypes: ["dry","normal","combination","oily"],
    typicalConcentration: "Variable (often 90%+ in essences)",
    contraindications: [
          "Shellfish allergies (use caution)",
          "Vegan preference"
    ],
    bestCombinations: [
          "Niacinamide",
          "Hyaluronic Acid",
          "Centella Asiatica"
    ],
    avoidCombining: [],
    timeOfDay: "Both",
    pHSensitive: false
  },

  {
    id: "tea-tree-oil",
    name: "Tea Tree Oil",
    category: "Antibacterial",
    commonNames: ["Melaleuca Oil"],
    benefits: [
          "Kills acne-causing bacteria",
          "Reduces inflammation",
          "Controls oil production",
          "Treats fungal infections",
          "Natural antiseptic"
    ],
    howItWorks: "Contains terpinen-4-ol and other compounds with antimicrobial and anti-inflammatory properties. Kills bacteria, fungi, and helps reduce acne lesions.",
    whoShouldUse: [
          "People with acne-prone skin",
          "Those with oily skin",
          "Individuals with fungal acne",
          "Anyone preferring natural ingredients"
    ],
    suitableForSkinTypes: ["oily","combination","normal"],
    typicalConcentration: "5% - 10% (diluted)",
    contraindications: [
          "Very sensitive skin (can be irritating)",
          "Never use undiluted",
          "Pregnancy (consult doctor)"
    ],
    bestCombinations: [
          "Niacinamide",
          "Hyaluronic Acid",
          "Aloe Vera"
    ],
    avoidCombining: [
          "Other strong actives (can cause irritation)"
    ],
    timeOfDay: "Both",
    pHSensitive: false
  },

  {
    id: "zinc-oxide",
    name: "Zinc Oxide",
    category: "Mineral Sunscreen/Soothing",
    commonNames: [],
    benefits: [
          "Broad-spectrum UV protection",
          "Soothes irritated skin",
          "Reduces inflammation",
          "Controls oil and sebum",
          "Antimicrobial properties"
    ],
    howItWorks: "A mineral that sits on top of skin to physically block UVA and UVB rays. Also has anti-inflammatory and oil-controlling properties, making it ideal for sensitive and acne-prone skin.",
    whoShouldUse: [
          "Everyone (daily sun protection)",
          "People with sensitive skin",
          "Those with acne-prone or oily skin",
          "Individuals with rosacea"
    ],
    suitableForSkinTypes: ["sensitive","oily","combination","normal","dry"],
    typicalConcentration: "5% - 25% (in sunscreens)",
    contraindications: [
          "None known"
    ],
    bestCombinations: [
          "Niacinamide",
          "Centella Asiatica",
          "Ceramides"
    ],
    avoidCombining: [],
    timeOfDay: "Morning",
    pHSensitive: false
  }
]

// Sort alphabetically by name
activeIngredients.sort((a, b) => a.name.localeCompare(b.name))

// Helper functions
export function getIngredientById(id: string): ActiveIngredient | undefined {
  return activeIngredients.find((ingredient) => ingredient.id === id)
}

export function getIngredientsByCategory(category: string): ActiveIngredient[] {
  return activeIngredients.filter((ingredient) => ingredient.category === category)
}

export function getIngredientsByTimeOfDay(timeOfDay: "Morning" | "Evening" | "Both"): ActiveIngredient[] {
  return activeIngredients.filter((ingredient) => ingredient.timeOfDay === timeOfDay || ingredient.timeOfDay === "Both")
}

export function getIngredientsBySkinType(skinType: SkinType): ActiveIngredient[] {
  return activeIngredients.filter((ingredient) => ingredient.suitableForSkinTypes.includes(skinType))
}
