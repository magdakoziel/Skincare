import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createSkinProfile = mutation({
  args: {
    userId: v.id("users"),
    skinType: v.string(),
    concerns: v.array(v.string()),
    allergies: v.optional(v.string()),
    budget: v.string(),
    currentProducts: v.optional(v.string()),
    goals: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()

    const profileId = await ctx.db.insert("skinProfiles", {
      userId: args.userId,
      skinType: args.skinType,
      concerns: args.concerns,
      allergies: args.allergies,
      budget: args.budget,
      currentProducts: args.currentProducts,
      goals: args.goals,
      createdAt: now,
      updatedAt: now,
    })

    return profileId
  },
})

export const getSkinProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("skinProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first()
  },
})

export const updateSkinProfile = mutation({
  args: {
    profileId: v.id("skinProfiles"),
    skinType: v.optional(v.string()),
    concerns: v.optional(v.array(v.string())),
    allergies: v.optional(v.string()),
    budget: v.optional(v.string()),
    currentProducts: v.optional(v.string()),
    goals: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { profileId, ...updates } = args

    await ctx.db.patch(profileId, {
      ...updates,
      updatedAt: Date.now(),
    })
  },
})
