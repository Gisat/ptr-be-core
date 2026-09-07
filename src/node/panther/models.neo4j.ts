/** Neo4j Map — unordered key-value pairs with string keys.
 * A MAP is a Cypher constructed type: it cannot be stored as a native node
 * property. Persist map-typed values as a JSON string property using
 * serializeNeo4jMap and decode stored values back with parseNeo4jMap (both
 * in validations.neo4j.ts). Values are runtime-validated to a JSON-like
 * subset of Neo4j-supported values (see validateNeo4jMap in
 * validations.neo4j.ts). */
export type Neo4jMap = { [key: string]: unknown }
