/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { ApiFromModules } from "convex/server"
import type * as chatMessages from "../chatMessages.js"
import type * as photos from "../photos.js"
import type * as routines from "../routines.js"
import type * as skinProfiles from "../skinProfiles.js"
import type * as users from "../users.js"

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export const api: ApiFromModules<{
  chatMessages: typeof chatMessages
  photos: typeof photos
  routines: typeof routines
  skinProfiles: typeof skinProfiles
  users: typeof users
}> = {} as any
