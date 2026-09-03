/** Neo4j Map — unordered key-value pairs with string keys.
 * A MAP is a Cypher constructed type: it cannot be stored as a native node
 * property, so extras must be persisted serialized (e.g. JSON string) or passed
 * as a query parameter. Values are runtime-validated to a JSON-like subset of
 * Neo4j-supported values before storage (see validateNeo4jMap in
 * validations.neo4j.ts). */
export type Neo4jMap = { [key: string]: unknown }
