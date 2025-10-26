import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createPhoto = mutation({
  args: {
    userId: v.id("users"),
    storageId: v.string(),
    url: v.string(),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const photoId = await ctx.db.insert("photos", {
      userId: args.userId,
      storageId: args.storageId,
      url: args.url,
      caption: args.caption,
      createdAt: Date.now(),
    })

    return photoId
  },
})

export const getPhotosByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("photos")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()
  },
})

export const analyzePhotoWithAI = mutation({
  args: {
    photoId: v.id("photos"),
  },
  handler: async (ctx, args) => {
    // Mock AI analysis - in production, this would call an actual AI service
    const mockAnalysis = generateMockAnalysis()

    await ctx.db.patch(args.photoId, {
      analysisResult: mockAnalysis,
    })

    return mockAnalysis
  },
})

export const updatePhotoAnalysis = mutation({
  args: {
    photoId: v.id("photos"),
    analysisResult: v.object({
      acneType: v.string(),
      severity: v.string(),
      affectedAreas: v.array(v.string()),
      recommendations: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.photoId, {
      analysisResult: args.analysisResult,
    })
  },
})

export const deletePhoto = mutation({
  args: { photoId: v.id("photos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.photoId)
  },
})

// Mock AI analysis generator
function generateMockAnalysis() {
  const acneTypes = ["Comedonal Acne", "Inflammatory Acne", "Cystic Acne", "Hormonal Acne", "Mild Acne"]
  const severities = ["Mild", "Moderate", "Severe"]
  const areas = ["Forehead", "Cheeks", "Chin", "Nose", "Jawline"]

  const randomAcneType = acneTypes[Math.floor(Math.random() * acneTypes.length)]
  const randomSeverity = severities[Math.floor(Math.random() * severities.length)]
  const randomAreas = areas.slice(0, Math.floor(Math.random() * 3) + 1)

  const recommendations = [
    "Use a gentle cleanser twice daily",
    "Apply salicylic acid treatment to affected areas",
    "Avoid touching your face throughout the day",
    "Change pillowcases regularly",
    "Stay hydrated and maintain a balanced diet",
  ]

  return {
    acneType: randomAcneType,
    severity: randomSeverity,
    affectedAreas: randomAreas,
    recommendations: recommendations.slice(0, 3),
  }
}
