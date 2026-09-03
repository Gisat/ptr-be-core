/** Type that can be T or null */
type Nullable<T> = T | null

/** Type that can be T or undefined */
type Unsure<T> = T | undefined

/** Type that can be T or undefined or null */
type Nullish<T> = T | undefined | null

/** Promise that may be undefined */
type UsurePromise<T> = Unsure<Promise<T>>

/** Neo4j Map value — scalar, list of values, or nested map. */
type Neo4jMapValue = string | number | boolean | null | Neo4jMapValue[] | { [key: string]: Neo4jMapValue }

/** Neo4j Map — unordered key-value pairs with string keys. */
type Neo4jMap = { [key: string]: Neo4jMapValue }

export type {
    Nullable,
    Nullish,
    Unsure,
    UsurePromise,
    Neo4jMap,
    Neo4jMapValue
}