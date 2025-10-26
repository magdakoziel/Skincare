import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const generateRoutine = mutation({
  args: {
    userId: v.id("users"),
    skinType: v.string(),
    concerns: v.array(v.string()),
    budget: v.string(),
  },
  handler: async (ctx, args) => {
    // Mock AI-generated routines based on skin profile
    const morningSteps = generateMorningRoutine(args.skinType, args.concerns, args.budget)
    const eveningSteps = generateEveningRoutine(args.skinType, args.concerns, args.budget)

    // Delete existing routines
    const existingRoutines = await ctx.db
      .query("routines")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    for (const routine of existingRoutines) {
      await ctx.db.delete(routine._id)
    }

    // Create new routines
    const now = Date.now()

    await ctx.db.insert("routines", {
      userId: args.userId,
      type: "morning",
      steps: morningSteps,
      generatedAt: now,
    })

    await ctx.db.insert("routines", {
      userId: args.userId,
      type: "evening",
      steps: eveningSteps,
      generatedAt: now,
    })
  },
})

export const getRoutinesByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("routines")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()
  },
})

// Mock AI routine generation functions
function generateMorningRoutine(skinType: string, concerns: string[], budget: string) {
  const baseRoutine = [
    {
      order: 1,
      product: "Gentle Cleanser",
      instructions: "Wash your face with lukewarm water to remove overnight oils",
    },
    { order: 2, product: "Toner", instructions: "Apply toner to balance pH and prep skin for treatments" },
  ]

  // Add treatment based on concerns
  if (concerns.includes("acne") || concerns.includes("blackheads")) {
    baseRoutine.push({
      order: 3,
      product: "Salicylic Acid Serum",
      instructions: "Apply a thin layer to target acne and prevent breakouts",
    })
  } else if (concerns.includes("redness")) {
    baseRoutine.push({
      order: 3,
      product: "Niacinamide Serum",
      instructions: "Apply to reduce redness and strengthen skin barrier",
    })
  }

  // Add moisturizer based on skin type
  if (skinType === "oily") {
    baseRoutine.push({
      order: 4,
      product: "Lightweight Gel Moisturizer",
      instructions: "Apply oil-free moisturizer to hydrate without clogging pores",
    })
  } else if (skinType === "dry") {
    baseRoutine.push({
      order: 4,
      product: "Rich Cream Moisturizer",
      instructions: "Apply generous amount to lock in moisture",
    })
  } else {
    baseRoutine.push({
      order: 4,
      product: "Balanced Moisturizer",
      instructions: "Apply to hydrate and protect your skin",
    })
  }

  // Always add sunscreen
  baseRoutine.push({
    order: 5,
    product: "SPF 50 Sunscreen",
    instructions: "Apply generously as the final step to protect from UV damage",
  })

  return baseRoutine
}

function generateEveningRoutine(skinType: string, concerns: string[], budget: string) {
  const baseRoutine = [
    { order: 1, product: "Oil Cleanser", instructions: "Remove makeup and sunscreen with an oil-based cleanser" },
    { order: 2, product: "Gentle Cleanser", instructions: "Follow with water-based cleanser for double cleanse" },
    { order: 3, product: "Toner", instructions: "Apply toner to balance pH and prep skin" },
  ]

  // Add treatment based on concerns
  if (concerns.includes("acne")) {
    baseRoutine.push({
      order: 4,
      product: "Benzoyl Peroxide Treatment",
      instructions: "Apply spot treatment to active breakouts",
    })
  }

  if (concerns.includes("scarring") || concerns.includes("fine-lines")) {
    baseRoutine.push({
      order: 5,
      product: "Vitamin C Serum",
      instructions: "Apply to fade marks and reduce fine lines",
    })
  }

  // Add moisturizer
  if (skinType === "oily") {
    baseRoutine.push({
      order: 6,
      product: "Lightweight Night Cream",
      instructions: "Apply oil-free night cream for overnight repair",
    })
  } else {
    baseRoutine.push({
      order: 6,
      product: "Rich Night Cream",
      instructions: "Apply generous amount for deep overnight hydration",
    })
  }

  return baseRoutine
}
