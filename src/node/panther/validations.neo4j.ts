import { InvalidRequestError } from "../api/models.errors"

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
