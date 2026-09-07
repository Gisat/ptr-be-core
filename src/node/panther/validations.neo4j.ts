import { InvalidRequestError, ServerError } from "../api/models.errors"
import { Nullable } from "../../globals/coding/code.types"
import { Neo4jMap } from "./models.neo4j"

/** Scalar values a Neo4j Map value can hold — strings, numbers, booleans and null. */
const isNeo4jScalar = (value: unknown): value is string | number | boolean | null => {
  if (value === null)
    return true

  if (typeof value === "string" || typeof value === "boolean")
    return true

  // JSON numbers are always finite; NaN/Infinity cannot be stored in Neo4j
  return typeof value === "number" && Number.isFinite(value)
}

/** True when the value is a plain object (not an array, Date, class instance, etc.). */
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null)
    return false

  const prototype = Object.getPrototypeOf(value)

  return prototype === Object.prototype || prototype === null
}

const unsupportedValueError = (path: string) =>
  new InvalidRequestError(`Value of "${path}" is not supported in a Neo4j Map. Supported values are strings, numbers, booleans, null, arrays, and nested objects.`)

const unsupportedPropertyValueError = (path: string) =>
  new InvalidRequestError(`Value of "${path}" is not supported as a Neo4j property value. Supported values are strings, numbers, booleans, null, and arrays of these scalar values.`)

/**
 * Deeply validate a single value — it must be a scalar, an array of supported values,
 * or a plain object of supported values.
 *
 * @param value - The value to validate.
 * @param path - Human-readable location of the value used in error messages.
 * @throws {InvalidRequestError} If the value (or any nested value) is unsupported.
 */
const validateNeo4jMapValue = (value: unknown, path: string): void => {
  if (isNeo4jScalar(value))
    return

  if (Array.isArray(value)) {
    value.forEach((item, index) => validateNeo4jMapValue(item, `${path}[${index}]`))

    return
  }

  if (isPlainObject(value)) {
    for (const [key, nestedValue] of Object.entries(value))
      validateNeo4jMapValue(nestedValue, `${path}.${key}`)

    return
  }

  throw unsupportedValueError(path)
}

/**
 * Validate an optional extras value from a request body.
 * Absent extras (undefined/null) are allowed. When provided, extras must be a
 * plain object whose keys are strings and whose values are recursively limited
 * to Neo4j-supported values — scalars, arrays, and nested objects.
 *
 * @param extras - Raw request body extras value.
 * @param path - Property path prefix used in error messages (default "extras").
 * @throws {InvalidRequestError} If extras is present but is not a valid Neo4j Map.
 */
export const validateNeo4jMap = (extras: unknown, path = "extras"): void => {
  if (extras === undefined || extras === null)
    return

  if (!isPlainObject(extras))
    throw unsupportedValueError(path)

  for (const [key, value] of Object.entries(extras))
    validateNeo4jMapValue(value, `${path}.${key}`)
}

/**
 * Deeply validate a single Neo4j property value — it must be a scalar or an
 * array of scalars. Objects are constructed types and cannot be stored as
 * properties.
 *
 * @param value - The property value to validate.
 * @param path - Human-readable location of the value used in error messages.
 * @throws {InvalidRequestError} If the value (or any array item) is unsupported.
 */
const validateNeo4jPropertyValue = (value: unknown, path: string): void => {
  if (isNeo4jScalar(value))
    return

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      if (!isNeo4jScalar(item))
        throw unsupportedPropertyValueError(`${path}[${index}]`)
    })

    return
  }

  throw unsupportedPropertyValueError(path)
}

/**
 * Validate an optional properties value from a request body.
 * Absent properties (undefined/null) are allowed. When provided, properties
 * must be a plain object whose keys are strings and whose values are limited
 * to Neo4j property types — scalars and arrays of scalars. Unlike a Neo4j
 * Map, nested objects are rejected, as properties map 1:1 to stored property
 * values.
 *
 * @param properties - Raw request body properties value.
 * @param path - Property path prefix used in error messages (default "properties").
 * @throws {InvalidRequestError} If properties is present but holds unsupported values.
 */
export const validateNeo4jProperties = (properties: unknown, path = "properties"): void => {
  if (properties === undefined || properties === null)
    return

  if (!isPlainObject(properties))
    throw unsupportedPropertyValueError(path)

  for (const [key, value] of Object.entries(properties))
    validateNeo4jPropertyValue(value, `${path}.${key}`)
}

/**
 * Serialize a Neo4j Map into a JSON string for storage as a node property.
 * A MAP is a Cypher constructed type and cannot be stored as a property, so
 * non-null map-typed values are persisted as JSON strings. Null/absent values
 * pass through as null.
 *
 * @param value - Neo4j Map (or null/undefined) to serialize.
 * @param path - Property path prefix used in error messages (default "extras").
 * @returns JSON string of the map, or null when the value is absent.
 * @throws {InvalidRequestError} If the value is present but not a valid Neo4j Map.
 */
export const serializeNeo4jMap = (value: unknown, path = "extras"): Nullable<string> => {
  if (value === undefined || value === null)
    return null

  validateNeo4jMap(value, path)

  return JSON.stringify(value)
}

/**
 * Decode a stored map-typed property value back into a Neo4j Map. Symmetric
 * counterpart of serializeNeo4jMap — accepts the JSON string produced by it,
 * tolerates already-object values, and maps null/absent to null.
 *
 * @param value - Stored property value (JSON string, Neo4j Map, or null/undefined).
 * @param path - Property path prefix used in error messages (default "extras").
 * @returns Decoded Neo4j Map, or null when the value is absent.
 * @throws {ServerError} If the value cannot be decoded (malformed JSON or unsupported type).
 * @throws {InvalidRequestError} If the decoded value is not a valid Neo4j Map.
 */
export const parseNeo4jMap = (value: unknown, path = "extras"): Nullable<Neo4jMap> => {
  if (value === undefined || value === null)
    return null

  if (typeof value === "string") {
    let parsed: unknown

    try {
      parsed = JSON.parse(value)
    } catch {
      throw new ServerError(`Value of "${path}" is not a valid serialized Neo4j Map — the stored string is not valid JSON.`)
    }

    validateNeo4jMap(parsed, path)

    return parsed as Nullable<Neo4jMap>
  }

  if (isPlainObject(value)) {
    validateNeo4jMap(value, path)

    return value as Neo4jMap
  }

  throw new ServerError(`Value of "${path}" cannot be decoded into a Neo4j Map. Expected a JSON string produced by serializeNeo4jMap, a Neo4j Map object, or null.`)
}
