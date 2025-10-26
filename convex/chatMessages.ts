import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const sendMessage = mutation({
  args: {
    userId: v.id("users"),
    message: v.string(),
    skinProfile: v.optional(
      v.object({
        skinType: v.string(),
        concerns: v.array(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now()

    // Save user message
    await ctx.db.insert("chatMessages", {
      userId: args.userId,
      role: "user",
      content: args.message,
      createdAt: now,
    })

    // Generate AI response
    const aiResponse = generateAIResponse(args.message, args.skinProfile)

    // Save AI response
    await ctx.db.insert("chatMessages", {
      userId: args.userId,
      role: "assistant",
      content: aiResponse,
      createdAt: now + 1,
    })
  },
})

export const getMessagesByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("asc")
      .collect()
  },
})

export const clearMessages = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    for (const message of messages) {
      await ctx.db.delete(message._id)
    }
  },
})

// Mock AI response generator
function generateAIResponse(message: string, skinProfile?: { skinType: string; concerns: string[] }): string {
  const lowerMessage = message.toLowerCase()

  // Routine questions
  if (lowerMessage.includes("routine") || lowerMessage.includes("steps")) {
    if (skinProfile?.concerns.includes("acne")) {
      return `Based on your acne-prone ${skinProfile.skinType} skin, here's a recommended routine:

Morning:
1. Gentle cleanser with salicylic acid
2. Niacinamide serum to reduce inflammation
3. Lightweight moisturizer
4. SPF 50 sunscreen (essential!)

Evening:
1. Oil cleanser to remove makeup/sunscreen
2. Gentle cleanser
3. Benzoyl peroxide or retinol treatment
4. Hydrating moisturizer

Remember to introduce new products slowly and patch test first!`
    }
    return `A basic skincare routine should include:

Morning:
1. Gentle cleanser
2. Toner (optional)
3. Serum (vitamin C is great for morning)
4. Moisturizer
5. Sunscreen (SPF 30+)

Evening:
1. Cleanser
2. Toner
3. Treatment (retinol, acids, etc.)
4. Moisturizer

Consistency is key! Give products at least 4-6 weeks to show results.`
  }

  // Redness questions
  if (lowerMessage.includes("redness") || lowerMessage.includes("inflammation")) {
    return `To reduce redness and inflammation:

1. Use gentle, fragrance-free products
2. Look for soothing ingredients like:
   - Niacinamide
   - Centella asiatica
   - Green tea extract
   - Azelaic acid

3. Avoid harsh scrubs and hot water
4. Always use SPF to prevent further irritation
5. Consider a barrier repair moisturizer with ceramides

If redness persists, consult a dermatologist as it could be rosacea or another condition.`
  }

  // Ingredient questions
  if (lowerMessage.includes("ingredient") || lowerMessage.includes("avoid")) {
    if (skinProfile?.concerns.includes("acne")) {
      return `For acne-prone skin, avoid:
- Heavy oils (coconut oil, olive oil)
- Comedogenic ingredients
- Harsh alcohols
- Fragrances

Look for:
- Salicylic acid (BHA)
- Benzoyl peroxide
- Niacinamide
- Retinoids
- Tea tree oil

Always check if products are non-comedogenic!`
    }
    return `Generally avoid:
- Harsh sulfates (SLS)
- Denatured alcohol
- Synthetic fragrances
- Essential oils (if sensitive)

Look for:
- Hyaluronic acid (hydration)
- Niacinamide (multi-purpose)
- Ceramides (barrier repair)
- Vitamin C (brightening)
- Retinol (anti-aging, acne)`
  }

  // Exfoliation questions
  if (lowerMessage.includes("exfoliat")) {
    return `Exfoliation frequency depends on your skin:

Oily/Acne-prone: 2-3 times per week
Normal/Combination: 2 times per week
Dry/Sensitive: 1 time per week

Types of exfoliation:
- Chemical (AHAs, BHAs) - gentler, more effective
- Physical (scrubs) - can be harsh if not careful

Start slowly and always use sunscreen after exfoliating!`
  }

  // Product recommendations
  if (lowerMessage.includes("product") || lowerMessage.includes("recommend")) {
    if (skinProfile) {
      return `Based on your ${skinProfile.skinType} skin with concerns about ${skinProfile.concerns.join(", ")}, I recommend:

1. CeraVe Foaming Cleanser - gentle and effective
2. The Ordinary Niacinamide 10% + Zinc 1% - reduces blemishes
3. CeraVe PM Facial Moisturizing Lotion - lightweight hydration
4. La Roche-Posay Anthelios SPF 50 - excellent sun protection

Check out the Products page for more personalized recommendations!`
    }
    return `I'd love to recommend products! Could you tell me more about:
- Your skin type (oily, dry, combination, sensitive)
- Your main concerns (acne, dryness, aging, etc.)
- Your budget range

Or complete your skin profile in the onboarding to get personalized recommendations!`
  }

  // Acne scar questions
  if (
    lowerMessage.includes("scar") ||
    lowerMessage.includes("dark spot") ||
    lowerMessage.includes("hyperpigmentation")
  ) {
    return `To fade acne scars and dark spots:

1. Vitamin C serum (morning) - brightens and evens tone
2. Niacinamide - reduces hyperpigmentation
3. Retinol (evening) - increases cell turnover
4. Azelaic acid - targets dark spots
5. SPF daily - prevents darkening

Be patient! It takes 8-12 weeks to see results. For severe scarring, consider professional treatments like chemical peels or microneedling.`
  }

  // Default response
  return `I'm here to help with your skincare questions! I can assist with:

- Skincare routines and product recommendations
- Ingredient information and what to avoid
- Tips for specific concerns (acne, dryness, aging)
- How to use different products correctly

What would you like to know more about?`
}
