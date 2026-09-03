/** Neo4j Map value — scalar, list of values, or nested map. */
export type Neo4jMapValue = string | number | boolean | null | Neo4jMapValue[] | { [key: string]: Neo4jMapValue }

/** Neo4j Map — unordered key-value pairs with string keys. */
export type Neo4jMap = { [key: string]: Neo4jMapValue }
