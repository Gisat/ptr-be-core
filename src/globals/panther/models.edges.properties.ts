/**
 * Represents the basic shared properties of all edges in the system.
 * This interface allows for dynamic key-value pairs where the keys are strings
 * and the values can be of type string, number, boolean, or null.
 *
 * @remarks
 * - This interface is designed to be a flexible structure for edge properties.
 * - It is intended to be extended or used as a base for more specific edge property definitions.
 * @property [key: string] - A dynamic key-value pair where the key is a string
 * and the value can be a string, number, boolean, or null.
 */
export interface EdgePropertiesBasic {
    // TODO: Some basic shared part of properties inside all edges
    [key: string]: string | number | boolean | null
}

/**
 * Represents the properties of an edge for a PostGIS location.
 * This interface extends the basic edge properties and includes
 * additional details specific to PostGIS integration.
 *
 * @interface EdgeForPostgisLocationProperties
 * @extends EdgePropertiesBasic
 *
 * @property {string} tableName - The name of the PostGIS table.
 * @property {string} column - The name of the column in the specified PostGIS table.
 * @property {string | number | null} featureId - The ID of the PostGIS feature.
 * @property {string | null} featureIdColumn - The name of the column in the specified PostGIS table that contains the feature ID.
 * @property {string | null} periodIso - The ISO 8601 period, e.g., "2025", "2025-01-01", or "2020-01-01/2020-12-31".
 */
export interface EdgeForPostgisLocationProperties extends EdgePropertiesBasic {
    tableName: string // Postgis table name
    column: string // Postgis column name inside mentioned table
    featureId: string | number | null // Postgis feature ID
    featureIdColumn: string | null // Postgis column name inside mentioned table that contains feature ID
    periodIso: string | null // ISO 8601 period, e.g. "2025", "2025-01-01", "2020-01-01/2020-12-31"
}



/**
 * Represents a union type for edge properties, which can be either
 * `EdgeForPostgisLocationProperties` or `EdgePropertiesBasic`.
 * This type is used to define the possible properties of an edge
 * in the application.
 */
export type OneOfEdgeProperties =
    EdgeForPostgisLocationProperties |
    EdgePropertiesBasic