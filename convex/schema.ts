import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    onboardingCompleted: v.boolean(),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  skinProfiles: defineTable({
    userId: v.id("users"),
    skinType: v.string(),
    concerns: v.array(v.string()),
    allergies: v.optional(v.string()),
    budget: v.string(),
    currentProducts: v.optional(v.string()),
    goals: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  photos: defineTable({
    userId: v.id("users"),
    storageId: v.string(),
    url: v.string(),
    caption: v.optional(v.string()),
    analysisResult: v.optional(
      v.object({
        acneType: v.string(),
        severity: v.string(),
        affectedAreas: v.array(v.string()),
        recommendations: v.array(v.string()),
      }),
    ),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  routines: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("morning"), v.literal("evening")),
    steps: v.array(
      v.object({
        order: v.number(),
        product: v.string(),
        instructions: v.string(),
      }),
    ),
    generatedAt: v.number(),
  }).index("by_user", ["userId"]),

  chatMessages: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
})
