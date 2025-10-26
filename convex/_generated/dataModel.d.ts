/* eslint-disable */
/**
 * Generated data model types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  DataModelFromSchemaDefinition,
  DocumentByName,
  TableNamesInDataModel,
  SystemTableNames,
} from "convex/server"
import type { GenericId } from "convex/values"
import type schema from "../schema.js"

/**
 * The names of all of your Convex tables.
 */
export type TableNames = TableNamesInDataModel<DataModel>

/**
 * The type of a document stored in Convex.
 */
export type Doc<TableName extends TableNames> = DocumentByName<DataModel, TableName>

/**
 * An identifier for a document in Convex.
 */
export type Id<TableName extends TableNames | SystemTableNames> = GenericId<TableName>

/**
 * The data model of your Convex project.
 */
export type DataModel = DataModelFromSchemaDefinition<typeof schema>
