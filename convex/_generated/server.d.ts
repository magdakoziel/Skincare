/* eslint-disable */
/**
 * Generated utilities for implementing server-side Convex query and mutation functions.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { ActionBuilder, HttpActionBuilder, MutationBuilder, QueryBuilder } from "convex/server"
import type { DataModel } from "./dataModel.js"

/**
 * Define a query in this Convex app's public API.
 *
 * This function will be allowed to read your Convex database and will be accessible from the client.
 *
 * @param func - The query function. It receives a `QueryCtx` as its first argument.
 * @returns The wrapped query. Include this as an export to name it and make it accessible.
 */
export declare const query: QueryBuilder<DataModel, "public">

/**
 * Define a mutation in this Convex app's public API.
 *
 * This function will be allowed to modify your Convex database and will be accessible from the client.
 *
 * @param func - The mutation function. It receives a `MutationCtx` as its first argument.
 * @returns The wrapped mutation. Include this as an export to name it and make it accessible.
 */
export declare const mutation: MutationBuilder<DataModel, "public">

/**
 * Define an action in this Convex app's public API.
 *
 * An action is a function which can execute any JavaScript code, including non-deterministic
 * code and code with side-effects, like calling third-party services.
 *
 * @param func - The action function. It receives an `ActionCtx` as its first argument.
 * @returns The wrapped action. Include this as an export to name it and make it accessible.
 */
export declare const action: ActionBuilder<DataModel, "public">

/**
 * Define an HTTP action.
 *
 * This function will be used to respond to HTTP requests received by a Convex
 * deployment if the requests match the path and method where this action
 * is routed.
 *
 * @param func - The function. It receives an `ActionCtx` as its first argument, and a `Request` object as its second.
 * @returns The wrapped HTTP action.
 */
export declare const httpAction: HttpActionBuilder
